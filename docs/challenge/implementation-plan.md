# 집밥 챌린지 구현 계획서

## 개요

이 문서는 `challenge-feature-spec.md`를 기반으로 한 구체적인 구현 계획입니다.

**목표**: 임시/이벤트성 기능으로 격리된 구조 유지, 종료 후 쉽게 삭제 가능

---

## 파일 구조

```
webview-v2/
├── src/
│   ├── features/
│   │   └── challenge/                    # 챌린지 feature (격리)
│   │       ├── model/
│   │       │   ├── types.ts              # 타입 정의
│   │       │   ├── schema.ts             # Zod 스키마
│   │       │   ├── mockData.ts           # Mock 데이터
│   │       │   ├── useChallengeInfo.ts   # 챌린지 정보 훅
│   │       │   ├── useChallengeRecipes.ts # 레시피 목록 훅
│   │       │   └── messages.ts           # 상태별 메시지 상수
│   │       ├── api/
│   │       │   └── challengeApi.ts       # API 호출 함수
│   │       ├── lib/
│   │       │   └── formatDate.ts         # 날짜 포맷팅 함수
│   │       ├── ui/
│   │       │   ├── ChallengeBanner.tsx   # 홈 배너 (Ready + Skeleton)
│   │       │   ├── ChallengeProgressBox.tsx # 진행 상황 박스 (단일)
│   │       │   ├── ChallengeProgressSection.tsx # 진행 상황 섹션 (박스 + 메시지)
│   │       │   ├── ChallengePeriod.tsx   # 기간 표시
│   │       │   ├── KakaoLinkButton.tsx   # 카카오톡 버튼
│   │       │   ├── ChallengeRecipeCard.tsx # 레시피 카드 (Ready + Skeleton)
│   │       │   ├── ChallengeErrorFallback.tsx # 에러 UI
│   │       │   └── NonParticipantView.tsx # 비참여자 안내
│   │       └── index.ts                  # export
│   │
│   └── views/
│       └── challenge/                    # 챌린지 페이지 view
│           ├── ui/
│           │   └── index.tsx             # 페이지 메인 컴포넌트
│           └── index.ts
│
├── pages/
│   └── challenge.tsx                     # Next.js 라우트
│
└── docs/
    └── challenge/
        ├── challenge-feature-spec.md     # 기획서
        └── implementation-plan.md        # 구현 계획 (이 문서)
```

---

## Phase 1: 기반 구조 (타입, 스키마, Mock)

### 1-1. 타입 정의

**파일**: `src/features/challenge/model/types.ts`

```typescript
// 챌린지 타입
export type ChallengeType = "SINGLE" | "HOUSEWIFE";

// 챌린지 타입 라벨
export const CHALLENGE_TYPE_LABELS: Record<ChallengeType, string> = {
  SINGLE: "자취생",
  HOUSEWIFE: "주부",
};

// 구글폼 URL
export const CHALLENGE_SIGNUP_FORM_URL = "https://forms.gle/xxx"; // TODO: 실제 URL
```

### 1-2. Zod 스키마

**파일**: `src/features/challenge/model/schema.ts`

**참고**: `entities/user-recipe/model/api.ts`, `shared/schema/paginatedSchema.ts`

```typescript
import { z } from "zod";
import { RecipeTagSchema } from "@/src/shared/schema/recipeSchema";
import createPaginatedSchema from "@/src/shared/schema/paginatedSchema";

// ============================================
// 챌린지 정보 스키마
// ============================================

export const ChallengeInfoSchema = z.object({
  isParticipant: z.literal(true),
  challengeType: z.enum(["SINGLE", "HOUSEWIFE"]),
  challengeName: z.string(),
  completedCount: z.number(),
  totalCount: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  kakaoOpenChatUrl: z.string(),
});

export const NonParticipantSchema = z.object({
  isParticipant: z.literal(false),
});

// Discriminated Union으로 타입 안전성 확보
export const ChallengeDataSchema = z.discriminatedUnion("isParticipant", [
  ChallengeInfoSchema,
  NonParticipantSchema,
]);

export type ChallengeInfo = z.infer<typeof ChallengeInfoSchema>;
export type NonParticipant = z.infer<typeof NonParticipantSchema>;
export type ChallengeData = z.infer<typeof ChallengeDataSchema>;

// ============================================
// 챌린지 레시피 스키마
// ============================================

export const ChallengeRecipeSchema = z.object({
  recipeId: z.string(),
  recipeTitle: z.string(),
  tags: z.array(RecipeTagSchema).optional(),
  description: z.string().optional(),
  servings: z.number().optional(),
  cookingTime: z.number().optional(),
  videoId: z.string(),
  videoThumbnailUrl: z.string(),
  videoSeconds: z.number().optional(),
  videoType: z.enum(["SHORTS", "NORMAL"]).optional(),
});

export type ChallengeRecipe = z.infer<typeof ChallengeRecipeSchema>;

// 페이지네이션 (기존 유틸 재사용)
export const PaginatedChallengeRecipesSchema = createPaginatedSchema(
  z.array(ChallengeRecipeSchema)
);

export type PaginatedChallengeRecipes = z.infer<typeof PaginatedChallengeRecipesSchema>;
```

