# 챌린지 API 연동 리팩토링 계획

## 개요

백엔드 API 구조에 맞게 프론트엔드 챌린지 기능을 리팩토링합니다.

- **작성일**: 2025-12-19
- **목표**: 백엔드 API 구조와 프론트엔드 스키마 일치
- **범위**: schema, mockData, API, hooks, components

---

## 파일 변경 현황 요약

### 신규 생성 (1개)

| 파일 | 설명 |
|-----|------|
| `model/constants.ts` | 하드코딩 상수 (name, totalCount, kakaoUrl) |

### 수정 (6개)

| 파일 | 주요 변경 |
|-----|---------|
| `model/schema.ts` | 스키마 구조 변경, 기존 스키마 삭제 후 대체 |
| `model/mockData.ts` | Mock 구조 변경, 기존 Mock 삭제 후 대체 |
| `api/challengeApi.ts` | API 엔드포인트 및 변환 로직 전면 수정 |
| `model/useChallengeRecipes.ts` | challengeId 파라미터 추가, 반환값 변경 |
| `index.ts` | export 정리 (삭제 + 추가) |
| `views/challenge/ui/index.tsx` | 컴포넌트 구조 변경 |

### 삭제 대상 (기존 코드에서 제거)

| 항목 | 파일 | 대체 |
|-----|------|------|
| `ChallengeInfoSchema` | schema.ts | `ParticipantSchema` |
| `ChallengeInfo` 타입 | schema.ts | `Participant` 타입 |
| `PaginatedChallengeRecipesSchema` | schema.ts | `ChallengeRecipesResponseSchema` |
| `PaginatedChallengeRecipes` 타입 | schema.ts | `ChallengeRecipesResponse` 타입 |
| `MOCK_PAGINATED_RECIPES` | mockData.ts | 삭제 (더 이상 사용 안함) |

---

## 검토 결과 주요 발견사항

### 1. 날짜 필드명 차이

| 백엔드 | 현재 프론트엔드 | 결정 |
|--------|----------------|------|
| `start_at` | `startDate` | API 레이어에서 변환 (컴포넌트 수정 최소화) |
| `end_at` | `endDate` | API 레이어에서 변환 |

### 2. 날짜 포맷 호환성

- 백엔드: `"2025-12-19T00:00:00"` (LocalDateTime)
- 현재 `formatDate.ts`: `new Date(dateString)` 사용 → **호환됨** ✅

### 3. 레시피 필드 매핑

| 백엔드 필드 | 프론트엔드 필드 | 비고 |
|------------|----------------|------|
| `video_thumbnail_url` | `videoThumbnailUrl` | URI → string 자동변환 |
| `count` | - | 사용 안함 (무시) |
| `video_url` | `videoUrl` | 추가 필요 |

### 4. 컴포넌트 영향도

- `ChallengePeriod`: props 변경 없음 (API에서 변환)
- `ChallengeProgressSection`: props 변경 없음
- `ChallengeBottomBar`: props 변경 없음
- `ChallengeRecipeCard`: props 변경 없음

---

## 백엔드 API 구조

### API 1: 챌린지 정보 조회
```
GET /api/v1/recipes/challenge
```

**응답:**
```json
{
  "challenge_id": "uuid-string",
  "start_at": "2025-12-19T00:00:00",
  "end_at": "2025-12-26T23:59:59",
  "type": "SINGLE"
}
```

### API 2: 챌린지 레시피 목록 조회
```
GET /api/v1/recipes/challenge/{challengeId}?page=0
```

**응답:**
```json
{
  "complete_recipes": [
    { "recipe_id": "uuid-1" },
    { "recipe_id": "uuid-2" }
  ],
  "challenge_recipes": [
    {
      "recipe_id": "uuid-1",
      "recipe_title": "간단 계란볶음밥",
      "tags": [{ "name": "자취생" }],
      "is_viewed": true,
      "description": "...",
      "servings": 1,
      "cooking_time": 10,
      "video_id": "abc123",
      "video_url": "...",
      "video_type": "NORMAL",
      "video_thumbnail_url": "...",
      "video_seconds": 300
    }
  ],
  "current_page": 0,
  "total_pages": 1,
  "total_elements": 3,
  "has_next": false
}
```

