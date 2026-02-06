# 핸즈프리 요리모드 툴팁 디자인 가이드

## 📋 개요

핸즈프리 요리모드 기능을 사용자에게 직관적으로 설명하기 위한 인터랙티브 툴팁 컴포넌트입니다.

### 🎨 디자인 철학

- **발견 가능성**: 눈에 띄는 정보 아이콘으로 사용자의 호기심 유발
- **인formative**: 한눈에 이해할 수 있는 구조화된 정보 계층
- **접근성**: 키보드 내비게이션, 스크린 리더, reduced-motion 완벽 지원
- **반응형**: 모바일/태블릿/데스크톱 모두에서 최적의 경험 제공

---

## 🎯 기능 특징

### 1. **반응형 상호작용**
- **데스크톱**: 호버(Hover) 시 툴팁 표시
- **모바일/태블릿**: 탭(Tap)하여 표시, 외부 영역 터치로 닫기
- Radix UI Popover 기반으로 안정적인 동작 보장

### 2. **접근성 (Accessibility)**

```tsx
// 키보드 내비게이션 지원
- Tab: 아이콘에 포커스
- Enter/Space: 툴팁 열기
- Esc: 툴팁 닫기

// 스크린 리더 지원
- aria-label: "핸즈프리 요리모드 기능 설명 보기"
- semantic HTML 구조
- 포커스 트랩 방지 (모달이 아닌 정보성 툴팁)

// 모션 감소
- useReducedMotion 훅으로 감지
- prefers-reduced-motion 설정시 애니메이션 비활성화
```

### 3. **애니메이션 효과**

```tsx
// 툴팁 진입
- Fade-in + Scale-up (zoom-in-95)
- Spring 애니메이션 (stiffness: 500, damping: 30)
- 방향에 따른 slide-in (top/bottom/left/right)

// 아이템 리스트
- 순차적 진입 (staggered delay: 0.05s per item)
- X축 이동 + Opacity 변화

// 상호작용
- hover: 아이콘 scale 110%
- active: 아이콘 scale 95%
```

---

## 🎨 디자인 사양

### 컬러 팔레트

```css
/* Primary Colors */
--orange-500: #f97316  /* 아이콘, 강조 요소 */
--orange-50: #fff7ed   /* 배경 강조 */
--orange-100: #ffedd5  /* 그라데이션 배경 */
--orange-600: #ea580c  /* 다크모드 텍스트 */

/* Neutral Colors */
--gray-50: #f9fafb     /* 아이템 배경 */
--gray-200: #e5e7eb    /* 경계선 */
--gray-400: #9ca3af    /* 기본 아이콘 */
--gray-600: #4b5563    /* 설명 텍스트 */
--gray-900: #111827    /* 제목 텍스트 */

/* Dark Mode */
--dark-bg: #1f2937
--dark-border: #374151
```

### 타이포그래피

```css
/* 제목 */
- font-size: 16px (mobile) / 18px (desktop)
- font-weight: 700 (bold)
- line-height: 1.2

/* 본문 설명 */
- font-size: 14px
- font-weight: 400
- line-height: 1.6

/* 기능 제목 */
- font-size: 12px / 13px
- font-weight: 600 (semibold)

/* 기능 설명 */
- font-size: 11px / 12px
- line-height: 1.4
```

### 스페이싱

```css
/* Container Padding */
- mobile: 16px (p-4)
- desktop: 20px (p-5)

/* Feature Item Spacing */
- gap: 12px (gap-3)
- padding: 10px / 12px (p-2.5 / p-3)
- vertical-gap: 10px / 12px (space-y-2.5 / 3)

/* Header Spacing */
- icon-to-text gap: 12px (gap-3)
- title-to-description gap: 6px (mb-1.5)
```

### 그림자 효과

```css
/* Tooltip Container */
- box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1)
             0 8px 10px -6px rgb(0 0 0 / 0.1)

/* Feature Icon */
- box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05)
```

---

## 📦 컴포넌트 API

### `HandsFreeModeTooltip`

기본 툴팁 컴포넌트입니다.

```tsx
interface Props {
  className?: string;        // 추가 스타일링
  side?: "top" | "bottom" | "left" | "right";  // 툴팁 위치 (default: "top")
  align?: "start" | "center" | "end";          // 정렬 (default: "center")
}
```

**사용 예시:**

```tsx
import { HandsFreeModeTooltip } from "@/views/onboarding/ui/components/HandsFreeModeTooltip";

// 기본 사용
<HandsFreeModeTooltip />

// 커스텀 위치
<HandsFreeModeTooltip side="bottom" align="start" />

// 추가 스타일
<HandsFreeModeTooltip className="ml-2" />
```

### `HandsFreeModeTooltipCompact`

紧凑형 variant로 오른쪽에 배치하기 좋습니다.

```tsx
interface Props {
  className?: string;
}

// 사용 예시
<HandsFreeModeTooltipCompact />
```

### `HandsFreeModeTooltipInline`

텍스트 흐름에 통합하기 위한 wrapper입니다.