### 1-3. 상태별 메시지 상수

**파일**: `src/features/challenge/model/messages.ts`

```typescript
// 진행 상황별 메시지
export const PROGRESS_MESSAGES: Record<number, string> = {
  0: "이번 주 첫 요리를 시작해보세요!",
  1: "좋아요! 두 번만 더 하면 성공!",
  2: "거의 다 왔어요! 한 번만 더!",
  3: "축하합니다! 이번 주 챌린지 완료!",
};

// 완료 시 추가 메시지
export const COMPLETION_SUB_MESSAGE = "다음 주에도 함께해요!";

// 배너 메시지
export const BANNER_MESSAGES = {
  inProgress: (count: number, total: number) => `${count}/${total} 완료`,
  completed: "축하합니다! 이번 주 완료!",
};
```

### 1-4. 날짜 포맷팅 함수

**파일**: `src/features/challenge/lib/formatDate.ts`

```typescript
/**
 * ISO 날짜 문자열을 한국어 형식으로 변환
 * @param dateString - "2024-12-16" 형식
 * @returns "12월 16일" 형식
 */
export function formatChallengeDate(dateString: string): string {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}월 ${day}일`;
}

/**
 * 챌린지 기간 문자열 생성
 * @returns "12월 16일 ~ 12월 22일" 형식
 */
export function formatChallengePeriod(startDate: string, endDate: string): string {
  return `${formatChallengeDate(startDate)} ~ ${formatChallengeDate(endDate)}`;
}
```

### 1-5. Mock 데이터

**파일**: `src/features/challenge/model/mockData.ts`

```typescript
import { ChallengeInfo, NonParticipant, ChallengeRecipe, PaginatedChallengeRecipes } from "./schema";

// ============================================
// 챌린지 정보 Mock
// ============================================

export const MOCK_PARTICIPANT: ChallengeInfo = {
  isParticipant: true,
  challengeType: "SINGLE",
  challengeName: "자취생 집밥 챌린지",
  completedCount: 2,
  totalCount: 3,
  startDate: "2024-12-16",
  endDate: "2024-12-22",
  kakaoOpenChatUrl: "https://open.kakao.com/xxx",
};

export const MOCK_NON_PARTICIPANT: NonParticipant = {
  isParticipant: false,
};

// ============================================
// 레시피 Mock
// ============================================

export const MOCK_CHALLENGE_RECIPES: ChallengeRecipe[] = [
  {
    recipeId: "challenge-recipe-1",
    recipeTitle: "간단 계란볶음밥",
    tags: [{ name: "자취생" }, { name: "10분요리" }],
    description: "자취생을 위한 초간단 계란볶음밥",
    servings: 1,
    cookingTime: 10,
    videoId: "abc123",
    videoThumbnailUrl: "https://img.youtube.com/vi/abc123/maxresdefault.jpg",
    videoSeconds: 300,
    videoType: "NORMAL",
  },
  {
    recipeId: "challenge-recipe-2",
    recipeTitle: "참치마요 덮밥",
    tags: [{ name: "자취생" }, { name: "5분요리" }],
    description: "통조림으로 만드는 초간단 덮밥",
    servings: 1,
    cookingTime: 5,
    videoId: "def456",
    videoThumbnailUrl: "https://img.youtube.com/vi/def456/maxresdefault.jpg",
    videoSeconds: 180,
    videoType: "NORMAL",
  },
  {
    recipeId: "challenge-recipe-3",
    recipeTitle: "라면 업그레이드",
    tags: [{ name: "자취생" }, { name: "간편식" }],
    description: "라면을 더 맛있게 먹는 방법",
    servings: 1,
    cookingTime: 8,
    videoId: "ghi789",
    videoThumbnailUrl: "https://img.youtube.com/vi/ghi789/maxresdefault.jpg",
    videoSeconds: 240,
    videoType: "NORMAL",
  },
];

export const MOCK_PAGINATED_RECIPES: PaginatedChallengeRecipes = {
  currentPage: 0,
  hasNext: false,
  totalElements: 3,
  totalPages: 1,
  data: MOCK_CHALLENGE_RECIPES,
};
```

---

## Phase 2: UI 컴포넌트

### 2-1. 진행 상황 박스 (단일)

**파일**: `src/features/challenge/ui/ChallengeProgressBox.tsx`

**역할**: 단일 체크박스 (완료/미완료 표시)

```typescript
import { FaCheck } from "react-icons/fa";