---

## 하드코딩 상수

백엔드에서 제공하지 않는 값들은 프론트엔드에서 상수로 관리:

| 항목 | 값 | 비고 |
|------|-----|------|
| 챌린지 이름 | "집밥 챌린지" | UI 표시용 |
| 완료 조건 | 3 | 3끼 완료 시 챌린지 성공 |
| 카카오 URL | 오픈채팅 링크 | 인증용 |

---

## 변경 파일 목록

### 1. 새 파일 생성

#### `src/features/challenge/model/constants.ts`
```typescript
export const CHALLENGE_CONSTANTS = {
  name: "집밥 챌린지",
  totalCount: 3,
  kakaoOpenChatUrl: "https://open.kakao.com/o/xxx",
} as const;
```

---

### 2. 스키마 변경

#### `src/features/challenge/model/schema.ts`

**현재:**

```typescript
export const ChallengeInfoSchema = z.object({
  isParticipant: z.literal(true),
  challengeType: z.enum(["SINGLE", "HOUSEWIFE"]),
  challengeName: z.string(),         // 삭제 → 상수로 이동
  completedCount: z.number(),        // 삭제 → completeRecipes.length로 계산
  totalCount: z.number(),            // 삭제 → 상수로 이동
  startDate: z.string(),
  endDate: z.string(),
  kakaoOpenChatUrl: z.string(),      // 삭제 → 상수로 이동
});
```

**변경 후:**

```typescript
// 참여자 정보 (API 성공 시, API 레이어에서 변환)
export const ParticipantSchema = z.object({
  isParticipant: z.literal(true),
  challengeId: z.string(),           // 추가: 레시피 API 호출에 필요
  challengeType: z.enum(["SINGLE", "HOUSEWIFE"]),
  startDate: z.string(),             // 유지 (API에서 start_at → startDate 변환)
  endDate: z.string(),               // 유지 (API에서 end_at → endDate 변환)
});

// 비참여자 (API 에러 시)
export const NonParticipantSchema = z.object({
  isParticipant: z.literal(false),
});

// Discriminated Union 유지
export const ChallengeDataSchema = z.discriminatedUnion("isParticipant", [
  ParticipantSchema,
  NonParticipantSchema,
]);

// 완료된 레시피 (신규)
export const CompleteRecipeSchema = z.object({
  recipeId: z.string(),
});

// 챌린지 레시피 (기존 유지 + videoUrl 추가)
export const ChallengeRecipeSchema = z.object({
  recipeId: z.string(),
  recipeTitle: z.string(),
  tags: z.array(RecipeTagSchema).optional(),
  description: z.string().optional(),
  servings: z.number().optional(),
  cookingTime: z.number().optional(),
  videoId: z.string(),
  videoUrl: z.string().optional(),           // 추가
  videoType: z.enum(["SHORTS", "NORMAL"]).optional(),
  videoThumbnailUrl: z.string(),
  videoSeconds: z.number().optional(),
});

// 레시피 목록 응답 (신규 - API 2 전체 응답)
export const ChallengeRecipesResponseSchema = z.object({
  completeRecipes: z.array(CompleteRecipeSchema),
  challengeRecipes: z.array(ChallengeRecipeSchema),
  currentPage: z.number(),
  totalPages: z.number(),
  totalElements: z.number(),
  hasNext: z.boolean(),
});

// ============================================
// 타입 export
// ============================================
export type Participant = z.infer<typeof ParticipantSchema>;
export type NonParticipant = z.infer<typeof NonParticipantSchema>;
export type ChallengeData = z.infer<typeof ChallengeDataSchema>;
export type CompleteRecipe = z.infer<typeof CompleteRecipeSchema>;
export type ChallengeRecipe = z.infer<typeof ChallengeRecipeSchema>;
export type ChallengeRecipesResponse = z.infer<typeof ChallengeRecipesResponseSchema>;

// ============================================
// 삭제 대상 (기존 코드에서 제거)
// ============================================
// - ChallengeInfoSchema → ParticipantSchema로 대체
// - PaginatedChallengeRecipesSchema → ChallengeRecipesResponseSchema로 대체
// - PaginatedChallengeRecipes 타입 → ChallengeRecipesResponse로 대체
```

