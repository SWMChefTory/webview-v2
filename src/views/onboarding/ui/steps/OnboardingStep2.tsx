import { useOnboardingTranslation } from "../../hooks/useOnboardingTranslation";
import { StepContainer } from "../components/StepContainer";
import { OnboardingMicButton } from "../components/OnboardingMicButton";
import { useOnboardingStore } from "../../stores/useOnboardingStore";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Image from "next/image";

// Step 2 상태 타입
type Step2State = 'summary' | 'ingredients' | 'steps' | 'cooking';

// 음성 인식 상태
type VoiceStatus = 'idle' | 'listening' | 'recognized' | 'failed';

// 애니메이션 variants
const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
};

// 슬라이드 애니메이션 variants (방향성 있음)
interface SlideCustom {
  direction: number;
  shouldAnimate: boolean;
}

const slideXVariants = {
  hidden: (custom: SlideCustom) => ({
    opacity: custom.shouldAnimate ? 0 : 1,
    x: custom.shouldAnimate ? (custom.direction > 0 ? 50 : -50) : 0,
  }),
  visible: { opacity: 1, x: 0 },
  exit: (custom: SlideCustom) => ({
    opacity: custom.shouldAnimate ? 0 : 1,
    x: custom.shouldAnimate ? (custom.direction > 0 ? -50 : 50) : 0,
  }),
};

// 각 상태별 이미지 경로
const STEP_IMAGES: Record<Step2State, string> = {
  summary: '/images/onboarding/app-detail_1.png',
  ingredients: '/images/onboarding/app-detail_2.png',
  steps: '/images/onboarding/app-detail_3.png',
  cooking: '/images/onboarding/app-cooking_home.png',
};

// 상태 순서
const STEP_ORDER: Step2State[] = ['summary', 'ingredients', 'steps', 'cooking'];

