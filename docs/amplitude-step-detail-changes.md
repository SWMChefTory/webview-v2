# Amplitude Step/Detail 추적 개선 문서

## 개요

현재 Amplitude 이벤트에서 Step 단위로만 추적하고 있어, 실제 세부 행동(Detail)을 정밀하게 분석하기 어려움.
Detail(Flat) 방식을 추가하여 더 정밀한 사용자 행동 분석이 가능하도록 개선.

---

## 배경: Step vs Detail 구조

### 레시피 데이터 구조
```
Recipe
└── steps: RecipeStep[]
    ├── stepOrder: number (0, 1, 2, ...)
    ├── subtitle: string ("재료 준비", "볶기" 등)
    └── details: StepDetail[]
        ├── text: string (세부 설명)
        └── start: number (영상 시간)
```

### 예시
```
Step 0: 인트로 (자동 생성)
  └── Detail 0: "인트로" (0초)

Step 1: 재료 준비
  ├── Detail 0: "양파를 썰어주세요" (10초)
  ├── Detail 1: "마늘을 다져주세요" (25초)
  └── Detail 2: "고기를 손질해주세요" (40초)

Step 2: 볶기
  ├── Detail 0: "팬에 기름을 두르세요" (60초)
  └── Detail 1: "양파를 먼저 볶아주세요" (75초)
```

### 카운트 방식 비교
| 방식 | 카운트 | 설명 |
|------|--------|------|
| Step 단위 (현재) | 3개 | 인트로, 재료 준비, 볶기 |
| Detail 단위 (Flat) | 6개 | 모든 세부 항목 합계 |

---

## 변경 대상 이벤트

### 1. RECIPE_DETAIL_VIEW (레시피 상세 페이지 진입)

**파일**: `webview-v2/src/views/recipe-detail/ui/index.tsx`

**현재**:
```typescript
track(AMPLITUDE_EVENT.RECIPE_DETAIL_VIEW, {
  recipe_id: id,
  recipe_title: videoInfo?.videoTitle || "",
  is_first_view: isFirstView,
  total_steps: steps.length,           // Step 단위
  total_ingredients: ingredients.length,
  has_video: !!videoInfo?.id,
});
```

**변경 후**:
```typescript
// Detail 총 개수 계산
const totalDetails = steps.reduce((sum, step) => sum + step.details.length, 0);

track(AMPLITUDE_EVENT.RECIPE_DETAIL_VIEW, {
  recipe_id: id,
  recipe_title: videoInfo?.videoTitle || "",
  is_first_view: isFirstView,
  total_steps: steps.length,           // Step 단위 (유지)
  total_details: totalDetails,         // Detail 단위 (추가)
  total_ingredients: ingredients.length,
  has_video: !!videoInfo?.id,
});
```

---

### 2. RECIPE_DETAIL_VIDEO_SEEK (스텝 클릭 → 영상 시간 이동)

**파일**: `webview-v2/src/views/recipe-detail/ui/index.tsx`

**현재**:
```typescript
const handleStepClick = (
  stepOrder: number,
  stepTitle: string,
  videoTime: number
) => {
  track(AMPLITUDE_EVENT.RECIPE_DETAIL_VIDEO_SEEK, {
    recipe_id: id,
    step_order: stepOrder,
    step_title: stepTitle,
    video_time: videoTime,
  });
};
```

**변경 후**:
```typescript
const handleStepClick = (
  stepOrder: number,
  stepTitle: string,
  videoTime: number,
  detailIndex: number          // 추가
) => {
  track(AMPLITUDE_EVENT.RECIPE_DETAIL_VIDEO_SEEK, {
    recipe_id: id,
    step_order: stepOrder,
    step_title: stepTitle,
    video_time: videoTime,
    detail_index: detailIndex, // 추가: Step 내 Detail 인덱스 (0-based)
  });
};
```

**호출부 변경** (`RecipeBottomSheet` 내부):
```typescript
// 변경 전
onStepClick?.(step.stepOrder, step.subtitle, d.start);

// 변경 후
onStepClick?.(step.stepOrder, step.subtitle, d.start, di);
```

---

### 3. COOKING_MODE_START (요리 모드 시작)

**파일**: `webview-v2/src/views/recipe-step/hooks/useCookingModeAnalytics.ts`

**현재**:
```typescript
track(AMPLITUDE_EVENT.COOKING_MODE_START, {
  recipe_id: recipeId,
  total_steps: totalSteps,
});
```

**변경 후**:
```typescript
track(AMPLITUDE_EVENT.COOKING_MODE_START, {
  recipe_id: recipeId,
  total_steps: totalSteps,       // Step 단위 (유지)
  total_details: totalDetails,   // Detail 단위 (추가)
});
```