---

### 3. Mock 데이터 변경

#### `src/features/challenge/model/mockData.ts`

##### 3.1 MOCK_PARTICIPANT 변경 (Before/After)

**현재:**

```typescript
export const MOCK_PARTICIPANT: ChallengeInfo = {
  isParticipant: true,
  challengeType: "SINGLE",
  challengeName: "자취생 집밥 챌린지",  // ❌ 삭제 → constants.ts로 이동
  completedCount: 2,                    // ❌ 삭제 → completeRecipes.length로 계산
  totalCount: 3,                        // ❌ 삭제 → constants.ts로 이동
  startDate: "2025-12-19",
  endDate: "2025-12-26",
  kakaoOpenChatUrl: "https://open.kakao.com/xxx",  // ❌ 삭제 → constants.ts로 이동
};
```

**변경 후:**

```typescript
export const MOCK_PARTICIPANT: Participant = {
  isParticipant: true,
  challengeId: "mock-challenge-1",      // ✅ 추가
  challengeType: "SINGLE",
  startDate: "2025-12-19T00:00:00",     // ✅ ISO 형식으로 변경
  endDate: "2025-12-26T23:59:59",       // ✅ ISO 형식으로 변경
};
```

##### 3.2 삭제 대상

```typescript
// ❌ 삭제: 더 이상 사용하지 않음
export const MOCK_PAGINATED_RECIPES: PaginatedChallengeRecipes = {
  currentPage: 0,
  hasNext: false,
  totalElements: 3,
  totalPages: 1,
  data: MOCK_CHALLENGE_RECIPES,
};
```

##### 3.3 전체 변경 후 코드

```typescript
import type {
  Participant,
  NonParticipant,      // 추가
  ChallengeRecipe,
  CompleteRecipe,
} from "./schema";

// ============================================
// 참여자 Mock (API 1 - 변환된 형태)
// ============================================
export const MOCK_PARTICIPANT: Participant = {
  isParticipant: true,
  challengeId: "mock-challenge-1",
  challengeType: "SINGLE",
  startDate: "2025-12-19T00:00:00",    // API에서 변환된 형태
  endDate: "2025-12-26T23:59:59",
};

// ============================================
// 비참여자 Mock
// ============================================
export const MOCK_NON_PARTICIPANT: NonParticipant = {
  isParticipant: false,
};

// ============================================
// 완료된 레시피 Mock (신규)
// ============================================
export const MOCK_COMPLETE_RECIPES: CompleteRecipe[] = [
  { recipeId: "challenge-recipe-1" },
  { recipeId: "challenge-recipe-2" },
];

// ============================================
// 챌린지 레시피 Mock (기존 유지)
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
```

---

### 4. API 함수 변경

#### `src/features/challenge/api/challengeApi.ts`

##### 4.1 삭제 대상

```typescript
// ❌ 삭제: 더 이상 사용하지 않음
import { parseWithErrLog } from "@/src/shared/schema/zodErrorLogger";
import {
  PaginatedChallengeRecipes,
  PaginatedChallengeRecipesSchema,
} from "../model/schema";

// ❌ 삭제: convertToChallengeRecipes 함수 (내부에서 직접 처리)
function convertToChallengeRecipes(
  paginatedRecipes: PaginatedRecipes
): PaginatedChallengeRecipes {
  // ...
}
```

##### 4.2 변경 전 API 엔드포인트

```typescript
// 현재 (TODO 상태)
const response = await client.get("/challenges/my");
const response = await client.get(`/challenges/recipes?page=${page}`);
```

##### 4.3 변경 후 API 엔드포인트

```typescript
// 변경 후 (실제 백엔드 API)
const response = await client.get("/api/v1/recipes/challenge");
const response = await client.get(`/api/v1/recipes/challenge/${challengeId}?page=${page}`);
```

##### 4.4 전체 변경 후 코드

