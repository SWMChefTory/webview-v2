# Amplitude Detail 중심 추적 개선 문서

## 개요

현재 Amplitude 이벤트가 Step 단위로만 추적되어 있어 정밀한 사용자 행동 분석이 어려움.
**Detail 중심**으로 변경하여 실제 세부 행동을 추적하고, Step은 메타데이터로만 유지.

---

## 변경 방향

### 핵심 원칙
- **Detail**: 실제 사용자 행동 추적 (방문, 완료율 등)
- **Step**: 메타데이터로만 유지 (total_steps, current_step, exit_step)
- **제거**: Step 기반 집계 속성 (visited_steps_*, step_completion_rate)

### 변경 요약

| 구분 | 유지 | 추가 | 제거 |
|------|------|------|------|
| 메타데이터 | `total_steps` | `total_details` | - |
| 현재 위치 | `current_step`, `exit_step` | `current_detail`, `exit_detail` | - |
| 방문 추적 | - | `visited_details_*` | `visited_steps_*` |
| 완료율 | - | `detail_completion_rate` | `step_completion_rate` |

---

## 고려사항

### 1. 인트로 포함 여부

현재 `useRecipeStepController`에서 인트로가 자동 추가됨:
```typescript
// useRecipeStepController.ts:31-37
return [
  {
    id: INTRO,
    stepOrder: -1,
    subtitle: "인트로",
    details: [{ start: 0, text: "인트로" }],
  },
  ..._steps,
]
```

**결정**: 인트로 **포함**하여 카운트
- `total_steps`: 인트로 포함 (서버 Step 수 + 1)
- `total_details`: 인트로 Detail 포함

**이유**: 사용자는 실제로 인트로부터 시작하므로, 행동 추적에 포함하는 것이 정확함

**⚠️ 주의: recipe-detail vs recipe-step 차이**

| 파일 | 데이터 소스 | Intro 포함 |
|------|------------|-----------|
| `recipe-detail/ui/index.tsx` | 서버 원본 (`data?.steps`) | ❌ 없음 |
| `recipe-step/ui/index.tsx` | `useRecipeStepController` | ✅ 자동 추가 |

**예시** (서버에 Step 2개, 각 Detail 2개씩인 경우):
- `recipe-detail`: `total_steps=2`, `total_details=4`
- `recipe-step`: `total_steps=3`, `total_details=5` (Intro 포함)

**분석 시 주의**: 같은 레시피라도 페이지에 따라 값이 다를 수 있음
- `RECIPE_DETAIL_VIEW`: 서버 원본 기준
- `COOKING_MODE_*`: Intro 포함 기준

---

### 2. Detail 방문 기록 방식

**현재 코드** (Step만 기록):
```typescript
// ui/index.tsx:148-155
const prevStepRef = useRef<number | null>(null);
useEffect(() => {
  if (prevStepRef.current !== currentIndex) {
    analytics.recordStepVisit(currentIndex);
    prevStepRef.current = currentIndex;
  }
}, [currentIndex, analytics]);
```

**문제점**:
- `currentDetailIndex` 변경은 추적하지 않음
- Step 내에서 Detail 이동 시 기록 안 됨

**변경 후**:
```typescript
const prevStepRef = useRef<number | null>(null);
const prevDetailRef = useRef<number | null>(null);

useEffect(() => {
  const stepChanged = prevStepRef.current !== currentIndex;
  const detailChanged = prevDetailRef.current !== currentDetailIndex;

  if (stepChanged || detailChanged) {
    analytics.recordDetailVisit(currentIndex, currentDetailIndex);
    prevStepRef.current = currentIndex;
    prevDetailRef.current = currentDetailIndex;
  }
}, [currentIndex, currentDetailIndex, analytics]);
```

---

### 3. currentDetailIndex Ref 추가 필요

**현재 코드**:
```typescript
// ui/index.tsx:118-125
const currentIndexRef = useRef(currentIndex);
const hasTrackedStartRef = useRef(false);

useEffect(() => {
  currentIndexRef.current = currentIndex;
}, [currentIndex]);
```

**변경 후** (추가 필요):
```typescript
const currentIndexRef = useRef(currentIndex);
const currentDetailIndexRef = useRef(currentDetailIndex);  // 추가
const hasTrackedStartRef = useRef(false);

useEffect(() => {
  currentIndexRef.current = currentIndex;
}, [currentIndex]);

useEffect(() => {
  currentDetailIndexRef.current = currentDetailIndex;  // 추가
}, [currentDetailIndex]);
```

---

### 4. trackCommand 호출부 변경 (10곳)