export function OnboardingStep2() {
  const { t } = useOnboardingTranslation();
  const { nextStep, prevStep, currentStep } = useOnboardingStore();

  const [step2State, setStep2State] = useState<Step2State>('summary');
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>('idle');
  const [prevStep2State, setPrevStep2State] = useState<Step2State | null>(null);

  const currentIndex = STEP_ORDER.indexOf(step2State);
  const prevIndex = prevStep2State !== null ? STEP_ORDER.indexOf(prevStep2State) : 0;
  // 방향: 1 = forward, -1 = backward, 0 = initial
  const direction = prevStep2State === null ? 0 : currentIndex > prevIndex ? 1 : currentIndex < prevIndex ? -1 : 0;

  // 접근성: reduced-motion 체크
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  // 애니메이션 설정 (reduced-motion 고려)
  const transitionConfig = {
    duration: shouldAnimate ? 0.25 : 0,
    ease: shouldAnimate ? [0.25, 0.1, 0.25, 1] as const : undefined,
  };

  // 햅틱 피드백
  const triggerHaptic = useCallback(() => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
  }, []);

  // 타이틀 텍스트 - 간소화
  const getTitle = useCallback((): string => {
    switch (step2State) {
      case 'summary':
        return t('step2.summary.title');
      case 'ingredients':
        return t('step2.ingredients.title');
      case 'steps':
        return t('step2.steps.title');
      case 'cooking':
        return t('step2.cooking.title');
    }
  }, [step2State, t]);

  // 서브타이틀 텍스트
  const getSubtitle = useCallback((): string => {
    switch (step2State) {
      case 'summary':
        return t('step2.summary.guide');
      case 'ingredients':
        return t('step2.ingredients.guide');
      case 'steps':
        return t('step2.steps.guide');
      case 'cooking':
        return t('step2.cooking.guide');
    }
  }, [step2State, t]);

  // 음성 인식 상태 텍스트
  const getVoiceStatusText = useCallback((): string => {
    switch (voiceStatus) {
      case 'listening':
        return t('step2.cooking.listening');
      case 'recognized':
        return t('step2.cooking.recognized');
      case 'failed':
        return t('step2.cooking.failed');
      default:
        return '';
    }
  }, [t]);

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

    setTimeout(() => {
      nextStep();
    }, 600);
  }, [currentStep, nextStep]);

  // 음성 인식 실패 시 처리
  const handleVoiceError = useCallback(() => {
    setVoiceStatus('failed');
  }, []);

  const isCookingState = step2State === 'cooking';

  return (
    <StepContainer
      currentStep={currentStep}
      onNext={moveToNextState}
      onPrev={moveToPrevState}
      onSkip={nextStep}
    >
      <div className="w-full flex flex-col items-center justify-center gap-2">
        {/* Title */}
        <AnimatePresence mode="sync" initial={false}>
          <motion.h1
            key={`title-${step2State}`}
            variants={slideXVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            custom={{ direction, shouldAnimate }}
            transition={transitionConfig}
            className="text-lg lg:text-xl font-bold text-gray-900 text-center px-4"
          >
            {getTitle()}
          </motion.h1>
        </AnimatePresence>

        {/* Subtitle */}
        <AnimatePresence mode="sync" initial={false}>
          <motion.p
            key={`subtitle-${step2State}`}
            variants={slideXVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            custom={{ direction, shouldAnimate }}
            transition={transitionConfig}
            className="text-sm text-gray-500 text-center px-4"
          >
            {getSubtitle()}
          </motion.p>
        </AnimatePresence>

        {/* Image Area */}
        <motion.button
          onClick={!isCookingState ? moveToNextState : undefined}
          whileHover={!isCookingState && shouldAnimate ? { scale: 1.02 } : undefined}
          whileTap={!isCookingState && shouldAnimate ? { scale: 0.96 } : undefined}
          className={`relative w-[280px] h-[580px] cursor-pointer rounded-2xl transition-transform focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 ${
            !isCookingState && currentIndex < STEP_ORDER.length - 1 ? 'ring-1 ring-orange-500/30' : ''
          }`}
          aria-label={`온보딩 ${currentIndex + 1}단계: ${getTitle()}. ${!isCookingState ? '터치하여 다음으로 이동.' : '음성으로 다음으로 이동.'}`}
          aria-current={currentIndex === STEP_ORDER.length - 1 ? 'step' : undefined}
        >
          <AnimatePresence mode="sync" initial={false}>
            <motion.div
              key={step2State}
              variants={slideXVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              custom={{ direction, shouldAnimate }}
              transition={{ ...transitionConfig, duration: shouldAnimate ? 0.3 : 0 }}
              className="relative w-full h-full rounded-2xl overflow-hidden"
              style={{ willChange: shouldAnimate ? 'transform, opacity' : 'auto' }}
            >
              <Image
                src={STEP_IMAGES[step2State]}
                alt={`Step ${step2State}`}
                fill
                className="object-contain"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </motion.button>

        {/* 현재 단계 표시 - 번호 있는 인디케이터 */}
        <div className="flex gap-2" role="progressbar" aria-label="온보딩 진행률" aria-valuemin={1} aria-valuemax={STEP_ORDER.length} aria-valuenow={currentIndex + 1}>
          {STEP_ORDER.map((_, idx) => (
            <div
              key={idx}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                idx === currentIndex
                  ? 'bg-orange-500 text-white'
                  : idx < currentIndex
                    ? 'bg-orange-200 text-orange-700'
                    : 'bg-gray-200 text-gray-400'
              }`}
              aria-label={`${idx + 1}단계 ${idx === currentIndex ? '현재' : idx < currentIndex ? '완료' : '미진행'}`}
              aria-current={idx === currentIndex ? 'true' : undefined}
            >
              {idx + 1}
            </div>
          ))}
        </div>

        {/* Cooking 상태: 음성 인식 UI - 간소화 */}
        {isCookingState && (
          <div className="flex flex-col items-center gap-2">
            {/* 음성 상태 피드백 */}
            {voiceStatus !== 'idle' && (
              <AnimatePresence>
                <motion.div
                  key={`voice-status-${voiceStatus}`}
                  variants={fadeInVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="text-xs font-medium"
                >
                  <span
                    className={
                      voiceStatus === 'failed'
                        ? 'text-orange-600'
                        : voiceStatus === 'recognized'
                          ? 'text-green-600'
                          : 'text-blue-600'
                    }
                  >
                    {getVoiceStatusText()}
                  </span>
                </motion.div>
              </AnimatePresence>
            )}

            {/* Mic Button - 소형 */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <div className="absolute inset-0 bg-orange-500/40 rounded-full animate-ping" />
                <OnboardingMicButton
                  onNext={handleVoiceNext}
                  onError={handleVoiceError}
                />
              </div>

              {/* Fallback */}
              {voiceStatus === 'failed' && (
                <motion.button
                  variants={fadeInVariants}
                  initial="hidden"
                  animate="visible"
                  onClick={moveToNextState}
                  className="text-xs text-gray-500 hover:text-orange-600 underline"
                >
                  터치해서 다음으로
                </motion.button>
              )}
            </div>
          </div>
        )}
      </div>
    </StepContainer>
  );
}
