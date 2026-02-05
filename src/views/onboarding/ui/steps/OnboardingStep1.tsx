import { useOnboardingTranslation } from "../../hooks/useOnboardingTranslation";
import { StepContainer } from "../components/StepContainer";
import { useOnboardingStore } from "../../stores/useOnboardingStore";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function OnboardingStep1() {
  const { t } = useOnboardingTranslation();
  const { nextStep, currentStep } = useOnboardingStore();
  
  // Interaction States: 'initial' (YouTube) -> 'sheet_open' (Share Sheet) -> 'analyzing' (Loading)
  const [subStep, setSubStep] = useState<'initial' | 'sheet_open' | 'analyzing'>('initial');
  
  const handleShareClick = () => {
    track(AMPLITUDE_EVENT.ONBOARDING_YOUTUBE_CLICK);
    setSubStep('sheet_open');
  };

  const handleCreateClick = () => {
    setSubStep('analyzing');
    // Simulate AI Analysis time then move to next step
    setTimeout(() => {
      nextStep();
    }, 2500);
  };

  return (
    <StepContainer
      currentStep={currentStep}
      onNext={() => {}} // Disabled manual next, forced interaction
      onPrev={() => {}}
      onSkip={nextStep} // Allow skipping if stuck
    >
      <div className="w-full max-w-md mx-auto relative min-h-[600px] flex flex-col items-center">
        
        {/* Title & Guide Text based on State */}
        <div className="text-center mb-6 z-10 transition-all duration-300">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            {subStep === 'initial' && t('step1.title')}
            {subStep === 'sheet_open' && t('step1.simulation.selectApp')}
            {subStep === 'analyzing' && t('step1.simulation.analyzing')}
          </h1>
          <p className="text-gray-600 text-sm lg:text-base">
            {subStep === 'initial' && t('step1.simulation.guide.initial')}
            {subStep === 'sheet_open' && t('step1.simulation.guide.sheet')}
            {subStep === 'analyzing' && t('step1.simulation.guide.analyzing')}
          </p>
        </div>

        {/* Device Mockup Area */}
        <div className="relative w-72 h-[500px] bg-black rounded-[2.5rem] shadow-2xl border-4 border-gray-100 overflow-hidden">
          
          {/* 1. Base Layer: YouTube Screen (app-share.png) */}
          <div className="absolute inset-0 bg-white">
            <img 
              src="/images/onboarding/app-share.png" 
              alt="YouTube App" 
              className="w-full h-full object-cover"
            />
            
            {/* Hotspot 1: Share Button */}
            {subStep === 'initial' && (
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleShareClick}
                className="absolute bottom-[28%] right-[8%] w-16 h-12 z-20 flex items-center justify-center group"
              >
                {/* Visual Cue: Pulsing Circle */}
                <span className="absolute inset-0 bg-orange-500/30 rounded-full animate-ping" />
                <span className="absolute inset-0 bg-orange-500/20 rounded-full border-2 border-orange-500" />
                
                {/* Finger/Hand Icon Hint */}
                <span className="absolute -bottom-8 -right-4 text-3xl animate-bounce drop-shadow-md">
                  👆
                </span>
              </motion.button>
            )}
          </div>

          {/* 2. Overlay Layer: Share Sheet (app-share2.png) */}
          <AnimatePresence>
            {subStep !== 'initial' && (
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: subStep === 'analyzing' ? "100%" : "20%" }} // Slide up slightly (simulate partial sheet) or full? Let's do partial overlay
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute inset-0 z-30"
              >
                 {/* Darken background when sheet is up */}
                 <div className="absolute -top-[20%] inset-x-0 h-[20%] bg-black/40 backdrop-blur-sm" />
                 
                 <img 
                  src="/images/onboarding/app-share2.png" 
                  alt="Share Sheet" 
                  className="w-full h-full object-cover rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.2)]"
                />

                {/* Hotspot 2: Create Button (Cheftory Icon) */}
                {subStep === 'sheet_open' && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ delay: 0.2 }}
                    onClick={handleCreateClick}
                    className="absolute top-[35%] left-[6%] w-16 h-20 z-40 flex flex-col items-center justify-center"
                  >
                    <span className="absolute inset-0 bg-orange-500/30 rounded-xl animate-ping" />
                    <span className="absolute inset-0 border-2 border-orange-500 rounded-xl" />
                    
                     <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-3xl animate-bounce drop-shadow-md">
                      👇
                    </span>
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 3. Loading Layer: Analyzing */}
          <AnimatePresence>
            {subStep === 'analyzing' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-white"
              >
                <div className="relative w-24 h-24 mb-6">
                  <motion.span 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="absolute inset-0 border-4 border-orange-500/30 border-t-orange-500 rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-4xl">
                    🥘
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{t('step1.simulation.analyzing')}</h3>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "80%" }}
                  transition={{ duration: 2 }}
                  className="h-2 bg-orange-500 rounded-full"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </StepContainer>
  );
}
