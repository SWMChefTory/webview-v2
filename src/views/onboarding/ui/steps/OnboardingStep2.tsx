import { useOnboardingTranslation } from "../../hooks/useOnboardingTranslation";
import { StepContainer } from "../components/StepContainer";
import { OnboardingMicButton } from "../components/OnboardingMicButton";
import { useOnboardingStore } from "../../stores/useOnboardingStore";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
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

  const currentIndex = STEP_ORDER.indexOf(step2State);

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
    track(AMPLITUDE_EVENT.ONBOARDING_STEP_COMPLETE, {
      step: currentStep,
      step_count: 3,
      sub_step: step2State,
      voice_method: 'manual_click',
    });

    if (currentIndex < STEP_ORDER.length - 1) {
      setStep2State(STEP_ORDER[currentIndex + 1]);
    } else {
      nextStep();
    }
  }, [currentIndex, currentStep, nextStep]);

  // 이전 상태로 이동
  const moveToPrevState = useCallback(() => {
    if (currentIndex > 0) {
      setStep2State(STEP_ORDER[currentIndex - 1]);
    } else {
      prevStep();
    }
  }, [currentIndex, prevStep]);

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
        {/* Title - 간소화 */}
        <AnimatePresence mode="wait">
          <motion.h1
            key={`title-${step2State}`}
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.15 }}
            className="text-lg lg:text-xl font-bold text-gray-900 text-center px-4"
          >
            {getTitle()}
          </motion.h1>
        </AnimatePresence>

        {/* Image Area - 크기 축소 */}
        <motion.button
          onClick={!isCookingState ? moveToNextState : undefined}
          className="relative w-[200px] cursor-pointer active:scale-[0.98] transition-transform"
          aria-label="다음 단계로 이동"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={step2State}
              variants={scaleInVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.15 }}
              className="relative w-full"
              style={{ aspectRatio: '9/19.5' }}
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

        {/* 현재 단계 표시 - 동그라미 */}
        <div className="flex gap-1.5">
          {STEP_ORDER.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'bg-orange-500 w-4' : 'bg-gray-200 w-1.5'
              }`}
            />
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