현재 `trackCommand` 호출 시 `currentStep`만 전달:
```typescript
analytics.trackCommand({
  recipeId: id,
  commandType: "navigation",
  commandDetail: "NEXT",
  triggerMethod: "voice",
  currentStep: currentIndex,  // Detail 없음
});
```

**변경 필요 위치**:

| 위치 | Intent | 라인 |
|------|--------|------|
| ui/index.tsx | NEXT | 225-231 |
| ui/index.tsx | VIDEO PLAY | 245-251 |
| ui/index.tsx | VIDEO STOP | 262-268 |
| ui/index.tsx | PREV | 276-282 |
| ui/index.tsx | TIMESTAMP | 291-297 |
| ui/index.tsx | STEP | 303-309 |
| ui/index.tsx | TIMER | 322-328 |
| ui/index.tsx | INGREDIENT | 342-348 |
| ui/index.tsx | ProgressBar onTrackTouchNavigation | 427-435 |
| ui/index.tsx | StepsContent onTrackTouchNavigation | 450-458 |

**변경 후**:
```typescript
analytics.trackCommand({
  recipeId: id,
  commandType: "navigation",
  commandDetail: "NEXT",
  triggerMethod: "voice",
  currentStep: currentIndex,
  currentDetail: currentDetailIndex,  // 추가
});
```

---

### 5. totalDetails 계산

**계산 방법**:
```typescript
const totalDetails = steps.reduce((sum, step) => sum + step.details.length, 0);
```

**사용 위치**:
- `trackStart` 호출 시
- `trackEnd` 호출 시

---

## 변경 대상 파일 및 상세 내용

### 1. useCookingModeAnalytics.ts

#### 1-1. AnalyticsState 인터페이스 변경

```typescript
// 변경 전
interface AnalyticsState {
  sessionStartTime: number;
  visitedStepsSet: Set<number>;
  visitedStepsCount: number;
  // ... 기타 속성
}

// 변경 후
interface AnalyticsState {
  sessionStartTime: number;
  visitedDetailsSet: Set<string>;    // "stepIndex-detailIndex" 형태
  visitedDetailsCount: number;
  // ... 기타 속성 (visitedStepsSet, visitedStepsCount 제거)
}
```

#### 1-2. CookingModeAnalytics 인터페이스 변경

```typescript
// 변경 전
export interface CookingModeAnalytics {
  trackStart: (params: { recipeId: string; totalSteps: number }) => void;
  trackCommand: (params: {
    recipeId: string;
    commandType: CommandType;
    commandDetail: string;
    triggerMethod: TriggerMethod;
    currentStep: number;
  }) => void;
  recordStepVisit: (stepIndex: number) => void;
  trackEnd: (params: {
    recipeId: string;
    totalSteps: number;
    exitStep: number;
  }) => void;
  // ... 기타 메서드
}

// 변경 후
export interface CookingModeAnalytics {
  trackStart: (params: {
    recipeId: string;
    totalSteps: number;
    totalDetails: number;      // 추가
  }) => void;
  trackCommand: (params: {
    recipeId: string;
    commandType: CommandType;
    commandDetail: string;
    triggerMethod: TriggerMethod;
    currentStep: number;
    currentDetail: number;     // 추가
  }) => void;
  recordDetailVisit: (stepIndex: number, detailIndex: number) => void;  // 변경
  trackEnd: (params: {
    recipeId: string;
    totalSteps: number;
    totalDetails: number;      // 추가
    exitStep: number;
    exitDetail: number;        // 추가
  }) => void;
  // ... 기타 메서드
}
```

#### 1-3. resetState 변경

```typescript
// 변경 전
const resetState = useCallback(() => {
  stateRef.current = {
    sessionStartTime: Date.now(),
    visitedStepsSet: new Set(),
    visitedStepsCount: 0,
    // ...
  };
}, []);

// 변경 후
const resetState = useCallback(() => {
  stateRef.current = {
    sessionStartTime: Date.now(),
    visitedDetailsSet: new Set(),
    visitedDetailsCount: 0,
    // ...
  };
}, []);
```

#### 1-4. trackStart 변경

```typescript
// 변경 전
const trackStart = useCallback(
  ({ recipeId, totalSteps }: { recipeId: string; totalSteps: number }) => {
    resetState();
    track(AMPLITUDE_EVENT.COOKING_MODE_START, {
      recipe_id: recipeId,
      total_steps: totalSteps,
    });
  },
  [resetState]
);

// 변경 후
const trackStart = useCallback(
  ({ recipeId, totalSteps, totalDetails }: {
    recipeId: string;
    totalSteps: number;
    totalDetails: number;
  }) => {
    resetState();
    track(AMPLITUDE_EVENT.COOKING_MODE_START, {
      recipe_id: recipeId,
      total_steps: totalSteps,
      total_details: totalDetails,
    });
  },
  [resetState]
);
```

