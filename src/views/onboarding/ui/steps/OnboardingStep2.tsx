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

// 상태 순서 (이전/다음 네비게이션용)
const STEP_ORDER: Step2State[] = ['summary', 'ingredients', 'steps', 'cooking'];

export function OnboardingStep2() {
  const { t } = useOnboardingTranslation();
  const { nextStep, prevStep, currentStep } = useOnboardingStore();

  const [step2State, setStep2State] = useState<Step2State>('summary');
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>('idle');

  // 현재 상태 인덱스
  const currentIndex = STEP_ORDER.indexOf(step2State);

  // 타이틀 텍스트
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

  // 가이드 텍스트
  const getGuide = useCallback((): string => {
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

  // 다음 상태로 이동 (터치/클릭 시)
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
      // 마지막 상태에서는 Step 3로 이동
      nextStep();
    }
  }, [currentIndex, step2State, currentStep, nextStep]);

  // 이전 상태로 이동
  const moveToPrevState = useCallback(() => {
    if (currentIndex > 0) {
      setStep2State(STEP_ORDER[currentIndex - 1]);
    } else {
      // 첫 상태에서는 Step 이동
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
    }, 800);
  }, [currentStep, nextStep]);

  // 음성 인식 실패 시 처리
  const handleVoiceError = useCallback(() => {
    setVoiceStatus('failed');
  }, []);

  // cooking 상태인지 확인
  const isCookingState = step2State === 'cooking';

  return (
    <StepContainer
      currentStep={currentStep}
      onNext={moveToNextState}
      onPrev={moveToPrevState}
      onSkip={nextStep}
    >
      <div className="w-full max-w-md mx-auto flex flex-col items-center">

        {/* Title & Guide Text + 현재 단계 표시 */}
        <div className="text-center mb-6 z-10">
          <div className="text-xs text-gray-400 mb-2">
            {currentIndex + 1} / {STEP_ORDER.length}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={`title-${step2State}`}
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2 }}
            >
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                {getTitle()}
              </h1>
              <p className="text-gray-600 text-sm lg:text-base">
                {getGuide()}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Image Area - 목업 프레임 제거 */}
        <motion.button
          onClick={!isCookingState ? moveToNextState : undefined}
          className="relative w-full max-w-sm mx-auto cursor-pointer active:scale-[0.98] transition-transform"
          aria-label="다음 단계로 이동"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={step2State}
              variants={scaleInVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="relative w-full"
              style={{ aspectRatio: '9/19.5' }} // iPhone 비율
            >
              <Image
                src={STEP_IMAGES[step2State]}
                alt={`Step ${step2State}`}
                fill
                className="object-contain"
                priority // 모든 이미지 프리로딩
              />
            </motion.div>
          </AnimatePresence>
        </motion.button>

        {/* 터치 가이드 */}
        {!isCookingState && (
          <p className="text-xs text-gray-400 mt-4">
            화면을 터치하거나 아래 버튼을 눌러주세요
          </p>
        )}

        {/* Cooking 상태: 음성 인식 UI - 이미지 아래 가운데 */}
        {isCookingState && (
          <div className="mt-8 flex flex-col items-center">
            {/* 음성 상태 피드백 */}
            {voiceStatus !== 'idle' && (
              <AnimatePresence>
                <motion.div
                  key={`voice-status-${voiceStatus}`}
                  variants={fadeInVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="mb-4"
                >
                  <div
                    className={`px-4 py-2 rounded-lg shadow-lg whitespace-nowrap ${
                      voiceStatus === 'failed'
                        ? 'bg-orange-100 text-orange-600'
                        : voiceStatus === 'recognized'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-blue-100 text-blue-600'
                    }`}
                  >
                    <p className="font-bold text-sm">{getVoiceStatusText()}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

            {/* Mic Button */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                {/* Pulse animation */}
                <div className="absolute inset-0 bg-orange-500/40 rounded-full animate-ping" />

                {/* Actual Mic Button with Speech Recognition */}
                <OnboardingMicButton
                  onNext={handleVoiceNext}
                  onError={handleVoiceError}
                />
              </div>

              {/* Fallback Button */}
              {voiceStatus === 'failed' && (
                <motion.button
                  variants={fadeInVariants}
                  initial="hidden"
                  animate="visible"
                  onClick={moveToNextState}
                  className="text-xs text-gray-500 hover:text-orange-600 underline decoration-dotted"
                >
                  {t('step2.cooking.fallback')}
                </motion.button>
              )}
            </div>
          </div>
        )}

      </div>
    </StepContainer>
  );
}