```typescript
import client from "@/src/shared/client/main/client";
import {
  fetchAllRecipesSummary,
  type PaginatedRecipes,
} from "@/src/entities/user-recipe/model/api";
import type { UserRecipe } from "@/src/entities/user-recipe/model/schema";
import type {
  ChallengeData,
  ChallengeRecipe,
  ChallengeRecipesResponse,
} from "../model/schema";
import {
  MOCK_PARTICIPANT,
  MOCK_COMPLETE_RECIPES,
} from "../model/mockData";

// ============================================
// Mock 모드 설정
// ============================================
const USE_MOCK = process.env.NEXT_PUBLIC_CHALLENGE_USE_MOCK === "true";

// ============================================
// 챌린지 정보 조회
// ============================================
export async function fetchChallengeInfo(): Promise<ChallengeData> {
  if (USE_MOCK) {
    await simulateNetworkDelay();
    return MOCK_PARTICIPANT;
  }

  try {
    const response = await client.get("/api/v1/recipes/challenge");
    const data = response.data;

    // snake_case → camelCase 변환 (컴포넌트 수정 최소화)
    return {
      isParticipant: true,
      challengeId: data.challenge_id,
      challengeType: data.type,
      startDate: data.start_at,    // start_at → startDate
      endDate: data.end_at,        // end_at → endDate
    };
  } catch (error) {
    // 챌린지 없음 = 비참여자
    return { isParticipant: false };
  }
}

// ============================================
// 챌린지 레시피 목록 조회
// ============================================
export async function fetchChallengeRecipes({
  challengeId,
  page,
}: {
  challengeId: string;
  page: number;
}): Promise<ChallengeRecipesResponse> {
  if (USE_MOCK) {
    await simulateNetworkDelay();
    const myRecipes = await fetchAllRecipesSummary({ page });
    return {
      completeRecipes: MOCK_COMPLETE_RECIPES,
      challengeRecipes: myRecipes.data.map(convertUserRecipeToChallengeRecipe),
      currentPage: myRecipes.currentPage,
      totalPages: myRecipes.totalPages,
      totalElements: myRecipes.totalElements,
      hasNext: myRecipes.hasNext,
    };
  }

  // 실제 API 호출 (에러 시 상위로 전파 - ErrorBoundary에서 처리)
  const response = await client.get(
    `/api/v1/recipes/challenge/${challengeId}?page=${page}`
  );

  // snake_case → camelCase 변환
  return {
    completeRecipes: response.data.complete_recipes.map((r: any) => ({
      recipeId: r.recipe_id,
    })),
    challengeRecipes: response.data.challenge_recipes.map((r: any) => ({
      recipeId: r.recipe_id,
      recipeTitle: r.recipe_title,
      tags: r.tags,
      description: r.description,
      servings: r.servings,
      cookingTime: r.cooking_time,
      videoId: r.video_id,
      videoUrl: r.video_url,
      videoType: r.video_type,
      videoThumbnailUrl: r.video_thumbnail_url,
      videoSeconds: r.video_seconds,
    })),
    currentPage: response.data.current_page,
    totalPages: response.data.total_pages,
    totalElements: response.data.total_elements,
    hasNext: response.data.has_next,
  };
}

// ============================================
// 유틸리티 함수 (기존 유지)
// ============================================

/**
 * Mock 모드에서 네트워크 지연 시뮬레이션
 */
function simulateNetworkDelay(ms: number = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * UserRecipe → ChallengeRecipe 변환 (Mock 모드용)
 */
function convertUserRecipeToChallengeRecipe(
  recipe: UserRecipe
): ChallengeRecipe {
  return {
    recipeId: recipe.recipeId,
    recipeTitle: recipe.title,
    videoThumbnailUrl: recipe.videoInfo.thumbnailUrl,
    videoId: recipe.videoInfo.id,
    videoSeconds: recipe.videoInfo.seconds,
    servings: recipe.recipeDetailMeta?.servings,
    cookingTime: recipe.recipeDetailMeta?.cookingTime,
    tags: recipe.tags,
  };
}
```

**에러 처리 전략:**

