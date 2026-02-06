import { useOnboardingTranslation } from "../../hooks/useOnboardingTranslation";
import { useHapticFeedback } from "../../hooks/useHapticFeedback";
import { StepContainer } from "../components/StepContainer";
import { OnboardingMicButton } from "../components/OnboardingMicButton";
import { HandsFreeModeTooltipCompact } from "../components/HandsFreeModeTooltip";
import { useOnboardingStore } from "../../stores/useOnboardingStore";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { slideXVariants, createSlideTransition } from "../shared/animations";
import { PREVIEW_BUTTON, TIMING } from "../shared/constants";

// Step 2 상태 타입
type Step2State = 'summary' | 'ingredients' | 'steps' | 'cooking';

// 음성 인식 상태
type VoiceStatus = 'idle' | 'listening' | 'recognized' | 'failed';

// 각 상태별 이미지 경로
const STEP_IMAGES: Record<Step2State, string> = {
  summary: '/images/onboarding/app-detail_1.png',
  ingredients: '/images/onboarding/app-detail_2.png',
  steps: '/images/onboarding/app-detail_3.png',
  cooking: '/images/onboarding/app-cooking_home.png',
};

// 각 상태별 이미지 alt 텍스트
const STEP_ALT: Record<Step2State, string> = {
  summary: '레시피 요약 화면',
  ingredients: '재료 목록 화면',
  steps: '조리 단계 화면',
  cooking: '쿠킹 모드 홈 화면',
};

// 상태 순서
const STEP_ORDER: Step2State[] = ['summary', 'ingredients', 'steps', 'cooking'];