#### 1-5. trackCommand 변경

```typescript
// 변경 전
const trackCommand = useCallback(
  ({
    recipeId,
    commandType,
    commandDetail,
    triggerMethod,
    currentStep,
  }: {
    recipeId: string;
    commandType: CommandType;
    commandDetail: string;
    triggerMethod: TriggerMethod;
    currentStep: number;
  }) => {
    // ...
    track(AMPLITUDE_EVENT.COOKING_MODE_COMMAND, {
      recipe_id: recipeId,
      command_type: commandType,
      command_detail: commandDetail,
      trigger_method: triggerMethod,
      current_step: currentStep,
    });
  },
  []
);

// 변경 후
const trackCommand = useCallback(
  ({
    recipeId,
    commandType,
    commandDetail,
    triggerMethod,
    currentStep,
    currentDetail,
  }: {
    recipeId: string;
    commandType: CommandType;
    commandDetail: string;
    triggerMethod: TriggerMethod;
    currentStep: number;
    currentDetail: number;
  }) => {
    // ...
    track(AMPLITUDE_EVENT.COOKING_MODE_COMMAND, {
      recipe_id: recipeId,
      command_type: commandType,
      command_detail: commandDetail,
      trigger_method: triggerMethod,
      current_step: currentStep,
      current_detail: currentDetail,
    });
  },
  []
);
```

#### 1-6. recordStepVisit → recordDetailVisit 변경

```typescript
// 변경 전
const recordStepVisit = useCallback((stepIndex: number) => {
  const state = stateRef.current;
  state.visitedStepsSet.add(stepIndex);
  state.visitedStepsCount++;
}, []);

// 변경 후
const recordDetailVisit = useCallback((stepIndex: number, detailIndex: number) => {
  const state = stateRef.current;
  const key = `${stepIndex}-${detailIndex}`;
  state.visitedDetailsSet.add(key);
  state.visitedDetailsCount++;
}, []);
```

#### 1-7. trackEnd 변경

```typescript
// 변경 전
const trackEnd = useCallback(
  ({
    recipeId,
    totalSteps,
    exitStep,
  }: {
    recipeId: string;
    totalSteps: number;
    exitStep: number;
  }) => {
    const state = stateRef.current;
    const durationSeconds = Math.round(
      (Date.now() - state.sessionStartTime) / 1000
    );
    const uniqueSteps = state.visitedStepsSet.size;
    const completionRate =
      totalSteps > 0 ? Math.round((uniqueSteps / totalSteps) * 100) : 0;

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
  },
  []
);

// 변경 후
const trackEnd = useCallback(
  ({
    recipeId,
    totalSteps,
    totalDetails,
    exitStep,
    exitDetail,
  }: {
    recipeId: string;
    totalSteps: number;
    totalDetails: number;
    exitStep: number;
    exitDetail: number;
  }) => {
    const state = stateRef.current;
    const durationSeconds = Math.round(
      (Date.now() - state.sessionStartTime) / 1000
    );
    const uniqueDetails = state.visitedDetailsSet.size;
    const detailCompletionRate =
      totalDetails > 0 ? Math.round((uniqueDetails / totalDetails) * 100) : 0;

    track(AMPLITUDE_EVENT.COOKING_MODE_END, {
      recipe_id: recipeId,
      total_steps: totalSteps,
      total_details: totalDetails,
      duration_seconds: durationSeconds,
      exit_step: exitStep,
      exit_detail: exitDetail,
      visited_details_total: state.visitedDetailsCount,
      visited_details_unique: uniqueDetails,
      detail_completion_rate: detailCompletionRate,
      // ... 기타 속성 (visited_steps_*, step_completion_rate 제거)
    });
  },
  []
);
```

#### 1-8. return 객체 변경

```typescript
// 변경 전
return {
  trackStart,
  trackCommand,
  recordStepVisit,
  recordLoopToggle,
  recordTimerButtonTouch,
  recordMicButtonTouch,
  trackEnd,
};

// 변경 후
return {
  trackStart,
  trackCommand,
  recordDetailVisit,  // 변경
  recordLoopToggle,
  recordTimerButtonTouch,
  recordMicButtonTouch,
  trackEnd,
};
```

---

### 2. ui/index.tsx (RecipeStepPageReady)

#### 2-1. totalDetails 계산 추가