```tsx
interface Props {
  children: React.ReactNode;  // 툴팁을 붙일 텍스트/요소
  className?: string;
}

// 사용 예시
<HandsFreeModeTooltipInline>
  <span>핸즈프리 요리모드</span>
</HandsFreeModeTooltipInline>
```

---

## 🔧 통합 방법

### 방법 1: OnboardingStep2에 직접 통합

```tsx
// src/views/onboarding/ui/steps/OnboardingStep2.tsx

import { HandsFreeModeTooltipInline } from "../components/HandsFreeModeTooltip";

// Title 부분 수정
<div className="flex items-center justify-center gap-1.5">
  <h1 className="text-lg lg:text-xl font-bold text-gray-900">
    {title}
  </h1>

  {/* cooking 상태일 때만 툴팁 표시 */}
  {isCookingState && <HandsFreeModeTooltipInline />}
</div>
```

### 방법 2: 독립적으로 사용

```tsx
import { HandsFreeModeTooltip } from "@/views/onboarding/ui/components/HandsFreeModeTooltip";

export function SomeComponent() {
  return (
    <div className="flex items-center gap-2">
      <span>핸즈프리 요리모드</span>
      <HandsFreeModeTooltip side="right" align="start" />
    </div>
  );
}
```

---

## 🎭 애니메이션 커스터마이징

### 애니메이션 비활성화

```tsx
// reduced-motion 설정시 자동으로 비활성화됩니다
const prefersReducedMotion = useReducedMotion();
```

### 커스텀 애니메이션 추가

```tsx
// HandsFreeModeTooltip.tsx 내부에서 수정

<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{
    type: "spring",
    stiffness: 500,  // 강도 (높을수록 빠름)
    damping: 30,     // 감쇠 (낮을수록 더 많이 움직임)
  }}
>
  {/* content */}
</motion.div>
```

---

## 🌐 다크모드 지원

툴팁은 자동으로 다크모드를 지원합니다:

```css
/* 다크모드에서 자동 적용되는 스타일 */
- bg-white → bg-gray-800
- text-gray-900 → text-gray-100
- text-gray-600 → text-gray-400
- border-gray-200 → border-gray-700
```

Tailwind의 `dark:` 프리픽스를 사용하여 구현됩니다.

---

## ♿ 접근성 체크리스트

- [x] 키보드 내비게이션 지원 (Tab, Enter, Space, Esc)
- [x] 스크린 리더 호환 (aria-label, semantic HTML)
- [x] 포커스 표시 (focus-visible:ring)
- [x] Reduced-motion 지원
- [x] 충분한 색상 대비 (WCAG AA 준수)
- [x] 터치 타겟 크기 (최소 44x44px)
- [x] 텍스트 크기 조정 가능 (최소 11px)

---

## 📱 반응형 브레이크포인트

```css
/* Mobile First Approach */
- Base: 모바일 스타일
- lg (1024px+): 데스크톱 스타일

/* 예시 */
- text-base lg:text-lg
- p-4 lg:p-5
- w-10 h-10 lg:w-12 lg:h-12
```

---

## 🚀 성능 최적화

### 1. **코드 분할**

```tsx
// 필요한 경우 lazy loading
const HandsFreeModeTooltip = dynamic(
  () => import('@/views/onboarding/ui/components/HandsFreeModeTooltip'),
  { ssr: true }
);
```

### 2. **애니메이션 최적화**

```tsx
// GPU 가속 사용
style={{ willChange: shouldAnimate ? 'transform, opacity' : 'auto' }}

// 불필요한 리렌더링 방지
const shouldAnimate = !prefersReducedMotion;
```

### 3. **아이콘 최적화**

```tsx
// lucide-react는 트리 쉐이킹 지원
import { Mic, Search, Timer } from "lucide-react";
```

---

## 🐛 일반적인 문제 해결

### 문제 1: 툴팁이 화면 밖으로 잘림

```tsx
// 해결: collisionPadding 추가
<Popover.Content
  collisionPadding={16}
  avoidCollisions
/>
```

### 문제 2: 모바일에서 스크롤 시 툴팁이 따라오지 않음

```tsx
// 해결: modal prop 제거 (현재 설정됨)
<Popover.Root modal={false}>
```

### 문제 3: 키보드 포커스가 툴팁 내부로 들어감

```tsx
// 해결: onOpenAutoFocus로 방지
<Popover.Content
  onOpenAutoFocus={(e) => e.preventDefault()}
/>
```

---

## 📚 참고 자료

- [Radix UI Popover 문서](https://www.radix-ui.com/primitives/docs/components/popover)
- [Framer Motion 문서](https://www.framer.com/motion/)
- [WCAG 2.1 가이드라인](https://www.w3.org/WAI/WCAG21/quickref/)
- [Lucide Icons](https://lucide.dev/)

---

## 🔄 버전 관리

### v1.0.0 (2026-02-07)
- 초기 릴리스
- 기본 툴팁 기능 구현
- 접근성 완벽 지원
- 다크모드 지원
- 반응형 디자인

---

## 📞 문의 사항

구현 관련 문제나 개선 제안은 개발팀에 문의해주세요.
