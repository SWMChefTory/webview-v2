import { useOnboardingTranslation } from "../../hooks/useOnboardingTranslation";
import { StepContainer } from "../components/StepContainer";
import { useOnboardingStore } from "../../stores/useOnboardingStore";
import { useOnboardingNavigation } from "../../hooks/useOnboardingNavigation";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { useRouter } from "next/router";
import { motion } from "motion/react";
import { usePreventBack } from "../../hooks/usePreventBack";
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

export function OnboardingStep3() {
  const { t } = useOnboardingTranslation();
  const { completeOnboarding } = useOnboardingStore();
  const { currentStep } = useOnboardingNavigation();
  const router = useRouter();
  
  const [url, setUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Prevent back button
  usePreventBack();

  // 온보딩 완료 후 라우팅 처리 (통합 함수)
  const handleFinish = useCallback(() => {
    completeOnboarding();
    router.replace('/');
  }, [completeOnboarding, router]);

  const handleSave = async () => {
    if (!url.trim()) return;

    setIsSaving(true);
    track(AMPLITUDE_EVENT.ONBOARDING_COMPLETE, { type: 'with_url', url });

    // Mock save delay (1.5s)
    await new Promise(resolve => setTimeout(resolve, 1500));

    handleFinish();
  };

  const handleExplore = () => {
    track(AMPLITUDE_EVENT.ONBOARDING_COMPLETE, { type: 'explore' });
    handleFinish();
  };

  const handleSkip = () => {
    track(AMPLITUDE_EVENT.ONBOARDING_SKIP);
    handleFinish();
  };
  
  return (
    <StepContainer
      currentStep={currentStep}
      onNext={() => {}} // Custom handling in button
      onPrev={() => {}}
      onSkip={handleSkip}
    >
      <div className="text-center w-full max-w-md mx-auto relative flex flex-col items-center">
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
          className="text-8xl mb-6 select-none drop-shadow-2xl"
        >
          🎉
        </motion.div>
        
        {/* Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3"
        >
          {t('step3.title')}
        </motion.h1>
        
        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-gray-600 mb-8 break-keep leading-relaxed"
        >
          {t('step3.subtitle')}
        </motion.p>
        
        {/* Motivation Card with Home Preview */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-8 w-full relative overflow-hidden rounded-2xl border border-orange-100 shadow-lg bg-white h-48 group"
        >
          <div className="absolute inset-0 opacity-100 transition-opacity duration-500">
             <img src="/images/onboarding/app-recipe-summary.png" alt="Recipe Summary" className="w-full h-full object-cover object-top" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent" />
          <div className="relative p-6 h-full flex items-end justify-center">
            <p className="text-lg font-bold text-gray-800 px-4 drop-shadow-sm mb-2">
              {t('step3.motivation')}
            </p>
          </div>
        </motion.div>
        
        {/* Input Field */}
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.55 }}
           className="w-full mb-4 relative"
        >
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={t('step3.input.placeholder')}
            className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition outline-none text-gray-800 placeholder:text-gray-400 bg-gray-50/50 text-center"
            disabled={isSaving}
          />
        </motion.div>

        {/* Primary Button: Save */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={handleSave}
          disabled={isSaving || !url.trim()}
          className={cn(
            "w-full py-4 rounded-2xl font-bold text-white text-lg transition-all shadow-lg flex items-center justify-center gap-2 mb-3",
            url.trim() 
              ? "bg-orange-600 hover:bg-orange-700 hover:shadow-xl active:scale-[0.98] cursor-pointer" 
              : "bg-gray-300 cursor-not-allowed text-gray-500 shadow-none"
          )}
        >
          {isSaving ? (
            <>
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{t('step3.button.saving')}</span>
            </>
          ) : (
            <>
              <span>{t('step3.button.save')}</span>
              <span>💾</span>
            </>
          )}
        </motion.button>

        {/* Secondary Button: Explore */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          onClick={handleExplore}
          disabled={isSaving}
          className="py-2 px-4 text-gray-500 font-medium hover:text-orange-600 transition-colors text-sm border-b border-transparent hover:border-orange-200"
        >
          {t('step3.button.explore')}
        </motion.button>

      </div>
    </StepContainer>
  );
}
