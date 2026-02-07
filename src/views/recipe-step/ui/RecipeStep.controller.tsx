import { useRouter } from "next/router";
import { useEffect, useRef, useState, useCallback } from "react";
import { useFetchRecipe } from "@/src/entities/recipe/model/useRecipe";
import { useRecipeStepController } from "../hooks/useRecipeStepController";
import { useCookingModeAnalytics } from "../hooks/useCookingModeAnalytics";
import { useTutorial, useTutorialActions } from "../hooks/useTutorial";
import { useSafeArea } from "../hooks/useSafeArea";
import { useSimpleSpeech } from "../hooks/useSimpleSpeech";
import { useHandleTimerVoiceIntent } from "../hooks/useTimerIntent";
import { useOrientation } from "../hooks/useOrientation";
import { request, MODE } from "@/src/shared/client/native/client";
import { parseIntent } from "../lib/parseIntent";
import type { popoverHandle } from "@/src/widgets/timer/button/ui/timerButton";
import { popoverHandle as micButtonPopoverHandle } from "./micButtonPopover";
import type { VideoRefProps } from "./video";

export type RecipeStepVariant = "mobile" | "desktop";

export function useRecipeStepPageController(id: string) {
  const router = useRouter();
  const orientation = useOrientation();
  const { data: recipe } = useFetchRecipe(id);
  const analytics = useCookingModeAnalytics();

  useSafeArea({ orientation });

  useEffect(() => {
    return () => {
      request(MODE.UNBLOCKING, "SAFE_AREA", {
        top: { color: "#ffffff", isExists: true },
        bottom: { color: "#ffffff", isExists: false },
        left: { color: "#ffffff", isExists: false },
        right: { color: "#ffffff", isExists: false },
      });
    };
  }, []);

  const [isInRepeat, setIsInRepeat] = useState(true);
  const [isListeningActive, setIsListeningActive] = useState(false);
  const [isVoiceGuideOpen, setIsVoiceGuideOpen] = useState(false);

  const voiceActiveTimerRef = useRef<number | null>(null);
  const videoRef = useRef<VideoRefProps | null>(null);
  const timerErrorPopoverRef = useRef<popoverHandle | undefined>(undefined);
  const micButtonPopoverRef = useRef<micButtonPopoverHandle | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (voiceActiveTimerRef.current) {
        window.clearTimeout(voiceActiveTimerRef.current);
      }
    };
  }, []);

  const { steps, currentIndex, currentDetailIndex, chageStepByTime, changeStepByIndex } =
    useRecipeStepController({ recipeId: id });

  const hasTrackedStartRef = useRef(false);
  const prevStepRef = useRef<number | null>(null);
  const prevDetailRef = useRef<number | null>(null);

  useEffect(() => {
    if (hasTrackedStartRef.current) return;
    if (steps.length === 0) return;

    const totalDetails = steps.reduce(
      (sum, step) => sum + step.details.length,
      0
    );

    hasTrackedStartRef.current = true;
    analytics.trackStart({
      recipeId: id,
      totalSteps: steps.length,
      totalDetails,
    });

    return () => {
      analytics.trackEnd({
        recipeId: id,
        totalSteps: steps.length,
        totalDetails,
      });
    };
  }, [id, steps, analytics]);

  useEffect(() => {
    const stepChanged = prevStepRef.current !== currentIndex;
    const detailChanged = prevDetailRef.current !== currentDetailIndex;

    if (stepChanged || detailChanged) {
      if (stepChanged) {
        analytics.recordStepVisit(currentIndex);
      }
      analytics.recordDetailVisit(currentIndex, currentDetailIndex);

      prevStepRef.current = currentIndex;
      prevDetailRef.current = currentDetailIndex;
    }
  }, [currentIndex, currentDetailIndex, analytics]);

  const {
    steps: tutorialStep,
    currentStepIndex: currentTutorialStep,
    isInTutorial,
  } = useTutorial();
  const { handleNextStep: handleTutorialNextStep } = useTutorialActions();

  const handleChangeStepWithVideoTime = useCallback(
    ({
      stepIndex,
      stepDetailIndex,
    }: {
      stepIndex: number;
      stepDetailIndex: number;
    }) => {
      if (stepIndex < 0 || stepIndex >= steps.length) {
        return;
      }
      if (
        stepDetailIndex < 0 ||
        stepDetailIndex >= steps[stepIndex].details.length
      ) {
        return;
      }
      // 중요: 수동 내비게이션을 먼저 설정하여 seek 후 시간 기반 업데이트가
      // 잘못된 위치로 점프하는 것을 방지 (프로그래스바 깜빡임 버그 수정)
      changeStepByIndex({ stepIndex, stepDetailIndex });
      videoRef.current?.seekTo({
        time: steps[stepIndex].details[stepDetailIndex].start,
      });
    },
    [steps, changeStepByIndex]
  );

  const { handleTimerIntent } = useHandleTimerVoiceIntent({
    recipeId: id,
    recipeName: recipe.videoInfo.videoTitle,
  });

  const handleMicButtonPopover = useCallback((message: string) => {
    micButtonPopoverRef.current?.showMessage(message);
  }, []);

  useSimpleSpeech({
    recipeId: router.query.id as string,
    onVoiceStart: () => {
      if (voiceActiveTimerRef.current) {
        window.clearTimeout(voiceActiveTimerRef.current);
        voiceActiveTimerRef.current = null;
      }
      setIsListeningActive(true);
    },
    onVoiceEnd: () => {
      voiceActiveTimerRef.current = window.setTimeout(() => {
        setIsListeningActive(false);
        voiceActiveTimerRef.current = null;
      }, 1000);
    },
    onIntent: (intent: unknown) => {
      const intentObj = intent as { base_intent?: string } | string;
      const rawIntent = typeof intentObj === "string" 
        ? intentObj 
        : intentObj?.base_intent;
      const parsedIntent = parseIntent(rawIntent);

      if (parsedIntent === "NEXT") {
        if (isInTutorial && currentTutorialStep !== 2) {
          return;
        }
        analytics.trackCommand({
          recipeId: id,
          commandType: "navigation",
          commandDetail: "NEXT",
          triggerMethod: "voice",
          currentStep: currentIndex,
          currentDetail: currentDetailIndex,
        });
        handleChangeStepWithVideoTime({
          stepIndex: currentIndex + 1,
          stepDetailIndex: 0,
        });
        if (isInTutorial && currentTutorialStep === 2) {
          handleTutorialNextStep({ index: 2 });
        }
        return;
      }
      if (parsedIntent === "VIDEO PLAY") {
        if (isInTutorial && currentTutorialStep !== 0) {
          return;
        }
        analytics.trackCommand({
          recipeId: id,
          commandType: "video_control",
          commandDetail: "VIDEO_PLAY",
          triggerMethod: "voice",
          currentStep: currentIndex,
          currentDetail: currentDetailIndex,
        });
        videoRef.current?.play();
        if (isInTutorial && currentTutorialStep === 0) {
          handleTutorialNextStep({ index: 0 });
        }
        return;
      }
      if (parsedIntent === "VIDEO STOP") {
        if (isInTutorial && currentTutorialStep !== 1) {
          return;
        }
        analytics.trackCommand({
          recipeId: id,
          commandType: "video_control",
          commandDetail: "VIDEO_STOP",
          triggerMethod: "voice",
          currentStep: currentIndex,
          currentDetail: currentDetailIndex,
        });
        videoRef.current?.pause();
        if (isInTutorial && currentTutorialStep === 1) {
          handleTutorialNextStep({ index: 1 });
        }
        return;
      }
      if (parsedIntent === "PREV") {
        analytics.trackCommand({
          recipeId: id,
          commandType: "navigation",
          commandDetail: "PREV",
          triggerMethod: "voice",
          currentStep: currentIndex,
          currentDetail: currentDetailIndex,
        });
        handleChangeStepWithVideoTime({
          stepIndex: currentIndex - 1,
          stepDetailIndex: 0,
        });
        return;
      }
      if (parsedIntent.startsWith("TIMESTAMP")) {
        const sec = Number(parsedIntent.split(/\s+/)[1] ?? "0");
        analytics.trackCommand({
          recipeId: id,
          commandType: "video_control",
          commandDetail: "TIMESTAMP",
          triggerMethod: "voice",
          currentStep: currentIndex,
          currentDetail: currentDetailIndex,
        });
        videoRef.current?.seekTo({ time: Math.max(0, sec) });
        return;
      }
      if (parsedIntent.startsWith("STEP")) {
        const stepNum = Number(parsedIntent.split(/\s+/)[1] ?? "1");
        analytics.trackCommand({
          recipeId: id,
          commandType: "navigation",
          commandDetail: "STEP",
          triggerMethod: "voice",
          currentStep: currentIndex,
          currentDetail: currentDetailIndex,
        });
        handleChangeStepWithVideoTime({
          stepIndex: stepNum,
          stepDetailIndex: 0,
        });
        return;
      }
      if (parsedIntent.startsWith("TIMER")) {
        if (isInTutorial && currentTutorialStep !== 3) {
          return;
        }
        const timerAction = parsedIntent.split(/\s+/)[1] ?? "SET";
        analytics.trackCommand({
          recipeId: id,
          commandType: "timer",
          commandDetail: `TIMER_${timerAction}`,
          triggerMethod: "voice",
          currentStep: currentIndex,
          currentDetail: currentDetailIndex,
        });
        handleTimerIntent(parsedIntent, (error: string) => {
          timerErrorPopoverRef.current?.showErrorMessage(error);
        });
        if (isInTutorial && currentTutorialStep === 3) {
          handleTutorialNextStep({ index: 3 });
        }
        return;
      }
      if (parsedIntent.startsWith("INGREDIENT")) {
        const ingredient = parsedIntent.split(/\s+/);
        if (ingredient.length <= 1) {
          return;
        }
        analytics.trackCommand({
          recipeId: id,
          commandType: "info",
          commandDetail: "INGREDIENT",
          triggerMethod: "voice",
          currentStep: currentIndex,
          currentDetail: currentDetailIndex,
        });
        const [, ingredientName, ingredientAmount, _ingredientUnit] = ingredient;
        if (ingredientAmount === "0") {
          handleMicButtonPopover(`영상을 참조해주세요.`);
        }
        const ingredientUnit = (() => {
          const trimmed = _ingredientUnit.trim();
          if (/^[A-Za-z]+$/.test(trimmed)) {
            return trimmed.toLowerCase();
          }
          return _ingredientUnit;
        })();
        handleMicButtonPopover(
          `${ingredientName} ${ingredientAmount} ${ingredientUnit} 필요해요.`
        );
        return;
      }
    },
  });

  const handleRepeatInGroup = useCallback(
    (time: number) => {
      const start = steps[currentIndex].details[0].start;
      const end =
        currentIndex + 1 < steps.length
          ? steps[currentIndex + 1].details[0].start
          : videoRef.current?.getDuration();
      if (!end) {
        throw new Error();
      }
      if (start > time || end < time) {
        if (end + 0.3 < time || start - 0.3 > time) {
          chageStepByTime(time);
          return;
        }
        videoRef.current?.seekTo({ time: start });
        chageStepByTime(start);
        return;
      }
      chageStepByTime(time);
    },
    [steps, currentIndex, chageStepByTime]
  );

  const handleTrackTouchNavigation = useCallback(() => {
    analytics.trackCommand({
      recipeId: id,
      commandType: "navigation",
      commandDetail: "STEP",
      triggerMethod: "touch",
      currentStep: currentIndex,
      currentDetail: currentDetailIndex,
    });
  }, [analytics, id, currentIndex, currentDetailIndex]);

  const handleLoopToggle = useCallback(() => {
    setIsInRepeat((v) => !v);
    analytics.recordLoopToggle();
  }, [analytics]);

  const handleMicButtonClick = useCallback(() => {
    setIsVoiceGuideOpen(true);
    analytics.recordMicButtonTouch();
  }, [analytics]);

  const handleMicButtonClickWithTutorial = useCallback(() => {
    setIsVoiceGuideOpen(true);
    handleTutorialNextStep({ index: 4 });
    analytics.recordMicButtonTouch();
  }, [analytics, handleTutorialNextStep]);

  const handleVoiceGuideClose = useCallback(() => {
    setIsVoiceGuideOpen(false);
  }, []);

  return {
    router,
    orientation,
    recipe,
    analytics,

    isInRepeat,
    isListeningActive,
    isVoiceGuideOpen,

    videoRef,
    timerErrorPopoverRef,
    micButtonPopoverRef,

    steps,
    currentIndex,
    currentDetailIndex,
    chageStepByTime,

    tutorialStep,
    currentTutorialStep,
    isInTutorial,
    handleTutorialNextStep,

    handleChangeStepWithVideoTime,
    handleRepeatInGroup,
    handleTrackTouchNavigation,
    handleLoopToggle,
    handleMicButtonClick,
    handleMicButtonClickWithTutorial,
    handleVoiceGuideClose,
  };
}

export type RecipeStepControllerReturn = ReturnType<typeof useRecipeStepPageController>;