export function OnboardingStep2() {
  const { t } = useOnboardingTranslation();
  const { nextStep, prevStep, currentStep, completeOnboarding, navigationDirection } = useOnboardingStore();
  const { triggerHaptic } = useHapticFeedback();

  const [step2State, setStep2State] = useState<Step2State>(
    navigationDirection === 'backward' ? 'cooking' : 'summary'
  );
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>('idle');
  const [prevStep2State, setPrevStep2State] = useState<Step2State | null>(null);
  const [isListening, setIsListening] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentIndex = STEP_ORDER.indexOf(step2State);
  const prevIndex = prevStep2State !== null ? STEP_ORDER.indexOf(prevStep2State) : 0;
  const direction = prevStep2State === null ? 0 : currentIndex > prevIndex ? 1 : currentIndex < prevIndex ? -1 : 0;

  // cleanup setTimeout on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // 접근성: reduced-motion 체크
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  const transitionConfig = createSlideTransition(shouldAnimate);

  // 건너뛰기: 온보딩 완료 (index.tsx의 useEffect가 '/'로 리다이렉트)
  const handleSkip = useCallback(() => {
    track(AMPLITUDE_EVENT.ONBOARDING_SKIP, {
      step: currentStep,
      step_count: 3,
    });
    completeOnboarding();
  }, [currentStep, completeOnboarding]);

  // 타이틀/서브타이틀 텍스트
  const title = useMemo((): string => {
    switch (step2State) {
      case 'summary': return t('step2.summary.title');
      case 'ingredients': return t('step2.ingredients.title');
      case 'steps': return t('step2.steps.title');
      case 'cooking': return t('step2.cooking.title');
    }
  }, [step2State, t]);

  const subtitle = useMemo((): string => {
    switch (step2State) {
      case 'summary': return t('step2.summary.guide');
      case 'ingredients': return t('step2.ingredients.guide');
      case 'steps': return t('step2.steps.guide');
      case 'cooking': return t('step2.cooking.guide');
    }
  }, [step2State, t]);

  // 다음 상태로 이동
  const moveToNextState = useCallback(() => {
    triggerHaptic();
    track(AMPLITUDE_EVENT.ONBOARDING_STEP_COMPLETE, {
      step: currentStep,
      step_count: 3,
      sub_step: step2State,
      voice_method: 'manual_click',
    });

    setPrevStep2State(step2State);
    if (currentIndex < STEP_ORDER.length - 1) {
      setStep2State(STEP_ORDER[currentIndex + 1]);
    } else {
      nextStep();
    }
  }, [currentIndex, step2State, currentStep, nextStep, triggerHaptic]);

  // 이전 상태로 이동
  const moveToPrevState = useCallback(() => {
    setPrevStep2State(step2State);
    if (currentIndex > 0) {
      setStep2State(STEP_ORDER[currentIndex - 1]);
    } else {
      prevStep();
    }
  }, [currentIndex, step2State, prevStep]);

  // 음성 인식 성공 시 다음 단계로 이동
  const handleVoiceNext = useCallback(() => {
    setVoiceStatus('recognized');
    track(AMPLITUDE_EVENT.ONBOARDING_STEP_COMPLETE, {
      step: currentStep,
      step_count: 3,
      sub_step: step2State,
      voice_method: 'voice',
    });

    timerRef.current = setTimeout(() => {
      nextStep();
    }, TIMING.VOICE_SUCCESS_DELAY_MS);
  }, [currentStep, nextStep, step2State]);

  // 음성 인식 실패 시 처리
  const handleVoiceError = useCallback(() => {
    setVoiceStatus('failed');
  }, []);

  const isCookingState = step2State === 'cooking';

  // 쿠킹 상태에서 하단 네비게이션 가운데에 표시할 마이크 UI
  const micBottomCenter = isCookingState ? (
    <div className="flex flex-col items-center gap-1">
      {/* 음성 상태 텍스트 */}
      <p className={cn(
        "text-xs font-medium",
        isListening ? "text-blue-600 animate-pulse" :
        voiceStatus === 'recognized' ? "text-green-600" :
        voiceStatus === 'failed' ? "text-orange-600" :
        "text-gray-500"
      )}>
        {isListening ? t('step2.cooking.listening') :
         voiceStatus === 'recognized' ? t('step2.cooking.recognized') :
         voiceStatus === 'failed' ? t('step2.cooking.failed') :
         t('step2.cooking.idle')}
      </p>

      {/* 마이크 버튼 */}
      <div className="relative">
        {isListening && shouldAnimate && (
          <div className="absolute inset-0 bg-orange-500/40 rounded-full animate-ping" />
        )}
        <OnboardingMicButton
          onNext={handleVoiceNext}
          onError={handleVoiceError}
          onListeningChange={setIsListening}
        />
      </div>

      {/* 음성 실패 시 터치 대안 */}
      {voiceStatus === 'failed' && (
        <button
          onClick={moveToNextState}
          className="text-[10px] text-gray-500 hover:text-orange-600 underline"
        >
          {t('step2.cooking.fallback')}
        </button>
      )}
    </div>
  ) : undefined;

  return (
    <StepContainer
      currentStep={currentStep}
      onNext={moveToNextState}
      onPrev={moveToPrevState}
      onSkip={handleSkip}
      innerStateIndex={currentIndex}
      hideNextButton={isCookingState}
      bottomCenter={micBottomCenter}
    >
      <div className="w-full flex flex-col items-center justify-center gap-2">
        {/* Section Label */}
        <span className="text-[11px] font-semibold text-orange-500 tracking-wide">
          STEP 2 · {t('step2.sectionLabel')}
        </span>

        {/* Title */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`title-${step2State}`}
            variants={slideXVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            custom={{ direction, shouldAnimate }}
            transition={transitionConfig}
            className="flex items-center justify-center gap-1.5"
          >
            <h1 className="text-lg lg:text-xl font-bold text-gray-900 text-center px-4">
              {title}
            </h1>
            {isCookingState && <HandsFreeModeTooltipCompact />}
          </motion.div>
        </AnimatePresence>

        {/* Subtitle */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={`subtitle-${step2State}`}
            variants={slideXVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            custom={{ direction, shouldAnimate }}
            transition={transitionConfig}
            className="text-sm text-gray-600 text-center px-4"
          >
            {subtitle}
          </motion.p>
        </AnimatePresence>

        {/* Image Area - always tappable for navigation */}
        <motion.button
          onClick={moveToNextState}
          whileHover={shouldAnimate ? { scale: 1.02 } : undefined}
          whileTap={shouldAnimate ? { scale: 0.96 } : undefined}
          className="relative cursor-pointer rounded-2xl transition-transform focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          style={{ width: PREVIEW_BUTTON.WIDTH, height: isCookingState ? PREVIEW_BUTTON.HEIGHT_COOKING : PREVIEW_BUTTON.HEIGHT_NORMAL }}
          aria-label={`${STEP_ALT[step2State]}. ${isCookingState ? '터치하거나 음성으로 다음 이동.' : '터치하여 다음으로 이동.'}`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step2State}
              variants={slideXVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              custom={{ direction, shouldAnimate }}
              transition={transitionConfig}
              className="relative w-full h-full rounded-2xl overflow-hidden"
              style={{ willChange: shouldAnimate ? 'transform, opacity' : 'auto' }}
            >
              <Image
                src={STEP_IMAGES[step2State]}
                alt={STEP_ALT[step2State]}
                fill
                className="object-contain"
              />
            </motion.div>
          </AnimatePresence>
        </motion.button>

        {/* 터치 안내 - cooking 상태가 아닐 때만 */}
        {!isCookingState && (
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <span>화면을 터치하여 다음</span>
            <span aria-hidden="true">→</span>
          </p>
        )}
      </div>
    </StepContainer>
  );
}