```typescript
const { steps, currentIndex, currentDetailIndex, chageStepByTime } =
  useRecipeStepController({
    recipeId: id,
  });

// 추가
const totalDetails = useMemo(() =>
  steps.reduce((sum, step) => sum + step.details.length, 0),
  [steps]
);
```

#### 2-2. Ref 추가

```typescript
// 변경 전
const currentIndexRef = useRef(currentIndex);
const hasTrackedStartRef = useRef(false);

useEffect(() => {
  currentIndexRef.current = currentIndex;
}, [currentIndex]);

// 변경 후
const currentIndexRef = useRef(currentIndex);
const currentDetailIndexRef = useRef(currentDetailIndex);  // 추가
const hasTrackedStartRef = useRef(false);

useEffect(() => {
  currentIndexRef.current = currentIndex;
}, [currentIndex]);

useEffect(() => {
  currentDetailIndexRef.current = currentDetailIndex;  // 추가
}, [currentDetailIndex]);
```

#### 2-3. trackStart 호출 변경

```typescript
// 변경 전
analytics.trackStart({
  recipeId: id,
  totalSteps: steps.length,
});

// 변경 후
analytics.trackStart({
  recipeId: id,
  totalSteps: steps.length,
  totalDetails: totalDetails,
});
```

#### 2-4. trackEnd 호출 변경

```typescript
// 변경 전
return () => {
  analytics.trackEnd({
    recipeId: id,
    totalSteps: steps.length,
    exitStep: currentIndexRef.current,
  });
};

// 변경 후
return () => {
  analytics.trackEnd({
    recipeId: id,
    totalSteps: steps.length,
    totalDetails: totalDetails,
    exitStep: currentIndexRef.current,
    exitDetail: currentDetailIndexRef.current,
  });
};
```

#### 2-5. recordStepVisit → recordDetailVisit 변경

```typescript
// 변경 전
const prevStepRef = useRef<number | null>(null);
useEffect(() => {
  if (prevStepRef.current !== currentIndex) {
    analytics.recordStepVisit(currentIndex);
    prevStepRef.current = currentIndex;
  }
}, [currentIndex, analytics]);

// 변경 후
const prevStepRef = useRef<number | null>(null);
const prevDetailRef = useRef<number | null>(null);
useEffect(() => {
  const stepChanged = prevStepRef.current !== currentIndex;
  const detailChanged = prevDetailRef.current !== currentDetailIndex;

  if (stepChanged || detailChanged) {
    analytics.recordDetailVisit(currentIndex, currentDetailIndex);
    prevStepRef.current = currentIndex;
    prevDetailRef.current = currentDetailIndex;
  }
}, [currentIndex, currentDetailIndex, analytics]);
```

#### 2-6. trackCommand 호출 변경 (10곳)

모든 `trackCommand` 호출에 `currentDetail: currentDetailIndex` 추가:

```typescript
// 예시 (NEXT 명령)
analytics.trackCommand({
  recipeId: id,
  commandType: "navigation",
  commandDetail: "NEXT",
  triggerMethod: "voice",
  currentStep: currentIndex,
  currentDetail: currentDetailIndex,  // 추가
});
```

**변경 위치 목록**:
- 라인 225-231 (NEXT)
- 라인 245-251 (VIDEO PLAY)
- 라인 262-268 (VIDEO STOP)
- 라인 276-282 (PREV)
- 라인 291-297 (TIMESTAMP)
- 라인 303-309 (STEP)
- 라인 322-328 (TIMER)
- 라인 342-348 (INGREDIENT)
- 라인 427-435 (ProgressBar onTrackTouchNavigation)
- 라인 450-458 (StepsContent onTrackTouchNavigation)

---

### 3. recipe-detail/ui/index.tsx

#### 3-1. RECIPE_DETAIL_VIEW에 total_details 추가

```typescript
// 변경 전
track(AMPLITUDE_EVENT.RECIPE_DETAIL_VIEW, {
  recipe_id: id,
  recipe_title: videoInfo?.videoTitle || "",
  is_first_view: isFirstView,
  total_steps: steps.length,
  total_ingredients: ingredients.length,
  has_video: !!videoInfo?.id,
});

// 변경 후
const totalDetails = steps.reduce((sum, step) => sum + step.details.length, 0);

track(AMPLITUDE_EVENT.RECIPE_DETAIL_VIEW, {
  recipe_id: id,
  recipe_title: videoInfo?.videoTitle || "",
  is_first_view: isFirstView,
  total_steps: steps.length,
  total_details: totalDetails,  // 추가
  total_ingredients: ingredients.length,
  has_video: !!videoInfo?.id,
});
```

#### 3-2. handleStepClick에 detailIndex 추가

