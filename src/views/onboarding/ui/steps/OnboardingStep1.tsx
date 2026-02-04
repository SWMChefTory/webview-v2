import { useTranslation } from "next-i18next";
import { StepContainer } from "../components/StepContainer";
import { CaptureOverlay } from "../components/CaptureOverlay";
import { TutorialArrow } from "../components/TutorialArrow";
import { useOnboardingNavigation } from "../hooks/useOnboardingNavigation";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { useState } from "react";
import { motion } from "motion/react";

import { usePreventBack } from "../../hooks/usePreventBack";

export function OnboardingStep1() {
  const { t } = useTranslation("onboarding");
  const { nextStep, currentStep, goToStep, completeOnboarding } = useOnboardingStore();
  
  // Prevent back button
  usePreventBack();
  
  const [showArrowClick, setShowArrowClick] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleArrowClick = () => {
    if (showArrowClick || isAnimating) return;
    
    track(AMPLITUDE_EVENT.ONBOARDING_YOUTUBE_CLICK);
    setShowArrowClick(true);
    
    setTimeout(() => {
      if (!showArrowClick) return;
      setIsAnimating(true);
      setTimeout(() => {
        nextStep();
      }, 300);
    }, 2000);
  };
  
  const handleNext = () => {
    if (currentStep < 3) {
      track(AMPLITUDE_EVENT.ONBOARDING_STEP_CHANGE, {
        step_from: currentStep,
        step_to: currentStep + 1
      });
      nextStep();
    }
  };
  
  const handlePrev = () => {
    if (currentStep > 1) {
      track(AMPLITUDE_EVENT.ONBOARDING_STEP_CHANGE, {
        step_from: currentStep,
        step_to: currentStep - 1
      });
      goToStep(currentStep - 1 as 1 | 2 | 3);
    }
  };
  
  const handleSkip = () => {
    track(AMPLITUDE_EVENT.ONBOARDING_SKIP);
    completeOnboarding();
    window.location.href = '/';
  };
  
  return (
    <StepContainer
      currentStep={currentStep}
      onNext={handleNext}
      onPrev={handlePrev}
      onSkip={handleSkip}
    >
      <div className="text-center w-full max-w-md mx-auto">
        {/* Title */}
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
          {t('step1.title')}
        </h1>
        <p className="text-lg lg:text-xl text-gray-600 mb-8 font-medium">
          {t('step1.subtitle')}
        </p>
        
        {/* Capture Image with Arrow */}
        <div className="relative inline-block mb-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <img
              src="/images/onboarding/app-share.png"
              alt={t('step1.highlight')}
              className="rounded-3xl shadow-2xl border border-gray-100 w-64 lg:w-72 h-auto object-cover mx-auto"
            />
            
            {/* Highlight overlay for Cheftory Icon in Share Sheet */}
            {/* Note: Positioning is approximate based on typical share sheet layout */}
            {!showArrowClick && (
              <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-16 h-16 bg-orange-500/20 rounded-2xl animate-ping pointer-events-none" />
            )}
          </motion.div>
          
          {/* Tutorial Arrow & Tooltip */}
          {!showArrowClick && (
            <div className="absolute bottom-[25%] right-[-20px] z-20">
              <div className="relative">
                <TutorialArrow
                  onClick={handleArrowClick}
                  isAnimating={isAnimating}
                />
                {/* Tooltip */}
                <motion.div 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-white px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-30"
                >
                  <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rotate-45" />
                  <p className="text-sm font-bold text-orange-600">공유하기로 저장!</p>
                </motion.div>
              </div>
            </div>
          )}
          
          {/* Click Interaction Overlay */}
          {showArrowClick && (
            <CaptureOverlay
              icon="🔗"
              message="유튜브 앱에서 공유하기만 누르면 끝!"
              onClose={() => setShowArrowClick(false)}
            />
          )}
        </div>

        {/* Value Proposition */}
        <div className="bg-orange-50 rounded-xl p-4 text-orange-800 font-medium text-sm lg:text-base">
          ✨ {t('step1.value')}
        </div>
      </div>
    </StepContainer>
  );
}
