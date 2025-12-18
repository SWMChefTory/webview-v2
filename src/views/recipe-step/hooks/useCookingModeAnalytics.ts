import { useRef, useCallback, useMemo } from "react";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";

// ─────────────────────────────────────────────────────────────
// 타입 정의
// ─────────────────────────────────────────────────────────────

/** 명령 카테고리 */
export type CommandType = "navigation" | "video_control" | "timer" | "info";

/** 트리거 방식 */
export type TriggerMethod = "voice" | "touch";

/** 명령 유형별 카운터 */
interface CommandBreakdown {
  navigation: number;
  video_control: number;
  timer: number;
  info: number;
}

/** 내부 상태 (useRef로 관리) */
interface AnalyticsState {
  sessionStartTime: number;
  visitedStepsSet: Set<number>;
  visitedDetailsSet: Set<string>; // "stepIndex-detailIndex" 형태
  visitedDetailsCount: number;
  voiceCommandCount: number;
  touchCommandCount: number;
  commandBreakdown: CommandBreakdown;
  loopToggleCount: number;
  timerButtonTouchCount: number;
  micButtonTouchCount: number;
}

/** 훅 반환 타입 */
export interface CookingModeAnalytics {
  /** 세션 시작 (start 이벤트 발송) */
  trackStart: (params: {
    recipeId: string;
    totalSteps: number;
    totalDetails: number;
  }) => void;

  /** 명령 실행 (command 이벤트 발송 + 내부 카운터 증가) */
  trackCommand: (params: {
    recipeId: string;
    commandType: CommandType;
    commandDetail: string;
    triggerMethod: TriggerMethod;
    currentStep: number;
    currentDetail: number;
  }) => void;

  /** 단계 방문 기록 (이벤트 발송 X, 내부 상태만) */
  recordStepVisit: (stepIndex: number) => void;

  /** Detail 방문 기록 (이벤트 발송 X, 내부 상태만) */
  recordDetailVisit: (stepIndex: number, detailIndex: number) => void;

  /** 반복재생 토글 기록 (이벤트 발송 X, 내부 카운터만) */
  recordLoopToggle: () => void;

  /** 타이머 버튼 터치 기록 (이벤트 발송 X, 내부 카운터만) */
  recordTimerButtonTouch: () => void;

  /** 마이크 버튼 터치 기록 (이벤트 발송 X, 내부 카운터만) */
  recordMicButtonTouch: () => void;

  /** 세션 종료 (end 이벤트 발송) */
  trackEnd: (params: {
    recipeId: string;
    totalSteps: number;
    totalDetails: number;
  }) => void;
}

// ─────────────────────────────────────────────────────────────
// 훅 구현
// ─────────────────────────────────────────────────────────────