- `fetchChallengeInfo`: 에러 발생 시 `{ isParticipant: false }` 반환 (비참여자 처리)
- `fetchChallengeRecipes`: 에러 발생 시 상위로 전파 → `SSRErrorBoundary`에서 `ChallengeErrorFallback` 표시

---

### 5. Hooks 변경

#### `src/features/challenge/model/useChallengeInfo.ts`

- 변경 없음 (API 함수가 변환 처리)

#### `src/features/challenge/model/useChallengeRecipes.ts`

**주요 변경점:**

- `challengeId` 파라미터 추가
- `queryKey`에 `challengeId` 포함
- 반환값 변경: `data` → `recipes`, `completeRecipes` 추가

**기존 반환값:**

```typescript
return {
  data,           // 레시피 배열
  totalElements,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
};
```

**변경 후 반환값:**

```typescript
return {
  recipes,           // data → recipes (이름 변경)
  completeRecipes,   // 신규 추가
  totalElements,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
};
```

**전체 코드:**

```typescript
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { fetchChallengeRecipes } from "../api/challengeApi";

const CHALLENGE_RECIPES_QUERY_KEY = "challengeRecipes";

export function useChallengeRecipes(challengeId: string) {
  const {
    data: queryData,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery({
    queryKey: [CHALLENGE_RECIPES_QUERY_KEY, challengeId],  // challengeId 추가
    queryFn: ({ pageParam = 0 }) => {
      return fetchChallengeRecipes({ challengeId, page: pageParam });
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasNext ? lastPage.currentPage + 1 : undefined;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
  });

  // challengeRecipes 배열 평탄화
  const recipes = queryData.pages.flatMap((page) => page.challengeRecipes);

  // completeRecipes는 첫 페이지에만 있음 (전체 완료 목록)
  const completeRecipes = queryData.pages[0]?.completeRecipes ?? [];

  const totalElements = queryData.pages[0]?.totalElements ?? 0;

  return {
    recipes,           // 이름 변경: data → recipes
    completeRecipes,   // 신규
    totalElements,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  };
}
```

---

### 6. 컴포넌트 변경

#### `src/views/challenge/ui/index.tsx`

##### 6.1 현재 구조 분석

현재 `index.tsx`의 구조:

```text
ChallengePage
└── ChallengePageReady (useChallengeInfo 호출)
    ├── ChallengePeriod
    ├── ChallengeProgressSection (data.completedCount 사용)
    ├── ChallengeRecipeList (useChallengeRecipes 호출 - 파라미터 없음)
    └── ChallengeBottomBar (data.kakaoOpenChatUrl 사용)
```

**현재 `ChallengeRecipeList` 컴포넌트 (102-153 라인):**

```typescript
function ChallengeRecipeList() {
  const {
    data: recipes,
    totalElements,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useChallengeRecipes();  // ❌ 파라미터 없음

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver로 무한 스크롤
  useEffect(() => {
    // ... 무한 스크롤 로직
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  return (
    <div className="px-4 pb-6">
      <div className="flex items-baseline gap-2 mb-4">
        <h2 className="text-lg font-bold">챌린지 레시피</h2>
        <span className="text-sm text-gray-500">총 {totalElements}개</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {recipes.map((recipe) => (
          <ChallengeRecipeCard key={recipe.recipeId} recipe={recipe} />
        ))}
        {/* ... 스켈레톤 */}
      </div>
      <div ref={loadMoreRef} className="h-20" />
    </div>
  );
}
```

##### 6.2 구조 변경 필요 이유

1. **challengeId 의존성**: `useChallengeRecipes`가 `challengeId` 파라미터 필요
2. **completedCount 계산 위치**: `completeRecipes`에서 계산해야 함
3. **상수 접근**: `CHALLENGE_CONSTANTS`에서 `totalCount`, `kakaoOpenChatUrl` 가져와야 함

##### 6.3 변경 후 구조

