# Cheftory WebView UI 아키텍처

> Cheftory WebView 애플리케이션의 반응형 UI 아키텍처에 대한 종합 가이드입니다.

---

## 목차

1. [개요](#개요)
2. [아키텍처 개요](#아키텍처-개요)
3. [반응형 디자인 시스템](#반응형-디자인-시스템)
4. [컨트롤러 패턴](#컨트롤러-패턴)
5. [파일 구조](#파일-구조)
6. [컴포넌트 패턴](#컴포넌트-패턴)
7. [스타일링 패턴](#스타일링-패턴)
8. [뷰에서의 상태 관리](#뷰에서의-상태-관리)
9. [모범 사례](#모범-사례)

---

## 개요

### 이 아키텍처는 무엇인가요?

Cheftory WebView UI 아키텍처는 Feature-Sliced Design 원칙을 기반으로 구축된 **뷰포트 우선 반응형 디자인 시스템(viewport-first responsive design system)**입니다. 장치 유형(모바일, 태블릿, 데스크톱)에 따라 UI 관심사를 분리하는 동시에, 컨트롤러 패턴을 통해 비즈니스 로직을 공유합니다.

### 왜 이렇게 설계되었나요?

| 목표 | 해결책 |
|------|----------|
| **장치 최적화 UX** | 각 장치 클래스에 대해 별도의 뷰포트 컴포넌트 사용 |
| **코드 유지보수성** | 컨트롤러 로직 공유, UI 구현체 격리 |
| **성능** | 런타임에 필요한 뷰포트 컴포넌트만 로드 |
| **확장성** | 명확한 패턴으로 새로운 페이지 추가 시 예측 가능성 확보 |
| **팀 협업** | 개발자들이 서로 다른 뷰포트 작업을 병렬로 진행 가능 |

### 주요 장점

- **명확한 관심사 분리**: 비즈니스 로직(컨트롤러)과 UI(뷰포트 컴포넌트)의 분리
- **장치별 최적의 UX**: 모바일, 태블릿, 데스크톱에 맞춤화된 레이아웃
- **코드 중복 감소**: 여러 뷰포트에서 공통 컴포넌트 공유
- **타입 안정성**: TypeScript 인터페이스를 통해 뷰포트 간 일관된 Props 보장
- **SSR 안정성**: 서버 사이드 렌더링 시의 에지 케이스 처리가 내장됨

---

## 아키텍처 개요

### 하이레벨 다이어그램

```
                                   +------------------+
                                   |   pages/*.tsx    |
                                   |  (Next.js Pages) |
                                   +--------+---------+
                                            |
                                            v
+-----------------------------------------------------------------------------------+
|                              src/views/{page}/ui/                                  |
|                                                                                    |
|  +-----------------------------------------------------------------------------+  |
|  |                            index.tsx (진입점)                                 |  |
|  |                                                                             |  |
|  |    ResponsiveSwitcher를 사용하여 적절한 뷰포트 컴포넌트를 렌더링합니다.             |  |
|  +-----------------------------------+-----------------------------------------+  |
|                                      |                                            |
|          +---------------------------+---------------------------+                |
|          |                           |                           |                |
|          v                           v                           v                |
|  +---------------+          +----------------+          +-----------------+       |
|  | *.mobile.tsx  |          | *.tablet.tsx   |          | *.desktop.tsx   |       |
|  |   (0-767px)   |          |  (768-1023px)  |          |   (1024px+)     |       |
|  +-------+-------+          +-------+--------+          +--------+--------+       |
|          |                          |                            |                |
|          +---------------+----------+----------------------------+                |
|                          |                                                        |
|                          v                                                        |
|  +-----------------------------------------------------------------------------+  |
|  |                   *.controller.tsx (공유 비즈니스 로직)                         |  |
|  |                                                                             |  |
|  |   - useHomePageController("mobile" | "tablet" | "desktop")                  |  |
|  |   - 반환값: HomePageProps (타입 정의된 인터페이스)                                |  |
|  |   - 포함 내용: hooks, handlers, 변형별(variant-specific) 구성 설정               |  |
|  +-----------------------------------------------------------------------------+  |
|                                                                                    |
|  +-----------------------------------------------------------------------------+  |
|  |                      *.common.tsx (공유 UI 컴포넌트)                           |  |
|  |                                                                             |  |
|  |   - 여러 뷰포트에서 사용되는 컴포넌트                                            |  |
|  |   - 미세한 스타일 조정을 위해 isTablet/variant props를 수용                     |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

### 데이터 흐름

```
+-------------+     +--------------+     +------------------+     +--------------+
|   Page      | --> | index.tsx    | --> | ResponsiveSwitcher| --> | 뷰포트         |
| (Next.js)   |     | (뷰 진입점)    |     | (장치 체크)        |     | 컴포넌트       |
+-------------+     +--------------+     +------------------+     +------+-------+
                                                                           |
                                                                           v
                                                                   +--------------+
                                                                   | 컨트롤러       |
                                                                   | Hook         |
                                                                   +------+-------+
                                                                           |
                             +---------------------------------------------+
                             |                    |                        |
                             v                    v                        v
                     +--------------+    +--------------+    +----------------------+
                     | React Query  |    | Zustand      |    | 이벤트 핸들러          |
                     | (서버 데이터)  |    | (클라이언트 데이터)|    | (사용자 상호작용)      |
                     +--------------+    +--------------+    +----------------------+
```

---

## 반응형 디자인 시스템

### 브레이크포인트 정의

위치: `src/shared/constants/breakpoints.ts`

| 장치 | 브레이크포인트 범위 | Tailwind 접두사 | 미디어 쿼리 |
|--------|-----------------|-----------------|-------------|
| **Mobile** | 0 - 767px | (없음) | `(max-width: 767px)` |
| **Tablet** | 768 - 1023px | `md:` | `(min-width: 768px) and (max-width: 1023px)` |
| **Desktop** | 1024px+ | `lg:`, `xl:`, `2xl:` | `(min-width: 1024px)` |

```typescript
// src/shared/constants/breakpoints.ts

export const BREAKPOINTS = {
  mobile: 767,      // 모바일 최대 너비
  tablet: 768,      // 태블릿 최소 너비
  tabletMax: 1023,  // 태블릿 최대 너비
  desktop: 1024,    // 데스크톱 최소 너비
} as const;

export const MEDIA_QUERIES = {
  mobile: `(max-width: ${BREAKPOINTS.mobile}px)`,
  tablet: `(min-width: ${BREAKPOINTS.tablet}px) and (max-width: ${BREAKPOINTS.tabletMax}px)`,
  tabletUp: `(min-width: ${BREAKPOINTS.tablet}px)`,
  desktop: `(min-width: ${BREAKPOINTS.desktop}px)`,
} as const;

export type DeviceType = "mobile" | "tablet" | "desktop";
```

### useMediaQuery Hook

위치: `src/shared/hooks/useMediaQuery.ts`

```typescript
import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
```

### ResponsiveSwitcher 컴포넌트

위치: `src/shared/ui/responsive/ResponsiveSwitcher.tsx`

`ResponsiveSwitcher`는 뷰포트 전환을 처리하는 핵심 컴포넌트입니다.

```typescript
import { useMediaQuery } from "@/src/shared/hooks/useMediaQuery";
import { MEDIA_QUERIES } from "@/src/shared/constants/breakpoints";
import type { ComponentType, ReactNode } from "react";

type ResponsiveComponents<P> = {
  mobile: ComponentType<P>;
  tablet: ComponentType<P>;
  desktop: ComponentType<P>;
};

type ResponsiveSwitcherProps<P> = ResponsiveComponents<P> & {
  props: P;
  fallback?: ReactNode;
};

export function ResponsiveSwitcher<P extends object>({
  mobile: Mobile,
  tablet: Tablet,
  desktop: Desktop,
  props,
  fallback = null,
}: ResponsiveSwitcherProps<P>) {
  const isMobile = useMediaQuery(MEDIA_QUERIES.mobile);
  const isDesktop = useMediaQuery(MEDIA_QUERIES.desktop);

  // SSR 안정성 확보
  if (typeof window === "undefined") {
    return <>{fallback}</>;
  }

  if (isMobile) return <Mobile {...props} />;
  if (isDesktop) return <Desktop {...props} />;
  return <Tablet {...props} />;
}
```

### ResponsiveSwitcher의 변형들

| 컴포넌트 | 사용 사례 |
|-----------|----------|
| `ResponsiveSwitcher` | 기본적인 뷰포트 전환 |
| `ResponsiveSwitcherWithSkeleton` | 로딩 스켈레톤 지원 포함 |
| `useResponsiveComponent` | 현재 뷰포트 컴포넌트를 가져오기 위한 Hook |

---

## 컨트롤러 패턴

### 컨트롤러의 역할

컨트롤러는 그렇지 않으면 각 뷰포트 컴포넌트에 중복되었을 비즈니스 로직을 중앙 집중화합니다:

1. **데이터 페칭(Data Fetching)**: React Query hooks
2. **상태 관리(State Management)**: Zustand stores, local state
3. **이벤트 핸들러(Event Handlers)**: 클릭, 제출, 내비게이션 핸들러
4. **번역(Translations)**: i18n 통합
5. **변형 구성(Variant Configuration)**: 장치별 값 (크기, 클래스 등)

### Props 인터페이스 패턴

모든 컨트롤러는 뷰포트 컴포넌트를 위한 타입 정의된 인터페이스를 정의합니다:

```typescript
// src/views/home/ui/HomePage.controller.tsx

export type HomePageVariant = "mobile" | "tablet" | "desktop";

export interface HomePageProps {
  logo: React.ReactNode;
  searchBar: React.ReactNode | null;
  header: {
    balance: React.ReactNode;
    profileButton: React.ReactNode;
  };
  sections: {
    challengeBanner: React.ReactNode;
    categorySection: React.ReactNode;
    myRecipes: React.ReactNode;
    popularRecipes: React.ReactNode;
    popularShorts: React.ReactNode;
  };
  floatingButton: React.ReactNode;
  renderToast: (viewportClassName: string) => React.ReactNode;
}
```

### 컨트롤러 Hook 구현

```typescript
export function useHomePageController(variant: HomePageVariant): HomePageProps {
  const router = useRouter();
  const { t } = useHomeTranslation();
  const lang = useLangcode();

  // 네이티브 WebView를 위한 Safe area 설정
  useSafeArea({
    top: { color: "transparent", isExists: true },
    bottom: { color: "#FFFFFF", isExists: false },
  });

  // 변형별 구성 설정
  const logoClassName = {
    mobile: "h-[20px] w-auto pl-2",
    tablet: "h-[24px] md:h-[28px] w-auto",
    desktop: "h-[32px] xl:h-[36px] w-auto",
  }[variant];

  const searchBarClassName = {
    mobile: "flex flex-row items-center px-4 w-full h-[36px] ...",
    tablet: "flex flex-row items-center px-5 w-full max-w-[600px] ...",
    desktop: "flex flex-row items-center px-6 w-full max-w-[800px] ...",
  }[variant];

  return {
    logo: <img src={logoSrc} alt="logo" className={logoClassName} />,
    searchBar: /* ... */,
    header: { /* ... */ },
    sections: { /* ... */ },
    floatingButton: <FloatingButton />,
    renderToast: (viewportClassName) => (/* ... */),
  };
}
```

### 뷰포트 컴포넌트가 Props를 받는 방식

```typescript
// src/views/home/ui/HomePage.mobile.tsx

import { useHomePageController, HomePageProps } from "./HomePage.controller";

export function HomePageMobile() {
  const props = useHomePageController("mobile");
  return <HomePageMobileLayout {...props} />;
}

export function HomePageMobileLayout({
  logo,
  searchBar,
  header,
  sections,
  floatingButton,
  renderToast,
}: HomePageProps) {
  return (
    <div className="min-h-screen w-screen w-full overflow-hidden">
      <Header
        leftContent={logo}
        rightContent={
          <div className="flex flex-row items-center gap-2">
            {header.balance}
            {header.profileButton}
          </div>
        }
      />
      {searchBar && <div className="pt-2 px-2">{searchBar}</div>}
      {sections.challengeBanner}
      {sections.categorySection}
      {sections.myRecipes}
      {sections.popularRecipes}
      {sections.popularShorts}
      {floatingButton}
      {renderToast("fixed right-3 top-2 z-1000 w-[300px]")}
    </div>
  );
}
```

---

## 파일 구조

### 디렉토리 구조

```
src/
├── views/
│   └── {page-name}/
│       ├── ui/
│       │   ├── index.tsx              # ResponsiveSwitcher가 포함된 진입점
│       │   ├── {Page}.controller.tsx  # 공유 비즈니스 로직
│       │   ├── {Page}.mobile.tsx      # 모바일 뷰포트 (0-767px)
│       │   ├── {Page}.tablet.tsx      # 태블릿 뷰포트 (768-1023px)
│       │   ├── {Page}.desktop.tsx     # 데스크톱 뷰포트 (1024px+)
│       │   ├── {Page}.common.tsx      # 공유 UI 컴포넌트
│       │   └── {component}.tsx        # 페이지 전용 컴포넌트
│       ├── hooks/
│       │   └── use{Page}Translation.ts
│       └── entities/                   # 페이지 전용 엔티티 (필요한 경우)
│
├── shared/
│   ├── ui/
│   │   ├── responsive/
│   │   │   ├── index.ts
│   │   │   └── ResponsiveSwitcher.tsx
│   │   ├── header/
│   │   ├── card/
│   │   └── ...
│   ├── hooks/
│   │   └── useMediaQuery.ts
│   └── constants/
│       └── breakpoints.ts
│
└── entities/                           # 공유 비즈니스 엔티티
    └── {entity}/
        ├── api/
        ├── model/
        └── ui/
```

### 명명 규칙 (Naming Conventions)

| 파일 유형 | 패턴 | 예시 |
|-----------|---------|---------|
| 진입점 | `index.tsx` | `src/views/home/ui/index.tsx` |
| 컨트롤러 | `{Page}.controller.tsx` | `HomePage.controller.tsx` |
| 모바일 뷰포트 | `{Page}.mobile.tsx` | `HomePage.mobile.tsx` |
| 태블릿 뷰포트 | `{Page}.tablet.tsx` | `HomePage.tablet.tsx` |
| 데스크톱 뷰포트 | `{Page}.desktop.tsx` | `HomePage.desktop.tsx` |
| 공통 컴포넌트 | `{Page}.common.tsx` | `popularRecipes.common.tsx` |
| 페이지 전용 컴포넌트 | `{component}.tsx` | `floatingButton.tsx` |

### Index 파일 패턴

```typescript
// src/views/home/ui/index.tsx

import { ResponsiveSwitcher } from "@/src/shared/ui/responsive";
import { HomePageMobile } from "./HomePage.mobile";
import { HomePageTablet } from "./HomePage.tablet";
import { HomePageDesktop } from "./HomePage.desktop";

function HomePage() {
  return (
    <ResponsiveSwitcher
      mobile={HomePageMobile}
      tablet={HomePageTablet}
      desktop={HomePageDesktop}
      props={{}}
    />
  );
}

export default HomePage;
```

---

## 컴포넌트 패턴

### 공통 컴포넌트 (*.common.tsx)

공통 컴포넌트는 props를 통한 약간의 조정을 거쳐 여러 뷰포트에서 공유됩니다.

```typescript
// src/views/home/ui/popularRecipes.common.tsx

/**
 * 모바일과 태블릿 모두에서 사용되는 레시피 카드
 * @param isTablet - 태블릿 레이아웃을 위한 크기 조정 여부
 */
export function RecipeCardReady({
  recipe,
  isTablet = false,
}: {
  recipe: PopularSummaryRecipeDto;
  isTablet?: boolean;
}) {
  return (
    <div className="flex flex-col h-full">
      <div
        className={`flex relative flex-col ${
          isTablet 
            ? "w-[260px] lg:w-full h-full group" 
            : "w-[320px]"
        }`}
      >
        <div className={`overflow-hidden relative ${
          isTablet 
            ? "rounded-lg h-[146px] lg:h-auto lg:aspect-video" 
            : "rounded-md h-[180px]"
        }`}>
          <img
            src={recipe.videoThumbnailUrl}
            className="block w-full h-full object-cover"
          />
        </div>
        <div className={`font-semibold ${
          isTablet ? "text-sm lg:text-lg" : "text-lg"
        }`}>
          {recipe.recipeTitle}
        </div>
      </div>
    </div>
  );
}
```

### 공유 UI 컴포넌트

`src/shared/ui/`에 위치하며, 애플리케이션 전체에서 사용되는 제네릭 컴포넌트들입니다.

```typescript
// src/shared/ui/card/ViewMoreCard.tsx

interface ViewMoreCardProps {
  href: string;
  label?: string;
}

export function ViewMoreCard({ href, label = "더 보기" }: ViewMoreCardProps) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center rounded-2xl bg-gray-50 
                 border-2 border-dashed border-gray-200 hover:border-orange-300 
                 hover:bg-orange-50 transition-all group aspect-[3/4]"
    >
      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
        {/* 화살표 아이콘 */}
      </div>
      <span className="font-bold text-gray-500 group-hover:text-orange-600">
        {label}
      </span>
    </Link>
  );
}
```

### 기능 전용 컴포넌트

특정 페이지에 속하지만 뷰포트별로 크게 다르지 않은 컴포넌트들입니다:

```typescript
// src/views/home/ui/floatingButton.tsx

export function FloatingButton() {
  // 홈 페이지 전용 구현
  // 모든 뷰포트(모바일, 태블릿, 데스크톱)에서 사용됨
}
```

---

## 스타일링 패턴

### Tailwind CSS 사용법

이 프로젝트는 다음과 같은 관례와 함께 Tailwind CSS 4를 사용합니다:

#### 반응형 접두사 (Responsive Prefixes)

```typescript
// 모바일 우선(Mobile-first) 접근 방식
className="text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl"
//          ^모바일    ^태블릿    ^데스크톱   ^대형화면   ^초대형화면
```

#### 일반적인 브레이크포인트 패턴

```typescript
// 뷰포트에 따라 확장되는 패딩
className="px-4 md:px-6 lg:px-8 xl:px-10"

// 화면 크기에 적응하는 그리드
className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"

// 최대 너비 컨테이너
className="max-w-[1024px] lg:max-w-[1280px] xl:max-w-[1600px]"
```

### 표준 최대 너비(Max-Width) 값

| 뷰포트 | 최대 너비(Max-Width) | 사용처 |
|----------|-----------|-------|
| Mobile | `100%` (전체 너비) | 자연스러운 모바일 제약 |
| Tablet | `max-w-[1024px]` | 제한된 컨테이너 |
| Desktop | `max-w-[1600px]` | 넓은 컨테이너 |
| 검색 바 | `max-w-[600px]` / `max-w-[800px]` / `max-w-[1200px]` | 단계적 너비 |

### 표준 간격(Spacing) 값

```typescript
// 섹션 간 수직 간격
const sectionSpacing = {
  mobile: "mt-4",          // 16px
  tablet: "mt-8 md:mt-12", // 32px - 48px
  desktop: "mt-16 xl:mt-24", // 64px - 96px
};

// 가로 패딩
const containerPadding = {
  mobile: "px-2 md:px-4",
  tablet: "px-6",
  desktop: "px-8 xl:px-10",
};

// flex/grid 레이아웃의 Gap
const itemGap = {
  mobile: "gap-2",
  tablet: "gap-3 md:gap-4",
  desktop: "gap-4 lg:gap-5",
};
```

### 뷰포트 전용 클래스 패턴

```typescript
// 컨트롤러에서 변형별 클래스 설정
const containerClass = {
  mobile: "min-h-screen w-screen overflow-hidden",
  tablet: "min-h-screen w-full bg-white",
  desktop: "min-h-screen w-full bg-white",
}[variant];

const headerGap = {
  mobile: "gap-2",
  tablet: "gap-3",
  desktop: "gap-4",
}[variant];
```

---

## 뷰에서의 상태 관리

### 서버 상태를 위한 React Query

```typescript
// 컨트롤러 Hook 내부
import { useSuspenseQuery } from "@tanstack/react-query";

export function useSearchResultsController(keyword: string) {
  const {
    data: searchResults,
    totalElements,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useFetchRecipesSearched({ query: keyword });

  // 컨트롤러 props의 일부로 반환
  return {
    searchResults,
    totalElements,
    isFetchingNextPage,
    // ...
  };
}
```

### 클라이언트 상태를 위한 Zustand

```typescript
// src/stores/useRecipeStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RecipeStore {
  selectedRecipeId: string | null;
  setSelectedRecipe: (id: string) => void;
}

export const useRecipeStore = create<RecipeStore>()(
  persist(
    (set) => ({
      selectedRecipeId: null,
      setSelectedRecipe: (id) => set({ selectedRecipeId: id }),
    }),
    { name: "recipe-store" }
  )
);
```

### 로컬 상태 패턴

```typescript
// UI 전용 상태를 위한 뷰포트 컴포넌트 내부
function HomePageMobileLayout(props: HomePageProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // 로컬 상태는 뷰포트에 남고, 비즈니스 로직은 컨트롤러에 위치함
  return (
    <div>
      <button onClick={() => setIsMenuOpen(!isMenuOpen)}>메뉴</button>
      {isMenuOpen && <Menu />}
    </div>
  );
}
```

---

## 모범 사례

### 권장 사항 (Do's)

| 실천 방법 | 이유 |
|----------|--------|
| 페이지 수준의 뷰포트 전환에는 `ResponsiveSwitcher` 사용 | 일관된 패턴, 깔끔한 코드 |
| 비즈니스 로직은 컨트롤러에 유지 | 단일 진실 공급원(Single source of truth) |
| 타입 정의된 `Props` 인터페이스 사용 | 뷰포트 간 타입 안정성 확보 |
| `*.common.tsx`를 통해 공통 UI 공유 | 중복 감소 |
| 미세한 차이에는 `isTablet` prop 사용 | 불필요한 뷰포트 파일 생성 방지 |
| SSR 안정성을 위해 `typeof window === "undefined"` 체크 | 하이드레이션 불일치(hydration mismatches) 방지 |

### 금지 사항 (Don'ts)

| 안티 패턴 | 더 나은 접근 방식 |
|--------------|-----------------|
| 각 뷰포트에서 데이터 페칭 중복 | 컨트롤러 Hook 사용 |
| 아주 작은 차이 때문에 별도의 모바일/태블릿/데스크톱 생성 | 조건부 클래스 또는 `isTablet` prop 사용 |
| 브레이크포인트 값 하드코딩 | `BREAKPOINTS` 및 `MEDIA_QUERIES` 상수 사용 |
| 컴포넌트에서 직접 `matchMedia` 사용 | `useMediaQuery` hook 사용 |
| 뷰포트 컴포넌트에 컨트롤러 로직 혼합 | 뷰포트는 순수하게 UI로만 유지 |

### 새로운 페이지 추가 체크리스트

```markdown
1. [ ] 디렉토리 생성: `src/views/{page-name}/ui/`

2. [ ] 진입점 생성: `index.tsx`
   - `ResponsiveSwitcher` 임포트
   - 세 가지 뷰포트 컴포넌트 모두 임포트
   - 기본 페이지 컴포넌트 export

3. [ ] 컨트롤러 생성: `{Page}.controller.tsx`
   - `{Page}Variant` 타입 정의
   - `{Page}Props` 인터페이스 정의
   - `use{Page}Controller` hook 구현
   - 변형별(variant-specific) 구성 설정 추가

4. [ ] 뷰포트 컴포넌트 생성:
   - `{Page}.mobile.tsx` - 모바일 레이아웃 (0-767px)
   - `{Page}.tablet.tsx` - 태블릿 레이아웃 (768-1023px)
   - `{Page}.desktop.tsx` - 데스크톱 레이아웃 (1024px+)

5. [ ] 공통 컴포넌트 생성 (필요한 경우):
   - `{Page}.common.tsx` - 공유 UI 컴포넌트

6. [ ] 번역 Hook 생성: `hooks/use{Page}Translation.ts`

7. [ ] Next.js 페이지 생성: `pages/{route}.tsx`
   - `src/views/{page-name}/ui`에서 뷰 컴포넌트 임포트
```

### 새로운 뷰포트 컴포넌트 추가 시

```markdown
1. [ ] 적절한 명명 규칙과 함께 컴포넌트 함수 정의:
   - `{Page}Mobile`, `{Page}Tablet`, 또는 `{Page}Desktop`

2. [ ] 별도의 레이아웃 컴포넌트 생성:
   - `{Page}MobileLayout`, `{Page}TabletLayout`, 또는 `{Page}DesktopLayout`
   - `{Page}Props`를 props로 수용

3. [ ] 메인 컴포넌트에서:
   - `use{Page}Controller("{variant}")`를 호출하여 props 가져오기
   - 레이아웃 컴포넌트에 props 전달

4. [ ] 레이아웃 컴포넌트에서:
   - 모든 props 구조 분해 할당(Destructure)
   - 레이아웃과 스타일링에만 집중
   - 비즈니스 로직 없음

5. [ ] 두 컴포넌트 모두 export:
   - ResponsiveSwitcher를 위한 메인 컴포넌트
   - 테스트 및 Storybook을 위한 레이아웃 컴포넌트
```

### 새로운 뷰포트 컴포넌트 템플릿

```typescript
// src/views/{page}/ui/{Page}.mobile.tsx

import { use{Page}Controller, {Page}Props } from "./{Page}.controller";

export function {Page}Mobile() {
  const props = use{Page}Controller("mobile");
  return <{Page}MobileLayout {...props} />;
}

export function {Page}MobileLayout({
  // Props 구조 분해 할당
}: {Page}Props) {
  return (
    <div className="min-h-screen">
      {/* 모바일 전용 레이아웃 */}
    </div>
  );
}
```

---

## 빠른 참조

### 임포트 경로 (Import Paths)

```typescript
// 반응형 유틸리티
import { ResponsiveSwitcher } from "@/src/shared/ui/responsive";
import { useMediaQuery } from "@/src/shared/hooks/useMediaQuery";
import { BREAKPOINTS, MEDIA_QUERIES } from "@/src/shared/constants/breakpoints";

// 컨트롤러 패턴
import { use{Page}Controller, {Page}Props } from "./{Page}.controller";

// 공통 컴포넌트
import { ComponentName } from "./{page}.common";
```

### 타입 정의

```typescript
// 변형 타입 (항상 동일한 패턴)
export type {Page}Variant = "mobile" | "tablet" | "desktop";

// Props 인터페이스 (페이지별로 구조가 다름)
export interface {Page}Props {
  // 공통 props...
}
```

### ResponsiveSwitcher 사용법

```typescript
// 기본 사용법
<ResponsiveSwitcher
  mobile={MobileComponent}
  tablet={TabletComponent}
  desktop={DesktopComponent}
  props={{ id: "123" }}
/>

// SSR을 위한 fallback 포함
<ResponsiveSwitcher
  mobile={MobileComponent}
  tablet={TabletComponent}
  desktop={DesktopComponent}
  props={{}}
  fallback={<LoadingSkeleton />}
/>
```

---

## 결론

이 아키텍처는 Cheftory WebView 애플리케이션에서 반응형 UI를 구축하기 위한 확장 가능하고 유지보수 가능한 접근 방식을 제공합니다. 컨트롤러와 뷰포트 컴포넌트 간의 관심사를 분리함으로써, 모든 장치 유형에서 최적의 사용자 경험을 제공하는 동시에 코드베이스를 깨끗하고 탐색하기 쉽게 유지할 수 있습니다.

질문이나 설명이 필요한 경우, 이 문서에서 설명한 모든 패턴이 구현된 `src/views/home/ui/`의 예시 구현체를 참조하십시오.
