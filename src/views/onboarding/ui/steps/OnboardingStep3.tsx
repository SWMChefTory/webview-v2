import { useTranslation } from "next-i18next";
import { StepContainer } from "../components/StepContainer";
import { useOnboardingStore } from "../stores/useOnboardingStore";
import { useOnboardingNavigation } from "../hooks/useOnboardingNavigation";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { useRouter } from "next/router";
import { motion } from "motion/react";

import { usePreventBack } from "../../hooks/usePreventBack";

export function OnboardingStep3() {
  const { t } = useTranslation("onboarding");
  const { completeOnboarding, resetOnboarding } = useOnboardingStore();
  const { currentStep } = useOnboardingNavigation();
  const router = useRouter();
  
  // Prevent back button
  usePreventBack();
  
  const handleStartCooking = () => {
    track(AMPLITUDE_EVENT.ONBOARDING_COMPLETE);
    completeOnboarding();
    router.push('/');
  };
  
  const handleSkip = () => {
    track(AMPLITUDE_EVENT.ONBOARDING_SKIP);
    completeOnboarding();
    router.push('/');
  };
  
  return (
    <StepContainer
      currentStep={currentStep}
      onNext={handleStartCooking}
      onPrev={() => {}}
      onSkip={handleSkip}
    >
      <div className="text-center w-full max-w-md mx-auto relative">
        {/* Home Screen Background Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 opacity-10 blur-sm scale-110 pointer-events-none -z-10">
           <img src="/images/onboarding/app-home.png" alt="Home" />
        </div>

        {/* Success Animation */}
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.1 
          }}
          className="text-8xl mb-8 select-none drop-shadow-2xl"
        >
          🎉
        </motion.div>
        
        {/* Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
        >
          {t('step3.title')}
        </motion.h1>
        
        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-gray-600 mb-10 break-keep leading-relaxed"
        >
          {t('step3.subtitle')}
        </motion.p>
        
        {/* Motivation Card with Home Preview */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-10 relative overflow-hidden rounded-2xl border border-orange-100 shadow-lg bg-white"
        >
          <div className="absolute inset-0 opacity-20">
             <img src="/images/onboarding/app-home.png" alt="Home Preview" className="w-full h-full object-cover" />
          </div>
          <div className="relative p-6 backdrop-blur-[1px]">
            <p className="text-lg font-bold text-orange-700">
              {t('step3.motivation')}
            </p>
          </div>
        </motion.div>
        
        {/* Start Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={handleStartCooking}
          className="w-full py-4 rounded-2xl font-bold text-white text-lg bg-orange-500 hover:bg-orange-600 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <span>{t('step3.startButton')}</span>
          <span>🚀</span>
        </motion.button>
      </div>
    </StepContainer>
  );
}