```text
ChallengePage
└── ChallengePageReady (useChallengeInfo 호출)
    ├── ChallengePeriod
    ├── SSRSuspense
    │   └── ChallengeContent (useChallengeRecipes 호출 - challengeId 전달)
    │       ├── ChallengeProgressSection (completeRecipes.length 사용)
    │       └── ChallengeRecipeList (props로 recipes 받음)
    └── ChallengeBottomBar (CHALLENGE_CONSTANTS.kakaoOpenChatUrl 사용)
```

##### 6.4 변경된 코드

**ChallengePageReady:**

```typescript
import { CHALLENGE_CONSTANTS } from "@/src/features/challenge";

function ChallengePageReady() {
  const { data } = useChallengeInfo();

  if (!data.isParticipant) {
    return <NonParticipantView />;
  }

  // ✅ data.startDate, data.endDate 그대로 사용 (API에서 변환됨)
  // ❌ data.completedCount → 삭제됨 (completeRecipes.length로 대체)
  // ❌ data.kakaoOpenChatUrl → 삭제됨 (상수로 대체)
  return (
    <>
      <div className="pb-28">
        <ChallengePeriod
          startDate={data.startDate}
          endDate={data.endDate}
        />

        {/* ⚠️ 변경: ChallengeProgressSection이 ChallengeContent 안으로 이동 */}
        <SSRSuspense fallback={<ChallengeRecipeListSkeleton />}>
          <ChallengeContent
            challengeId={data.challengeId}
            endDate={data.endDate}
          />
        </SSRSuspense>
      </div>

      <ChallengeBottomBar
        kakaoUrl={CHALLENGE_CONSTANTS.kakaoOpenChatUrl}  // ✅ 상수 사용
        endDate={data.endDate}
      />
    </>
  );
}
```

**ChallengeContent (신규):**

```typescript
function ChallengeContent({
  challengeId,
  endDate,
}: {
  challengeId: string;
  endDate: string;
}) {
  const {
    recipes,
    completeRecipes,
    totalElements,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useChallengeRecipes(challengeId);  // ✅ challengeId 전달

  // ✅ 완료 개수 = completeRecipes 배열 길이
  const completedCount = completeRecipes.length;

  return (
    <>
      <ChallengeProgressSection
        completedCount={completedCount}
        totalCount={CHALLENGE_CONSTANTS.totalCount}  // ✅ 상수: 3
        endDate={endDate}
      />
      <ChallengeRecipeList
        recipes={recipes}
        totalElements={totalElements}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </>
  );
}
```

**ChallengeRecipeList (수정):**

```typescript
interface ChallengeRecipeListProps {
  recipes: ChallengeRecipe[];
  totalElements: number;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
}

function ChallengeRecipeList({
  recipes,
  totalElements,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
}: ChallengeRecipeListProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // ✅ 무한 스크롤 로직 유지 (변경 없음)
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
        <h2 className="text-lg font-bold">챌린지 레시피</h2>
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
```

##### 6.5 기존 UI 컴포넌트 영향

| 컴포넌트 | 변경 여부 | 비고 |
|---------|---------|------|
| `ChallengePeriod` | ❌ 없음 | props 동일 (startDate, endDate) |
| `ChallengeProgressSection` | ❌ 없음 | props 동일 (completedCount, totalCount, endDate) |
| `ChallengeBottomBar` | ❌ 없음 | props 동일 (kakaoUrl, endDate) |
| `ChallengeRecipeCard` | ❌ 없음 | props 동일 (recipe) |
| `NonParticipantView` | ❌ 없음 | props 없음 |
| `ChallengeErrorFallback` | ❌ 없음 | props 동일 |

##### 6.6 필요한 import 추가

```typescript
import { CHALLENGE_CONSTANTS } from "@/src/features/challenge";
import type { ChallengeRecipe } from "@/src/features/challenge";
```

---

### 7. index.ts export 업데이트

#### `src/features/challenge/index.ts`

##### 7.1 현재 export 목록

