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
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

// 각 상태별 이미지 경로
const STEP_IMAGES: Record<Step2State, string> = {
  summary: '/images/onboarding/app-detail_1.png',
  ingredients: '/images/onboarding/app-detail_2.png',
  steps: '/images/onboarding/app-detail_3.png',
  cooking: '/images/onboarding/app-cooking_home.png',
};

export function OnboardingStep2() {
  const { t } = useOnboardingTranslation();
  const { nextStep, currentStep } = useOnboardingStore();

  const [step2State, setStep2State] = useState<Step2State>('summary');
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>('idle');

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

    switch (step2State) {
      case 'summary':
        setStep2State('ingredients');
        break;
      case 'ingredients':
        setStep2State('steps');
        break;
      case 'steps':
        setStep2State('cooking');
        break;
      case 'cooking':
        // cooking 상태에서는 음성 인식 또는 수동 클릭 모두 동작
        nextStep();
        break;
    }
  }, [step2State, currentStep, nextStep]);

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
  }, [step2State, currentStep, nextStep]);

  // 음성 인식 실패 시 처리
  const handleVoiceError = useCallback(() => {
    setVoiceStatus('failed');
  }, []);

  // 음성 인식 시작
  const handleVoiceStart = useCallback(() => {
    setVoiceStatus('listening');
  }, []);

  // 음성 인식 종료
  const handleVoiceEnd = useCallback(() => {
    if (voiceStatus === 'listening') {
      setVoiceStatus('idle');
    }
  }, [voiceStatus]);

  // cooking 상태인지 확인
  const isCookingState = step2State === 'cooking';

  return (
    <StepContainer
      currentStep={currentStep}
      onNext={moveToNextState}
      onPrev={() => {}}
      onSkip={nextStep}
    >
      <div className="w-full max-w-md mx-auto relative min-h-[600px] flex flex-col items-center">

        {/* Title & Guide Text */}
        <div className="text-center mb-6 z-10">
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

        {/* Device Mockup Area */}
        <div className="relative w-72 h-[500px] bg-black rounded-[2.5rem] shadow-2xl border-4 border-gray-100 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.button
              key={step2State}
              variants={scaleInVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              onClick={!isCookingState ? moveToNextState : undefined}
              className="absolute inset-0 cursor-pointer active:scale-[0.98] transition-transform"
              aria-label="다음 단계로 이동"
            >
              <Image
                src={STEP_IMAGES[step2State]}
                alt={`Step ${step2State}`}
                fill
                className="object-cover"
                priority={step2State === 'summary'}
              />
            </motion.button>
          </AnimatePresence>

          {/* Cooking 상태: 음성 인식 UI */}
          {isCookingState && (
            <>
              {/* 음성 상태 피드백 */}
              {voiceStatus !== 'idle' && (
                <AnimatePresence>
                  <motion.div
                    key={`voice-status-${voiceStatus}`}
                    variants={fadeInVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20"
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
              <div className="absolute bottom-8 right-6 z-20 flex flex-col items-center">
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
                    className="mt-4 text-xs text-white/80 hover:text-white underline decoration-dotted"
                  >
                    {t('step2.cooking.fallback')}
                  </motion.button>
                )}
              </div>
            </>
          )}
        </div>

      </div>
    </StepContainer>
  );
}