```typescript
// 변경 전
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

// 변경 후
const handleStepClick = (
  stepOrder: number,
  stepTitle: string,
  videoTime: number,
  detailIndex: number  // 추가
) => {
  track(AMPLITUDE_EVENT.RECIPE_DETAIL_VIDEO_SEEK, {
    recipe_id: id,
    step_order: stepOrder,
    step_title: stepTitle,
    video_time: videoTime,
    detail_index: detailIndex,  // 추가
  });
};
```

#### 3-3. onStepClick props 타입 변경

```typescript
// 변경 전
onStepClick?: (stepOrder: number, stepTitle: string, videoTime: number) => void;

// 변경 후
onStepClick?: (stepOrder: number, stepTitle: string, videoTime: number, detailIndex: number) => void;
```

#### 3-4. RecipeBottomSheet 내부 호출 변경

```typescript
// 변경 전 (라인 734)
onStepClick?.(step.stepOrder, step.subtitle, d.start);

// 변경 후
onStepClick?.(step.stepOrder, step.subtitle, d.start, di);
```

---

## 제거 대상 속성

| 이벤트 | 제거 속성 |
|--------|----------|
| `COOKING_MODE_END` | `visited_steps_total` |
| `COOKING_MODE_END` | `visited_steps_unique` |
| `COOKING_MODE_END` | `step_completion_rate` |

---

## 최종 Amplitude 속성 목록

### RECIPE_DETAIL_VIEW
| 속성 | 타입 | 상태 |
|------|------|------|
| `recipe_id` | string | 유지 |
| `recipe_title` | string | 유지 |
| `is_first_view` | boolean | 유지 |
| `total_steps` | number | 유지 |
| `total_details` | number | **추가** |
| `total_ingredients` | number | 유지 |
| `has_video` | boolean | 유지 |

### RECIPE_DETAIL_VIDEO_SEEK
| 속성 | 타입 | 상태 |
|------|------|------|
| `recipe_id` | string | 유지 |
| `step_order` | number | 유지 |
| `step_title` | string | 유지 |
| `video_time` | number | 유지 |
| `detail_index` | number | **추가** |

### COOKING_MODE_START
| 속성 | 타입 | 상태 |
|------|------|------|
| `recipe_id` | string | 유지 |
| `total_steps` | number | 유지 |
| `total_details` | number | **추가** |

### COOKING_MODE_COMMAND
| 속성 | 타입 | 상태 |
|------|------|------|
| `recipe_id` | string | 유지 |
| `command_type` | string | 유지 |
| `command_detail` | string | 유지 |
| `trigger_method` | string | 유지 |
| `current_step` | number | 유지 |
| `current_detail` | number | **추가** |

### COOKING_MODE_END
| 속성 | 타입 | 상태 |
|------|------|------|
| `recipe_id` | string | 유지 |
| `total_steps` | number | 유지 |
| `total_details` | number | **추가** |
| `duration_seconds` | number | 유지 |
| `exit_step` | number | 유지 |
| `exit_detail` | number | **추가** |
| `visited_steps_total` | number | **제거** |
| `visited_steps_unique` | number | **제거** |
| `step_completion_rate` | number | **제거** |
| `visited_details_total` | number | **추가** |
| `visited_details_unique` | number | **추가** |
| `detail_completion_rate` | number | **추가** |
| `command_count` | number | 유지 |
| `voice_command_count` | number | 유지 |
| `touch_command_count` | number | 유지 |
| `command_breakdown_*` | number | 유지 |
| `loop_toggle_count` | number | 유지 |
| `timer_button_touch_count` | number | 유지 |
| `mic_button_touch_count` | number | 유지 |

---

## 변경 파일 요약

| 파일 | 변경 내용 |
|------|----------|
| `webview-v2/src/views/recipe-step/hooks/useCookingModeAnalytics.ts` | 타입, 상태, 모든 함수 변경 |
| `webview-v2/src/views/recipe-step/ui/index.tsx` | totalDetails 계산, Ref 추가, 모든 analytics 호출부 변경 |
| `webview-v2/src/views/recipe-detail/ui/index.tsx` | VIEW에 total_details 추가, VIDEO_SEEK에 detail_index 추가, props 타입 변경 |

---

## 기존 데이터와의 호환성

**주의**: 변경 후 기존 데이터와 비교 시 차이 발생

| 지표 | 기존 | 변경 후 |
|------|------|---------|
| 완료율 | Step 기준 (예: 2/3 = 66%) | Detail 기준 (예: 4/6 = 66%) |
| 방문 수 | Step 방문 횟수 | Detail 방문 횟수 |

**권장**: 변경 시점 이후 데이터만 새 지표로 분석