**타입 변경**:
```typescript
// 변경 전
trackStart: (params: { recipeId: string; totalSteps: number }) => void;

// 변경 후
trackStart: (params: {
  recipeId: string;
  totalSteps: number;
  totalDetails: number;  // 추가
}) => void;
```

---

### 4. COOKING_MODE_COMMAND (명령 실행)

**파일**: `webview-v2/src/views/recipe-step/hooks/useCookingModeAnalytics.ts`

**현재**:
```typescript
track(AMPLITUDE_EVENT.COOKING_MODE_COMMAND, {
  recipe_id: recipeId,
  command_type: commandType,
  command_detail: commandDetail,
  trigger_method: triggerMethod,
  current_step: currentStep,
});
```

**변경 후**:
```typescript
track(AMPLITUDE_EVENT.COOKING_MODE_COMMAND, {
  recipe_id: recipeId,
  command_type: commandType,
  command_detail: commandDetail,
  trigger_method: triggerMethod,
  current_step: currentStep,           // Step 인덱스 (유지)
  current_detail: currentDetail,       // Detail 인덱스 (추가)
});
```

**타입 변경**:
```typescript
// 변경 전
trackCommand: (params: {
  recipeId: string;
  commandType: CommandType;
  commandDetail: string;
  triggerMethod: TriggerMethod;
  currentStep: number;
}) => void;

// 변경 후
trackCommand: (params: {
  recipeId: string;
  commandType: CommandType;
  commandDetail: string;
  triggerMethod: TriggerMethod;
  currentStep: number;
  currentDetail: number;  // 추가
}) => void;
```

---

### 5. COOKING_MODE_END (요리 모드 종료)

**파일**: `webview-v2/src/views/recipe-step/hooks/useCookingModeAnalytics.ts`

**현재**:
```typescript
track(AMPLITUDE_EVENT.COOKING_MODE_END, {
  recipe_id: recipeId,
  total_steps: totalSteps,
  duration_seconds: durationSeconds,
  exit_step: exitStep,
  visited_steps_total: state.visitedStepsCount,
  visited_steps_unique: uniqueSteps,
  step_completion_rate: completionRate,
  // ... 기타 속성
});
```

**변경 후**:
```typescript
track(AMPLITUDE_EVENT.COOKING_MODE_END, {
  recipe_id: recipeId,
  // Step 관련 (유지)
  total_steps: totalSteps,
  exit_step: exitStep,
  visited_steps_total: state.visitedStepsCount,
  visited_steps_unique: uniqueSteps,
  step_completion_rate: stepCompletionRate,

  // Detail 관련 (추가)
  total_details: totalDetails,
  exit_detail: exitDetail,
  visited_details_total: state.visitedDetailsCount,
  visited_details_unique: uniqueDetails,
  detail_completion_rate: detailCompletionRate,

  duration_seconds: durationSeconds,
  // ... 기타 속성
});
```

**내부 상태 추가**:
```typescript
interface AnalyticsState {
  // 기존
  visitedStepsSet: Set<number>;
  visitedStepsCount: number;

  // 추가
  visitedDetailsSet: Set<string>;     // "stepIndex-detailIndex" 형태로 저장
  visitedDetailsCount: number;
}
```

**타입 변경**:
```typescript
// 변경 전
trackEnd: (params: {
  recipeId: string;
  totalSteps: number;
  exitStep: number;
}) => void;

// 변경 후
trackEnd: (params: {
  recipeId: string;
  totalSteps: number;
  totalDetails: number;    // 추가
  exitStep: number;
  exitDetail: number;      // 추가
}) => void;
```

---

### 6. recordStepVisit → recordDetailVisit 추가

**파일**: `webview-v2/src/views/recipe-step/hooks/useCookingModeAnalytics.ts`

**현재**:
```typescript
const recordStepVisit = useCallback((stepIndex: number) => {
  const state = stateRef.current;
  state.visitedStepsSet.add(stepIndex);
  state.visitedStepsCount++;
}, []);
```

**변경 후**:
```typescript
// 기존 유지
const recordStepVisit = useCallback((stepIndex: number) => {
  const state = stateRef.current;
  state.visitedStepsSet.add(stepIndex);
  state.visitedStepsCount++;
}, []);

// 추가
const recordDetailVisit = useCallback((stepIndex: number, detailIndex: number) => {
  const state = stateRef.current;
  const key = `${stepIndex}-${detailIndex}`;
  state.visitedDetailsSet.add(key);
  state.visitedDetailsCount++;
}, []);
```

---