```typescript
// Types & Constants
export type { ChallengeType } from "./model/types";
export { CHALLENGE_TYPE_LABELS, CHALLENGE_SIGNUP_FORM_URL } from "./model/types";

// Schema & Types
export type {
  ChallengeInfo,              // ❌ 삭제
  ChallengeData,
  NonParticipant,
  ChallengeRecipe,
  PaginatedChallengeRecipes,  // ❌ 삭제
} from "./model/schema";

export {
  ChallengeInfoSchema,              // ❌ 삭제
  ChallengeDataSchema,
  NonParticipantSchema,
  ChallengeRecipeSchema,
  PaginatedChallengeRecipesSchema,  // ❌ 삭제
} from "./model/schema";

// Mock Data
export {
  MOCK_PARTICIPANT,
  MOCK_NON_PARTICIPANT,
  MOCK_CHALLENGE_RECIPES,
  MOCK_PAGINATED_RECIPES,  // ❌ 삭제
} from "./model/mockData";

// ... (나머지는 유지)
```

##### 7.2 변경 후 export 목록

```typescript
// ============================================
// Types & Constants
// ============================================
export type { ChallengeType } from "./model/types";
export { CHALLENGE_TYPE_LABELS, CHALLENGE_SIGNUP_FORM_URL } from "./model/types";

// ✅ 신규: 하드코딩 상수
export { CHALLENGE_CONSTANTS } from "./model/constants";

// ============================================
// Schema & Types
// ============================================
export type {
  Participant,              // ✅ 신규 (ChallengeInfo 대체)
  ChallengeData,
  NonParticipant,
  ChallengeRecipe,
  CompleteRecipe,           // ✅ 신규
  ChallengeRecipesResponse, // ✅ 신규 (PaginatedChallengeRecipes 대체)
} from "./model/schema";

export {
  ParticipantSchema,              // ✅ 신규 (ChallengeInfoSchema 대체)
  ChallengeDataSchema,
  NonParticipantSchema,
  ChallengeRecipeSchema,
  CompleteRecipeSchema,           // ✅ 신규
  ChallengeRecipesResponseSchema, // ✅ 신규 (PaginatedChallengeRecipesSchema 대체)
} from "./model/schema";

// ============================================
// Mock Data (개발용)
// ============================================
export {
  MOCK_PARTICIPANT,
  MOCK_NON_PARTICIPANT,
  MOCK_CHALLENGE_RECIPES,
  MOCK_COMPLETE_RECIPES,  // ✅ 신규
  // MOCK_PAGINATED_RECIPES 삭제됨
} from "./model/mockData";

// ... (나머지는 유지)
```

##### 7.3 변경 요약

| 구분 | 삭제 | 추가 |
|------|------|------|
| 타입 | `ChallengeInfo`, `PaginatedChallengeRecipes` | `Participant`, `CompleteRecipe`, `ChallengeRecipesResponse` |
| 스키마 | `ChallengeInfoSchema`, `PaginatedChallengeRecipesSchema` | `ParticipantSchema`, `CompleteRecipeSchema`, `ChallengeRecipesResponseSchema` |
| Mock | `MOCK_PAGINATED_RECIPES` | `MOCK_COMPLETE_RECIPES` |
| 상수 | - | `CHALLENGE_CONSTANTS` |

---

## 작업 순서

1. [ ] `constants.ts` 생성
2. [ ] `schema.ts` 수정
3. [ ] `mockData.ts` 수정
4. [ ] `challengeApi.ts` 수정
5. [ ] `useChallengeRecipes.ts` 수정
6. [ ] `index.tsx` (views) 수정
7. [ ] `index.ts` (feature export) 수정
8. [ ] 테스트 (Mock 모드)

---

## 유지 사항

- `NEXT_PUBLIC_CHALLENGE_USE_MOCK` 환경변수 유지
- Mock 모드에서 나의 레시피 데이터 활용 유지
- 완료 오버레이는 이번 작업에서 제외 (추후 별도 작업)

---

## 참고: 레시피 ID 구조

백엔드의 `recipe_id`는 **기존 레시피와 동일한 ID**입니다.
별도의 챌린지 전용 레시피 ID가 아니므로, 완료 여부 매칭 시 그대로 사용 가능합니다.

```typescript
// 완료 여부 확인
const completedIds = completeRecipes.map(r => r.recipeId);
const isCompleted = completedIds.includes(recipe.recipeId);
```
