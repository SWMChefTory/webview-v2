import { useOnboardingTranslation } from "../../hooks/useOnboardingTranslation";
import { StepContainer } from "../components/StepContainer";
import { OnboardingMicButton } from "../components/OnboardingMicButton";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { useState } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "motion/react";
import { useOnboardingStore } from "../../stores/useOnboardingStore";
import { usePreventBack } from "../../hooks/usePreventBack";

export function OnboardingStep2() {
  const { t } = useOnboardingTranslation();
  const { nextStep, currentStep, goToStep, completeOnboarding } = useOnboardingStore();
  const router = useRouter();
  
  // Prevent back button
  usePreventBack();
  
  // State: 'result' (Recipe Detail) -> 'voice_mode' (Cooking Mode)
  const [viewState, setViewState] = useState<'result' | 'voice_mode'>('result');
  const [isMicAnimating, setIsMicAnimating] = useState(false);

  const handleStartCookingClick = () => {
    // Transition to Voice Mode
    setViewState('voice_mode');
  };

  const handleMicClick = () => {
    setIsMicAnimating(true);
    // Simulate recognition and move to next step
    setTimeout(() => {
      track(AMPLITUDE_EVENT.ONBOARDING_STEP_COMPLETE, {
        step: currentStep,
        step_count: 3
      });
      nextStep();
    }, 800);
  };
  
  const handleSkip = () => {
    track(AMPLITUDE_EVENT.ONBOARDING_SKIP);
    completeOnboarding();
    router.replace('/');
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('step2.result.title')}</h1>
                <p className="text-gray-600">{t('step2.result.subtitle')}</p>
              </motion.div>
            ) : (
              <motion.div
                key="title-voice"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex flex-col"
              >
                <img 
                  src="/images/onboarding/app-recipe-detail.png" 
                  alt="Recipe Detail" 
                  className="w-full h-full object-cover"
                />
                
                {/* Floating Action Button to Trigger Voice Mode */}
                <div className="absolute bottom-8 inset-x-0 flex justify-center">
                  <motion.button
                    initial={{ scale: 0, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
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
                initial={{ opacity: 0, scale: 1.1 }} // Zoom out effect
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0"
              >
                <img 
                  src="/images/onboarding/app-cooking.png" 
                  alt="Cooking Mode" 
                  className="w-full h-full object-cover"
                />
                
                {/* Spotlight Overlay */}
                <div className="absolute inset-0 bg-black/60 transition-opacity duration-1000" />

                {/* Mic Interaction Area */}
                <div className="absolute bottom-8 right-6 z-20 flex flex-col items-center">
                  
                  {/* Tooltip */}
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    className="absolute bottom-full mb-3 right-0 bg-white text-orange-600 px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap"
                  >
                    <p className="font-bold text-xs">{t('step2.voice.tooltip')}</p>
                    <div className="absolute -bottom-1 right-6 w-2 h-2 bg-white rotate-45" />
                  </motion.div>

                  {/* Mic Button & Ripple */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-orange-500/40 rounded-full animate-ping" />
                    <OnboardingMicButton onNext={handleMicClick} />
                    
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
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </StepContainer>
  );
}