export function useCookingModeAnalytics(): CookingModeAnalytics {
  // useRef로 상태 관리 (리렌더링 방지)
  const stateRef = useRef<AnalyticsState>({
    sessionStartTime: 0,
    visitedStepsSet: new Set(),
    visitedDetailsSet: new Set(),
    visitedDetailsCount: 0,
    voiceCommandCount: 0,
    touchCommandCount: 0,
    commandBreakdown: {
      navigation: 0,
      video_control: 0,
      timer: 0,
      info: 0,
    },
    loopToggleCount: 0,
    timerButtonTouchCount: 0,
    micButtonTouchCount: 0,
  });

  // 상태 초기화 함수
  const resetState = useCallback(() => {
    stateRef.current = {
      sessionStartTime: Date.now(),
      visitedStepsSet: new Set(),
      visitedDetailsSet: new Set(),
      visitedDetailsCount: 0,
      voiceCommandCount: 0,
      touchCommandCount: 0,
      commandBreakdown: {
        navigation: 0,
        video_control: 0,
        timer: 0,
        info: 0,
      },
      loopToggleCount: 0,
      timerButtonTouchCount: 0,
      micButtonTouchCount: 0,
    };
  }, []);

  const trackStart = useCallback(
    ({
      recipeId,
      totalSteps,
      totalDetails,
    }: {
      recipeId: string;
      totalSteps: number;
      totalDetails: number;
    }) => {
      // 상태 초기화
      resetState();

      // 이벤트 발송
      track(AMPLITUDE_EVENT.COOKING_MODE_START, {
        recipe_id: recipeId,
        total_steps: totalSteps,
        total_details: totalDetails,
      });
    },
    [resetState]
  );

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
      const state = stateRef.current;

      // 내부 카운터 증가
      if (triggerMethod === "voice") {
        state.voiceCommandCount++;
      } else {
        state.touchCommandCount++;
      }
      state.commandBreakdown[commandType]++;

      // 이벤트 발송
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

  const recordStepVisit = useCallback((stepIndex: number) => {
    stateRef.current.visitedStepsSet.add(stepIndex);
  }, []);

  const recordDetailVisit = useCallback(
    (stepIndex: number, detailIndex: number) => {
      const state = stateRef.current;
      const key = `${stepIndex}-${detailIndex}`;
      state.visitedDetailsSet.add(key);
      state.visitedDetailsCount++;
    },
    []
  );

  const recordLoopToggle = useCallback(() => {
    stateRef.current.loopToggleCount++;
  }, []);

  const recordTimerButtonTouch = useCallback(() => {
    stateRef.current.timerButtonTouchCount++;
  }, []);

  const recordMicButtonTouch = useCallback(() => {
    stateRef.current.micButtonTouchCount++;
  }, []);

  const trackEnd = useCallback(
    ({
      recipeId,
      totalSteps,
      totalDetails,
    }: {
      recipeId: string;
      totalSteps: number;
      totalDetails: number;
    }) => {
      const state = stateRef.current;
      const durationSeconds = Math.round(
        (Date.now() - state.sessionStartTime) / 1000
      );

      // Step 관련 계산
      const uniqueSteps = state.visitedStepsSet.size;
      const stepCompletionRate =
        totalSteps > 0 ? Math.round((uniqueSteps / totalSteps) * 100) : 0;

      // Detail 관련 계산
      const uniqueDetails = state.visitedDetailsSet.size;
      const detailCompletionRate =
        totalDetails > 0 ? Math.round((uniqueDetails / totalDetails) * 100) : 0;

      // 참고: command_breakdown은 Amplitude SDK 타입 제약으로 평탄화하여 전송
      track(AMPLITUDE_EVENT.COOKING_MODE_END, {
        recipe_id: recipeId,
        duration_seconds: durationSeconds,

        // Step 관련
        total_steps: totalSteps,
        visited_steps_unique: uniqueSteps,
        step_completion_rate: stepCompletionRate,

        // Detail 관련
        total_details: totalDetails,
        visited_details_total: state.visitedDetailsCount,
        visited_details_unique: uniqueDetails,
        detail_completion_rate: detailCompletionRate,

        // Command 관련
        command_count: state.voiceCommandCount + state.touchCommandCount,
        voice_command_count: state.voiceCommandCount,
        touch_command_count: state.touchCommandCount,
        command_breakdown_navigation: state.commandBreakdown.navigation,
        command_breakdown_video_control: state.commandBreakdown.video_control,
        command_breakdown_timer: state.commandBreakdown.timer,
        command_breakdown_info: state.commandBreakdown.info,

        // 기타
        loop_toggle_count: state.loopToggleCount,
        timer_button_touch_count: state.timerButtonTouchCount,
        mic_button_touch_count: state.micButtonTouchCount,
      });
    },
    []
  );

  // 매 렌더링마다 새 객체 생성 방지 → useEffect 의존성 안정화
  return useMemo(
    () => ({
      trackStart,
      trackCommand,
      recordStepVisit,
      recordDetailVisit,
      recordLoopToggle,
      recordTimerButtonTouch,
      recordMicButtonTouch,
      trackEnd,
    }),
    [
      trackStart,
      trackCommand,
      recordStepVisit,
      recordDetailVisit,
      recordLoopToggle,
      recordTimerButtonTouch,
      recordMicButtonTouch,
      trackEnd,
    ]
  );
}
