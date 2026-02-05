import { useOnboardingTranslation } from "../../hooks/useOnboardingTranslation";
import { StepContainer } from "../components/StepContainer";
import { OnboardingMicButton } from "../components/OnboardingMicButton";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "motion/react";
import { useOnboardingStore } from "../../stores/useOnboardingStore";
import { usePreventBack } from "../../hooks/usePreventBack";
import Image from "next/image";

// 애니메이션 variants
const fadeInOutVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const scaleInVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
};

const zoomOutVariants = {
  hidden: { opacity: 0, scale: 1.1 },
  visible: { opacity: 1, scale: 1 },
};

const buttonFloatVariants = {
  hidden: { scale: 0, y: 50 },
  visible: { scale: 1, y: 0 },
};

// 음성 인식 상태
type VoiceStatus = 'idle' | 'listening' | 'recognized' | 'failed';

export function OnboardingStep2() {
  const { t } = useOnboardingTranslation();
  const { nextStep, currentStep, completeOnboarding } = useOnboardingStore();
  const router = useRouter();

  // Prevent back button
  usePreventBack();

  // State: 'result' (Recipe Detail) -> 'voice_mode' (Cooking Mode)
  const [viewState, setViewState] = useState<'result' | 'voice_mode'>('result');
  const [isMicAnimating, setIsMicAnimating] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>('idle');

  const handleStartCookingClick = () => {
    // Transition to Voice Mode
    setViewState('voice_mode');
    setVoiceStatus('idle');
  };

  const moveToNextStep = useCallback(() => {
    track(AMPLITUDE_EVENT.ONBOARDING_STEP_COMPLETE, {
      step: currentStep,
      step_count: 3,
      voice_method: 'voice'
    });
    nextStep();
  }, [currentStep, nextStep]);

  const handleMicClick = () => {
    setIsMicAnimating(true);
    setVoiceStatus('recognized');

    // Simulate recognition and move to next step
    setTimeout(() => {
      moveToNextStep();
    }, 600);
  };

  // Fallback: 클릭으로도 다음 단계 진행 가능
  const handleManualNext = useCallback(() => {
    setIsMicAnimating(true);
    setVoiceStatus('recognized');

    track(AMPLITUDE_EVENT.ONBOARDING_STEP_COMPLETE, {
      step: currentStep,
      step_count: 3,
      voice_method: 'manual_click'
    });

    setTimeout(() => {
      nextStep();
    }, 600);
  }, [currentStep, nextStep]);

  // 음성 인식 실패 시 처리 (OnboardingMicButton에서 에러 발생 시 호출)
  const handleVoiceError = useCallback(() => {
    setVoiceStatus('failed');
  }, []);

  const handleSkip = () => {
    track(AMPLITUDE_EVENT.ONBOARDING_SKIP);
    completeOnboarding();
    router.replace('/');
  };

  const getVoiceStatusText = () => {
    switch (voiceStatus) {
      case 'listening': return '듣고 있습니다...';
      case 'recognized': return '"다음"을 인식했습니다! ✅';
      case 'failed': return '클릭해서 진행하기';
      default: return '';
    }
  };

  return (
    <StepContainer
      currentStep={currentStep}
      onNext={() => {}}
      onPrev={() => {}}
      onSkip={handleSkip}
    >
      <div className="text-center w-full max-w-md mx-auto min-h-[600px] flex flex-col items-center">

        {/* Dynamic Title */}
        <div className="mb-6 h-20">
          <AnimatePresence mode="wait">
            {viewState === 'result' ? (
              <motion.div
                key="title-result"
                variants={fadeInOutVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('step2.result.title')}</h1>
                <p className="text-gray-600">{t('step2.result.subtitle')}</p>
              </motion.div>
            ) : (
              <motion.div
                key="title-voice"
                variants={fadeInOutVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('step2.title')}</h1>
                <p className="text-gray-600">{t('step2.subtitle')}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Device Mockup */}
        <div className="relative w-72 h-[500px] rounded-[2.5rem] shadow-2xl border-4 border-gray-100 overflow-hidden bg-white">
          <AnimatePresence mode="wait">

            {/* View 1: Recipe Detail (The Result) */}
            {viewState === 'result' && (
              <motion.div
                key="view-result"
                variants={zoomOutVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex flex-col"
              >
                <Image
                  src="/images/onboarding/app-recipe-detail.png"
                  alt="Recipe Detail"
                  fill
                  className="object-cover"
                  priority
                />

                {/* Floating Action Button to Trigger Voice Mode */}
                <div className="absolute bottom-8 inset-x-0 flex justify-center">
                  <motion.button
                    variants={buttonFloatVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.5, type: "spring" }}
                    onClick={handleStartCookingClick}
                    className="bg-orange-600 text-white font-bold py-3 px-8 rounded-full shadow-lg flex items-center gap-2 hover:bg-orange-700 active:scale-95"
                  >
                    <span>{t('step2.result.button')}</span>
                    <span>🍳</span>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* View 2: Cooking Mode (The Utility) */}
            {viewState === 'voice_mode' && (
              <motion.div
                key="view-voice"
                variants={zoomOutVariants}
                initial="hidden"
                animate="visible"
                className="absolute inset-0"
              >
                <Image
                  src="/images/onboarding/app-cooking.png"
                  alt="Cooking Mode"
                  fill
                  className="object-cover"
                />

                {/* Spotlight Overlay */}
                <div className="absolute inset-0 bg-black/60 transition-opacity duration-1000" />

                {/* Mic Interaction Area */}
                <div className="absolute bottom-8 right-6 z-20 flex flex-col items-center">

                  {/* Voice Status Feedback */}
                  <AnimatePresence>
                    {voiceStatus !== 'idle' && (
                      <motion.div
                        key="voice-status"
                        variants={fadeInOutVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute bottom-full mb-4 right-0 bg-white/95 backdrop-blur px-4 py-2 rounded-lg shadow-lg whitespace-nowrap"
                      >
                        <p className={`font-bold text-sm ${
                          voiceStatus === 'failed' ? 'text-orange-600' : 'text-green-600'
                        }`}>
                          {getVoiceStatusText()}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Tooltip */}
                  <motion.div
                    variants={fadeInOutVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.3 }}
                    className="absolute bottom-full mb-3 right-0 bg-white text-orange-600 px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap"
                  >
                    <p className="font-bold text-xs">{t('step2.voice.tooltip')}</p>
                    <div className="absolute -bottom-1 right-6 w-2 h-2 bg-white rotate-45" />
                  </motion.div>

                  {/* Mic Button & Ripple */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-orange-500/40 rounded-full animate-ping" />
                    <OnboardingMicButton
                      onNext={handleMicClick}
                      onError={handleVoiceError}
                    />

                    {/* Success Ripple */}
                    {isMicAnimating && (
                      <motion.div
                        initial={{ scale: 1, opacity: 0.8 }}
                        animate={{ scale: 3, opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0 bg-white rounded-full z-[-1]"
                      />
                    )}
                  </div>

                  {/* Fallback Button (음성 인식 실패 시 또는 수동 진행용) */}
                  <motion.button
                    variants={scaleInVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.5 }}
                    onClick={handleManualNext}
                    className="mt-4 text-xs text-white/80 hover:text-white underline decoration-dotted"
                  >
                    클릭해서 다음으로
                  </motion.button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </StepContainer>
  );
}