interface ChallengeProgressBoxProps {
  index: number;      // 1, 2, 3
  isCompleted: boolean;
}

export function ChallengeProgressBox({ index, isCompleted }: ChallengeProgressBoxProps) {
  return (
    <div
      className={`
        w-16 h-16 rounded-lg border-2 flex flex-col items-center justify-center
        ${isCompleted
          ? "bg-orange-100 border-orange-500"
          : "bg-gray-100 border-gray-300"
        }
      `}
    >
      {isCompleted && <FaCheck className="text-orange-500 mb-1" />}
      <span className={`text-sm ${isCompleted ? "text-orange-600" : "text-gray-500"}`}>
        {index}회
      </span>
    </div>
  );
}
```

### 2-2. 진행 상황 섹션 (박스 + 메시지)

**파일**: `src/features/challenge/ui/ChallengeProgressSection.tsx`

**역할**: 3개 박스 + 상태별 메시지 조합

```typescript
import { ChallengeProgressBox } from "./ChallengeProgressBox";
import { PROGRESS_MESSAGES, COMPLETION_SUB_MESSAGE } from "../model/messages";

interface ChallengeProgressSectionProps {
  completedCount: number;
  totalCount: number;
}

export function ChallengeProgressSection({
  completedCount,
  totalCount
}: ChallengeProgressSectionProps) {
  const isCompleted = completedCount >= totalCount;

  return (
    <div className="px-4 py-6">
      <h2 className="text-lg font-bold mb-4">이번 주 진행 상황</h2>

      {/* 3개 박스 */}
      <div className="flex justify-center gap-4 mb-4">
        {Array.from({ length: totalCount }, (_, i) => (
          <ChallengeProgressBox
            key={i}
            index={i + 1}
            isCompleted={i < completedCount}
          />
        ))}
      </div>

      {/* 상태별 메시지 */}
      <div className="text-center">
        <p className={`text-lg font-medium ${isCompleted ? "text-green-600" : "text-gray-700"}`}>
          {isCompleted && "🎉 "}
          {PROGRESS_MESSAGES[completedCount] ?? PROGRESS_MESSAGES[0]}
        </p>
        {isCompleted && (
          <p className="text-sm text-gray-500 mt-1">{COMPLETION_SUB_MESSAGE}</p>
        )}
      </div>
    </div>
  );
}
```

### 2-3. 기간 표시

**파일**: `src/features/challenge/ui/ChallengePeriod.tsx`

```typescript
import { formatChallengePeriod } from "../lib/formatDate";

interface ChallengePeriodProps {
  startDate: string;
  endDate: string;
}

export function ChallengePeriod({ startDate, endDate }: ChallengePeriodProps) {
  return (
    <div className="px-4 py-3 bg-gray-50">
      <p className="text-center text-gray-600 font-medium">
        {formatChallengePeriod(startDate, endDate)}
      </p>
    </div>
  );
}
```

### 2-4. 카카오톡 버튼

**파일**: `src/features/challenge/ui/KakaoLinkButton.tsx`

**참고**: `shared/client/native/client.ts`의 native bridge 패턴, `useHandleMessage.ts`의 `OPEN_YOUTUBE` 패턴

> ✅ **완료**: 네이티브에 `OPEN_EXTERNAL_URL` 핸들러 구현 완료.
> Frontend: `useHandleMessage.ts` (205~215 라인), Webview: `unblockingHandlerType.ts`에 타입 추가

```typescript
import { RiKakaoTalkFill } from "react-icons/ri";
import { MODE, request } from "@/src/shared/client/native/client";

interface KakaoLinkButtonProps {
  url: string;
}

export function KakaoLinkButton({ url }: KakaoLinkButtonProps) {
  const handleClick = () => {
    // React Native WebView 환경 확인
    if (typeof window !== "undefined" && window.ReactNativeWebView) {
      // Native bridge로 외부 링크 열기
      request(MODE.UNBLOCKING, "OPEN_EXTERNAL_URL", { url });
    } else {
      // 웹 환경 fallback
      window.open(url, "_blank");
    }
  };

  return (
    <div className="px-4 py-4">
      <button
        onClick={handleClick}
        className="w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2"
        style={{ backgroundColor: "#FEE500" }}
      >
        <RiKakaoTalkFill size={24} className="text-black" />
        <span className="text-black font-medium">카카오톡에서 인증하기</span>
      </button>
    </div>
  );
}
```

### 2-5. 홈 배너

**파일**: `src/features/challenge/ui/ChallengeBanner.tsx`

**패턴**: `SSRSuspense` + 에러 시 null 반환 (myRecipe.tsx 참고)

```typescript
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { useChallengeInfo } from "../model/useChallengeInfo";
import { BANNER_MESSAGES } from "../model/messages";
import { ChallengeInfo } from "../model/schema";