## 호출부 변경 사항

### ui/index.tsx (RecipeStepPageReady)

**trackStart 호출**:
```typescript
// 변경 전
analytics.trackStart({
  recipeId: id,
  totalSteps: steps.length,
});

// 변경 후
const totalDetails = steps.reduce((sum, step) => sum + step.details.length, 0);
analytics.trackStart({
  recipeId: id,
  totalSteps: steps.length,
  totalDetails: totalDetails,
});
```

**recordStepVisit → recordDetailVisit**:
```typescript
// 변경 전
useEffect(() => {
  if (prevStepRef.current !== currentIndex) {
    analytics.recordStepVisit(currentIndex);
    prevStepRef.current = currentIndex;
  }
}, [currentIndex, analytics]);

// 변경 후
useEffect(() => {
  if (prevStepRef.current !== currentIndex || prevDetailRef.current !== currentDetailIndex) {
    analytics.recordStepVisit(currentIndex);
    analytics.recordDetailVisit(currentIndex, currentDetailIndex);
    prevStepRef.current = currentIndex;
    prevDetailRef.current = currentDetailIndex;
  }
}, [currentIndex, currentDetailIndex, analytics]);
```

**trackCommand 호출** (모든 호출 위치):
```typescript
// 변경 전
analytics.trackCommand({
  recipeId: id,
  commandType: "navigation",
  commandDetail: "NEXT",
  triggerMethod: "voice",
  currentStep: currentIndex,
});

// 변경 후
analytics.trackCommand({
  recipeId: id,
  commandType: "navigation",
  commandDetail: "NEXT",
  triggerMethod: "voice",
  currentStep: currentIndex,
  currentDetail: currentDetailIndex,
});
```

**trackEnd 호출**:
```typescript
// 변경 전
analytics.trackEnd({
  recipeId: id,
  totalSteps: steps.length,
  exitStep: currentIndexRef.current,
});

// 변경 후
const totalDetails = steps.reduce((sum, step) => sum + step.details.length, 0);
analytics.trackEnd({
  recipeId: id,
  totalSteps: steps.length,
  totalDetails: totalDetails,
  exitStep: currentIndexRef.current,
  exitDetail: currentDetailIndexRef.current,
});
```

---

## 변경 파일 목록

| 파일 | 변경 내용 |
|------|----------|
| `webview-v2/src/views/recipe-detail/ui/index.tsx` | VIEW에 total_details 추가, VIDEO_SEEK에 detail_index 추가 |
| `webview-v2/src/views/recipe-step/hooks/useCookingModeAnalytics.ts` | 모든 함수 시그니처 및 내부 로직 변경 |
| `webview-v2/src/views/recipe-step/ui/index.tsx` | analytics 함수 호출부 변경 |

---

## 변경 미대상 (튜토리얼 Step)

아래 이벤트의 `completed_steps`, `total_steps`는 **튜토리얼 단계**를 의미하므로 변경 대상이 아님:

- `TUTORIAL_HANDSFREE_STEP_START`
- `TUTORIAL_HANDSFREE_STEP_END`

---

## Amplitude 속성 요약

### 변경 후 전체 속성 목록

| 이벤트 | 속성 | 타입 | 설명 |
|--------|------|------|------|
| **RECIPE_DETAIL_VIEW** | `total_steps` | number | 전체 Step 수 |
| | `total_details` | number | 전체 Detail 수 (추가) |
| **RECIPE_DETAIL_VIDEO_SEEK** | `step_order` | number | Step 번호 |
| | `detail_index` | number | Detail 인덱스 (추가) |
| **COOKING_MODE_START** | `total_steps` | number | 전체 Step 수 |
| | `total_details` | number | 전체 Detail 수 (추가) |
| **COOKING_MODE_COMMAND** | `current_step` | number | 현재 Step 인덱스 |
| | `current_detail` | number | 현재 Detail 인덱스 (추가) |
| **COOKING_MODE_END** | `total_steps` | number | 전체 Step 수 |
| | `total_details` | number | 전체 Detail 수 (추가) |
| | `exit_step` | number | 종료 시 Step 인덱스 |
| | `exit_detail` | number | 종료 시 Detail 인덱스 (추가) |
| | `visited_steps_total` | number | Step 방문 총 횟수 |
| | `visited_steps_unique` | number | 고유 방문 Step 수 |
| | `step_completion_rate` | number | Step 완료율 (%) |
| | `visited_details_total` | number | Detail 방문 총 횟수 (추가) |
| | `visited_details_unique` | number | 고유 방문 Detail 수 (추가) |
| | `detail_completion_rate` | number | Detail 완료율 (%) (추가) |