// 외부 export
export function ChallengeBanner() {
  return (
    <SSRSuspense fallback={<ChallengeBannerSkeleton />}>
      <ChallengeBannerReady />
    </SSRSuspense>
  );
}

// Ready 컴포넌트
function ChallengeBannerReady() {
  let data: ChallengeInfo | null = null;

  try {
    const result = useChallengeInfo();
    if (result.data?.isParticipant) {
      data = result.data;
    }
  } catch {
    // 에러 시 배너 숨김
    return null;
  }

  if (!data) return null;

  const isCompleted = data.completedCount >= data.totalCount;

  return (
    <div className="px-4 py-2">
      <Link href="/challenge">
        <div
          className={`
            p-4 rounded-xl shadow-sm
            ${isCompleted
              ? "bg-gradient-to-r from-green-100 to-emerald-100"
              : "bg-gradient-to-r from-orange-100 to-amber-100"
            }
          `}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-gray-800">{data.challengeName}</h3>
              <div className="flex items-center gap-2 mt-2">
                {/* 미니 진행 박스 */}
                <div className="flex gap-1">
                  {Array.from({ length: data.totalCount }, (_, i) => (
                    <div
                      key={i}
                      className={`w-4 h-4 rounded ${
                        i < data.completedCount ? "bg-orange-500" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {isCompleted
                    ? BANNER_MESSAGES.completed
                    : BANNER_MESSAGES.inProgress(data.completedCount, data.totalCount)
                  }
                </span>
              </div>
            </div>
            <span className="text-orange-600 text-sm font-medium">
              레시피 확인하기 →
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

// Skeleton 컴포넌트
function ChallengeBannerSkeleton() {
  return (
    <div className="px-4 py-2">
      <Skeleton className="w-full h-[80px] rounded-xl" />
    </div>
  );
}
```

### 2-6. 레시피 카드

**파일**: `src/features/challenge/ui/ChallengeRecipeCard.tsx`

**참고**: `search-results/ui/thumbnail.tsx` (size prop 없이 고정 높이)

```typescript
import { useRouter } from "next/router";
import { Skeleton } from "@/components/ui/skeleton";
import TextSkeleton from "@/src/shared/ui/skeleton/text";
import { FaRegClock } from "react-icons/fa";
import { BsPeople } from "react-icons/bs";
import { ChallengeRecipe } from "../model/schema";

interface ChallengeRecipeCardProps {
  recipe: ChallengeRecipe;
}

export function ChallengeRecipeCard({ recipe }: ChallengeRecipeCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/recipe/${recipe.recipeId}/detail`);
  };

  return (
    <article className="w-full cursor-pointer" onClick={handleClick}>
      {/* 썸네일 (search-results 패턴: 고정 높이) */}
      <div className="h-[160px] w-full overflow-hidden rounded-lg">
        <img
          src={recipe.videoThumbnailUrl}
          alt={recipe.recipeTitle}
          className="block w-full h-full object-cover object-center"
        />
      </div>

      <div className="mt-3 space-y-2">
        {/* 제목 */}
        <h3 className="text-base font-bold text-gray-900 truncate">
          {recipe.recipeTitle}
        </h3>

        {/* 인분 / 시간 */}
        {(recipe.servings || recipe.cookingTime) && (
          <div className="flex items-center gap-3 text-sm text-gray-600">
            {recipe.servings && (
              <div className="flex items-center gap-1">
                <BsPeople size={14} />
                <span>{recipe.servings}인분</span>
              </div>
            )}
            {recipe.cookingTime && (
              <div className="flex items-center gap-1">
                <FaRegClock size={14} />
                <span>{recipe.cookingTime}분</span>
              </div>
            )}
          </div>
        )}

        {/* 태그 */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex gap-2 overflow-x-auto">
            {recipe.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="text-xs text-orange-600 whitespace-nowrap">
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

// Skeleton
export function ChallengeRecipeCardSkeleton() {
  return (
    <div className="w-full">
      <Skeleton className="h-[160px] w-full rounded-lg" />
      <div className="mt-3 space-y-2">
        <TextSkeleton fontSize="text-base" />
        <div className="flex gap-3">
          <TextSkeleton fontSize="text-sm" />
          <TextSkeleton fontSize="text-sm" />
        </div>
      </div>
    </div>
  );
}
```

### 2-7. 비참여자 뷰

**파일**: `src/features/challenge/ui/NonParticipantView.tsx`

```typescript
import { CHALLENGE_SIGNUP_FORM_URL } from "../model/types";
import { MODE, request } from "@/src/shared/client/native/client";

export function NonParticipantView() {
  const handleSignupClick = () => {
    if (typeof window !== "undefined" && window.ReactNativeWebView) {
      request(MODE.UNBLOCKING, "OPEN_EXTERNAL_URL", { url: CHALLENGE_SIGNUP_FORM_URL });
    } else {
      window.open(CHALLENGE_SIGNUP_FORM_URL, "_blank");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-16">
      {/* 일러스트 */}
      <div className="w-40 h-40 mb-8">
        <img
          src="/empty_state.png"
          alt="비참여자"
          className="w-full h-full object-contain"
        />
      </div>

      {/* 안내 문구 */}
      <div className="text-center space-y-2 mb-8">
        <h3 className="text-xl font-bold text-gray-900">
          현재 챌린지 참여 대상이 아닙니다
        </h3>
        <p className="text-gray-600">
          다음 챌린지에 참여하고 싶으시다면
          <br />
          아래 버튼을 눌러 신청해주세요!
        </p>
      </div>

      {/* 신청 버튼 */}
      <button
        onClick={handleSignupClick}
        className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg"
      >
        📝 다음 챌린지 참여 신청하기
      </button>
    </div>
  );
}
```

### 2-8. 에러 Fallback UI

**파일**: `src/features/challenge/ui/ChallengeErrorFallback.tsx`

**참고**: `views/recipe-detail/index.tsx`의 `SectionFallback` 패턴

```typescript
import { useRouter } from "next/router";
import { motion } from "motion/react";
import { ShieldAlert, Home, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ChallengeErrorFallbackProps {
  resetErrorBoundary: () => void;
}

export function ChallengeErrorFallback({ resetErrorBoundary }: ChallengeErrorFallbackProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md rounded-2xl border border-gray-200/70 bg-white/80 p-6 shadow-sm backdrop-blur-sm"
      >
        {/* 헤더 아이콘 */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100">
          <ShieldAlert className="h-7 w-7 text-orange-500" />
        </div>

        {/* 타이틀/설명 */}
        <h2 className="mb-2 text-center text-xl font-bold tracking-tight text-gray-900">
          챌린지 정보를 불러올 수 없어요
        </h2>
        <p className="mb-6 text-center text-sm text-gray-600">
          네트워크 연결을 확인하고 다시 시도해주세요.
        </p>

        {/* 액션 */}
        <div className="flex flex-col gap-3">
          <button
            onClick={resetErrorBoundary}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 active:scale-[0.99]"
          >
            <RefreshCw className="h-4 w-4" />
            다시 시도
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center gap-2 rounded-full border border-gray-300/70 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" />
              뒤로가기
            </button>

            <Link
              href="/"
              className="flex items-center justify-center gap-2 rounded-full border border-gray-300/70 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-gray-50"
            >
              <Home className="h-4 w-4" />
              홈으로
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
```

---

## Phase 3: 페이지 조립

### 3-1. 챌린지 페이지

**파일**: `src/views/challenge/ui/index.tsx`

**참고**: `category-results/index.tsx`, `views/settings/ui/index.tsx` (useSafeArea)

```typescript
import { useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Header, { BackButton } from "@/src/shared/ui/header/header";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { SSRErrorBoundary } from "@/src/shared/boundary/SSRErrorBoundary";
import { Skeleton } from "@/components/ui/skeleton";
import { useSafeArea } from "@/src/shared/safearea/useSafaArea";

import { useChallengeInfo } from "@/src/features/challenge/model/useChallengeInfo";
import { useChallengeRecipes } from "@/src/features/challenge/model/useChallengeRecipes";
import { ChallengePeriod } from "@/src/features/challenge/ui/ChallengePeriod";
import { ChallengeProgressSection } from "@/src/features/challenge/ui/ChallengeProgressSection";
import { KakaoLinkButton } from "@/src/features/challenge/ui/KakaoLinkButton";
import { ChallengeRecipeCard, ChallengeRecipeCardSkeleton } from "@/src/features/challenge/ui/ChallengeRecipeCard";
import { NonParticipantView } from "@/src/features/challenge/ui/NonParticipantView";
import { ChallengeErrorFallback } from "@/src/features/challenge/ui/ChallengeErrorFallback";

function ChallengePage() {
  const router = useRouter();

  useSafeArea({
    top: { color: "#FFFFFF", isExists: true },
    bottom: { color: "#FFFFFF", isExists: true },
    left: { color: "#FFFFFF", isExists: true },
    right: { color: "#FFFFFF", isExists: true },
  });

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-white">
      <Header
        leftContent={
          <div className="flex flex-row gap-3 items-center">
            <BackButton onClick={() => router.back()} />
            <h1 className="text-xl font-semibold">집밥 챌린지</h1>
          </div>
        }
      />
      <div className="flex flex-col w-full h-full overflow-y-scroll">
        <SSRErrorBoundary
          fallbackRender={({ resetErrorBoundary }) => (
            <ChallengeErrorFallback resetErrorBoundary={resetErrorBoundary} />
          )}
        >
          <SSRSuspense fallback={<ChallengePageSkeleton />}>
            <ChallengePageReady />
          </SSRSuspense>
        </SSRErrorBoundary>
      </div>
    </div>
  );
}

function ChallengePageReady() {
  const { data } = useChallengeInfo();

  // 비참여자
  if (!data || !data.isParticipant) {
    return <NonParticipantView />;
  }

  // 참여자
  return (
    <div>
      {/* 기간 표시 */}
      <ChallengePeriod startDate={data.startDate} endDate={data.endDate} />

      {/* 진행 상황 */}
      <ChallengeProgressSection
        completedCount={data.completedCount}
        totalCount={data.totalCount}
      />

      {/* 카카오 버튼 */}
      <KakaoLinkButton url={data.kakaoOpenChatUrl} />

      {/* 레시피 목록 */}
      <SSRSuspense fallback={<ChallengeRecipeListSkeleton />}>
        <ChallengeRecipeList />
      </SSRSuspense>
    </div>
  );
}

function ChallengePageSkeleton() {
  return (
    <div className="px-4 py-6 space-y-4">
      <Skeleton className="w-48 h-6 mx-auto" />
      <div className="flex justify-center gap-4">
        <Skeleton className="w-16 h-16 rounded-lg" />
        <Skeleton className="w-16 h-16 rounded-lg" />
        <Skeleton className="w-16 h-16 rounded-lg" />
      </div>
      <Skeleton className="w-full h-12 rounded-lg" />
      <div className="grid grid-cols-2 gap-4 mt-8">
        <ChallengeRecipeCardSkeleton />
        <ChallengeRecipeCardSkeleton />
      </div>
    </div>
  );
}

export default ChallengePage;
```

### 3-2. 레시피 목록 섹션

**파일**: `src/views/challenge/ui/index.tsx` 내부

**참고**: `category-results/ui/index.tsx` (IntersectionObserver 패턴)

```typescript
function ChallengeRecipeList() {
  const {
    data: recipes,
    totalElements,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useChallengeRecipes();

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver로 무한 스크롤
  useEffect(() => {
    const loadMore = loadMoreRef.current;
    if (!loadMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );

    observer.observe(loadMore);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  return (
    <div className="px-4 pb-6">
      <div className="flex items-baseline gap-2 mb-4">
        <h2 className="text-lg font-bold">이번 주 추천 레시피</h2>
        <span className="text-sm text-gray-500">총 {totalElements}개</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {recipes.map((recipe) => (
          <ChallengeRecipeCard key={recipe.recipeId} recipe={recipe} />
        ))}
        {isFetchingNextPage && (
          <>
            <ChallengeRecipeCardSkeleton />
            <ChallengeRecipeCardSkeleton />
          </>
        )}
      </div>

      <div ref={loadMoreRef} className="h-20" />
    </div>
  );
}

function ChallengeRecipeListSkeleton() {
  return (
    <div className="px-4 pb-6">
      <Skeleton className="w-40 h-6 mb-4" />
      <div className="grid grid-cols-2 gap-4">
        <ChallengeRecipeCardSkeleton />
        <ChallengeRecipeCardSkeleton />
        <ChallengeRecipeCardSkeleton />
        <ChallengeRecipeCardSkeleton />
      </div>
    </div>
  );
}
```

### 3-3. 페이지 라우트

**파일**: `pages/challenge.tsx`

```typescript
import ChallengePage from "@/src/views/challenge/index";

export default ChallengePage;

// getStaticProps 불필요 (다국어 미사용)
```

### 3-4. View Export

**파일**: `src/views/challenge/index.ts`

```typescript
export { default } from "./ui";
```

### 3-5. 홈에 배너 연결

**파일**: `src/views/home/ui/index.tsx`

**수정 위치**: 검색바 `</div>` 와 `<CategorySection />` 사이

```typescript
// import 추가
import { ChallengeBanner } from "@/src/features/challenge";

// JSX 수정
<Link href="/search-recipe">
  <div className="...">
    {t("searchBarPlaceholder")}
    <PiMagnifyingGlassBold size={16} />
  </div>
</Link>
</div>
<ChallengeBanner />  {/* 추가 */}
<CategorySection />
```

---

## Phase 4: API 연동

### 4-1. API 함수

**파일**: `src/features/challenge/api/challengeApi.ts`

**참고**: `entities/user-recipe/model/api.ts` (parseWithErrLog 패턴)

```typescript
import client from "@/src/shared/client/main/client";
import { parseWithErrLog } from "@/src/shared/schema/zodErrorLogger";
import {
  ChallengeData,
  ChallengeDataSchema,
  PaginatedChallengeRecipes,
  PaginatedChallengeRecipesSchema
} from "../model/schema";
import { MOCK_PARTICIPANT, MOCK_PAGINATED_RECIPES } from "../model/mockData";

// Mock 모드 (개발용)
const USE_MOCK = process.env.NEXT_PUBLIC_CHALLENGE_USE_MOCK === "true";

// 챌린지 정보 조회
export const fetchChallengeInfo = async (): Promise<ChallengeData> => {
  if (USE_MOCK) {
    // 개발 시 Mock 데이터 반환
    return MOCK_PARTICIPANT;
  }

  const response = await client.get("/challenges/my");
  return parseWithErrLog(ChallengeDataSchema, response.data);
};

// 챌린지 레시피 목록 조회
export const fetchChallengeRecipes = async ({
  page
}: {
  page: number
}): Promise<PaginatedChallengeRecipes> => {
  if (USE_MOCK) {
    return MOCK_PAGINATED_RECIPES;
  }

  const response = await client.get(`/challenges/recipes?page=${page}`);
  return parseWithErrLog(PaginatedChallengeRecipesSchema, response.data);
};
```

### 4-2. React Query 훅 - 챌린지 정보

**파일**: `src/features/challenge/model/useChallengeInfo.ts`

```typescript
import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchChallengeInfo } from "../api/challengeApi";

const CHALLENGE_INFO_QUERY_KEY = "challengeInfo";

export function useChallengeInfo() {
  return useSuspenseQuery({
    queryKey: [CHALLENGE_INFO_QUERY_KEY],
    queryFn: fetchChallengeInfo,
    staleTime: 5 * 60 * 1000,  // 5분
  });
}
```

### 4-3. React Query 훅 - 레시피 목록

**파일**: `src/features/challenge/model/useChallengeRecipes.ts`

**참고**: `entities/recommend-recipe/model/useRecommendRecipe.ts`

```typescript
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { fetchChallengeRecipes } from "../api/challengeApi";

const CHALLENGE_RECIPES_QUERY_KEY = "challengeRecipes";

export function useChallengeRecipes() {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: [CHALLENGE_RECIPES_QUERY_KEY],
      queryFn: ({ pageParam = 0 }) => fetchChallengeRecipes({ page: pageParam }),
      getNextPageParam: (lastPage) =>
        lastPage.hasNext ? lastPage.currentPage + 1 : undefined,
      initialPageParam: 0,
      staleTime: 5 * 60 * 1000,
    });

  const recipes = data.pages.flatMap((page) => page.data);
  const totalElements = data.pages[0]?.totalElements ?? 0;

  return {
    data: recipes,
    totalElements,
    hasNextPage: !!hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  };
}
```

### 4-4. Export 정리

**파일**: `src/features/challenge/index.ts`

```typescript
// ============================================
// UI Components
// ============================================
export { ChallengeBanner } from "./ui/ChallengeBanner";
export { ChallengeProgressBox } from "./ui/ChallengeProgressBox";
export { ChallengeProgressSection } from "./ui/ChallengeProgressSection";
export { ChallengePeriod } from "./ui/ChallengePeriod";
export { KakaoLinkButton } from "./ui/KakaoLinkButton";
export { ChallengeRecipeCard, ChallengeRecipeCardSkeleton } from "./ui/ChallengeRecipeCard";
export { ChallengeErrorFallback } from "./ui/ChallengeErrorFallback";
export { NonParticipantView } from "./ui/NonParticipantView";

// ============================================
// Hooks
// ============================================
export { useChallengeInfo } from "./model/useChallengeInfo";
export { useChallengeRecipes } from "./model/useChallengeRecipes";

// ============================================
// Types
// ============================================
export type { ChallengeType } from "./model/types";
export type { ChallengeInfo, ChallengeData, ChallengeRecipe } from "./model/schema";

// ============================================
// Utils
// ============================================
export { formatChallengeDate, formatChallengePeriod } from "./lib/formatDate";
```

---

## 구현 순서 체크리스트

### Phase 1: 기반 구조
- [ ] 폴더 구조 생성 (`features/challenge/`)
- [ ] `types.ts` 작성
- [ ] `schema.ts` 작성 (ChallengeInfoSchema, ChallengeDataSchema 포함)
- [ ] `messages.ts` 작성 (상태별 메시지)
- [ ] `lib/formatDate.ts` 작성 (날짜 포맷팅)
- [ ] `mockData.ts` 작성
- [ ] `index.ts` export 설정

### Phase 2: UI 컴포넌트

- [ ] `ChallengeProgressBox.tsx` (단일 박스)
- [ ] `ChallengeProgressSection.tsx` (박스 + 메시지)
- [ ] `ChallengePeriod.tsx` (기간 표시)
- [ ] `KakaoLinkButton.tsx` (native bridge 포함)
- [ ] `ChallengeBanner.tsx` (Ready + Skeleton + 에러 처리)
- [ ] `ChallengeRecipeCard.tsx` (Ready + Skeleton)
- [ ] `ChallengeErrorFallback.tsx` (에러 UI)
- [ ] `NonParticipantView.tsx`

### Phase 3: 페이지 조립

- [ ] `views/challenge/ui/index.tsx` (페이지 + 레시피 목록 + 에러 처리 + 스켈레톤)
- [ ] `views/challenge/index.ts`
- [ ] `pages/challenge.tsx`
- [ ] 홈 배너 연결 (`views/home/ui/index.tsx`)

### Phase 4: API 연동

- [ ] `api/challengeApi.ts` (parseWithErrLog + Mock 모드)
- [ ] `model/useChallengeInfo.ts`
- [ ] `model/useChallengeRecipes.ts`
- [ ] 환경변수 설정 (`NEXT_PUBLIC_CHALLENGE_USE_MOCK`)

### Phase 5: 테스트 및 QA

- [ ] Mock 모드로 UI 테스트
- [ ] 참여자 플로우 (0/3 → 3/3)
- [ ] 비참여자 플로우
- [ ] 로딩/에러 상태
- [ ] 에러 복구 (다시 시도 버튼)
- [ ] 무한 스크롤
- [ ] 카카오 버튼 (native bridge - OPEN_EXTERNAL_URL)
- [ ] 실제 API 연동 테스트

---

## 참고 파일 목록

| 용도 | 파일 경로 |
|------|----------|
| 컴포넌트 패턴 | `views/home/ui/myRecipe.tsx` |
| 레시피 카드 | `views/category-results/ui/index.tsx` |
| 무한 스크롤 | `views/category-results/ui/index.tsx` |
| API 클라이언트 | `shared/client/main/client.ts` |
| 스키마 검증 | `shared/schema/zodErrorLogger.ts` |
| 페이지네이션 스키마 | `shared/schema/paginatedSchema.ts` |
| Native Bridge | `shared/client/native/client.ts` |
| Native 메시지 핸들러 | `frontend/src/pages/webview/message/useHandleMessage.ts` |
| useSafeArea | `shared/safearea/useSafaArea.ts` |
| SSRSuspense | `shared/boundary/SSRSuspense.tsx` |
| SSRErrorBoundary | `shared/boundary/SSRErrorBoundary.tsx` |
| 에러 Fallback 패턴 | `views/recipe-detail/index.tsx` (SectionFallback) |
| 썸네일 (고정 높이) | `views/search-results/ui/thumbnail.tsx` |
| 스켈레톤 | `shared/ui/skeleton/text.tsx` |
| 포맷팅 함수 | `features/format/recipe-info/formatRecipeProperties.ts` |

---

## 환경변수

```bash
# .env.local (개발용)
NEXT_PUBLIC_CHALLENGE_USE_MOCK=true

# .env.production (배포용)
NEXT_PUBLIC_CHALLENGE_USE_MOCK=false
```

---

## 삭제 가이드

챌린지 종료 후 제거:

1. `src/features/challenge/` 삭제
2. `src/views/challenge/` 삭제
3. `pages/challenge.tsx` 삭제
4. `src/views/home/ui/index.tsx`에서 `<ChallengeBanner />` 및 import 제거
5. (선택) `docs/challenge/` 삭제
6. (선택) 환경변수에서 `NEXT_PUBLIC_CHALLENGE_USE_MOCK` 제거

**예상 소요**: 5분 이내

---

## 미정 사항

| 항목 | 상태 | 담당 | 비고 |
|------|------|------|------|
| API 엔드포인트 확정 | 미정 | 백엔드 | `/challenges/my`, `/challenges/recipes` |
| 레시피 API 응답 구조 확정 | 미정 | 백엔드 | `ChallengeRecipeSchema` 기준 |
| 구글폼 URL | 미정 | 기획 | `CHALLENGE_SIGNUP_FORM_URL` |
| 카카오 오픈채팅 URL | 미정 | 기획 | API 응답에 포함 |
| 배너 일러스트 (선택) | 미정 | 디자인 | - |
| 비참여자 일러스트 | 기존 사용 | - | `empty_state.png` |
| OPEN_EXTERNAL_URL 핸들러 | ✅ 완료 | 네이티브 | `useHandleMessage.ts`, `unblockingHandlerType.ts` |

---

## 변경 이력

| 날짜 | 내용 |
|------|------|
| 2024-12-19 | 최초 작성 |
| 2024-12-19 | 검토 반영: Zod 스키마, 누락 컴포넌트, 메시지 상수, 날짜 포맷팅, Mock 모드, native bridge, useSafeArea 추가 |
| 2024-12-19 | 최종 검토 반영: OPEN_EXTERNAL_URL 핸들러 미존재 확인 및 가이드 추가, ChallengeErrorFallback 에러 UI 추가, SSRErrorBoundary 페이지 적용, 참고 파일 목록 확장 |
| 2024-12-19 | OPEN_EXTERNAL_URL 네이티브 핸들러 구현 완료 (frontend + webview-v2 양쪽) |
