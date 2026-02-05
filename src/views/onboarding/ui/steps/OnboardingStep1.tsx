import { useOnboardingTranslation } from "../../hooks/useOnboardingTranslation";
import { StepContainer } from "../components/StepContainer";
import { useOnboardingStore } from "../../stores/useOnboardingStore";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

// 시뮬레이션 시간 상수
const SIMULATION_DELAYS = {
  ANALYSIS: 2500, // AI 분석 시뮬레이션 시간
  SHEET_DELAY: 200, // 공유 시트 애니메이션 딜레이
} as const;

// 애니메이션 variants
const fadeInVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

const slideUpVariants = {
  hidden: { y: "100%" },
  visible: { y: "20%" },
  exit: { y: "100%" },
};

const progressVariants = {
  hidden: { width: 0 },
  visible: { width: "80%" },
};

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
    }, SIMULATION_DELAYS.ANALYSIS);
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
            <Image
              src="/images/onboarding/app-share.png"
              alt="YouTube App"
              fill
              className="object-cover"
              priority
            />

            {/* Spotlight Overlay for initial state */}
            {subStep === 'initial' && (
              <div className="absolute inset-0 bg-black/50" />
            )}

            {/* Hotspot 1: Share Button with Spotlight Effect */}
            {subStep === 'initial' && (
              <>
                {/* 스포트라이트 효과 - 클릭 영역 주변만 밝게 */}
                <div
                  className="absolute bottom-[26%] right-[6%] w-20 h-16 rounded-xl z-10 animate-pulse"
                  style={{
                    background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(0,0,0,0) 70%)',
                  }}
                />

                {/* 클릭 가이드 툴팁 */}
                <motion.div
                  variants={fadeInVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.3 }}
                  className="absolute bottom-[36%] right-[2%] z-30"
                >
                  <div className="bg-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium text-gray-800 whitespace-nowrap">
                    공유 버튼을 눌러보세요 👆
                    <div className="absolute -bottom-1 left-6 w-2 h-2 bg-white rotate-45" />
                  </div>
                </motion.div>

                {/* 투명 클릭 버튼 - 정밀 위치 조정 */}
                <motion.button
                  variants={fadeInVariants}
                  initial="hidden"
                  animate="visible"
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShareClick}
                  className="absolute bottom-[26%] right-[6%] w-20 h-14 z-20 flex items-center justify-center"
                  aria-label="공유 버튼"
                >
                  {/* Visual Cue: Pulsing Circle */}
                  <span className="absolute inset-0 bg-orange-500/40 rounded-xl animate-ping" />
                  <span className="absolute inset-0 border-3 border-orange-500 rounded-xl" />
                  <span className="absolute inset-0 border-2 border-orange-300/60 rounded-xl animate-pulse" />
                </motion.button>
              </>
            )}
          </div>

          {/* 2. Overlay Layer: Share Sheet (app-share2.png) */}
          <AnimatePresence>
            {subStep !== 'initial' && (
              <motion.div
                variants={slideUpVariants}
                initial="hidden"
                animate={subStep === 'analyzing' ? "exit" : "visible"}
                exit="exit"
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute inset-0 z-30"
              >
                 {/* Darken background when sheet is up */}
                 <div className="absolute -top-[20%] inset-x-0 h-[20%] bg-black/50 backdrop-blur-sm" />

                 <Image
                  src="/images/onboarding/app-share2.png"
                  alt="Share Sheet"
                  fill
                  className="object-cover"
                  style={{ borderRadius: '2rem 2rem 0 0' }}
                />

                {/* Spotlight for Cheftory icon */}
                {subStep === 'sheet_open' && (
                  <div
                    className="absolute top-[32%] left-[4%] w-20 h-24 rounded-xl z-35 animate-pulse"
                    style={{
                      background: 'radial-gradient(circle, rgba(251,146,60,0.4) 0%, rgba(0,0,0,0) 70%)',
                    }}
                  />
                )}

                {/* Hotspot 2: Create Button (Cheftory Icon) */}
                {subStep === 'sheet_open' && (
                  <>
                    {/* 클릭 가이드 툴팁 */}
                    <motion.div
                      variants={fadeInVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.4 }}
                      className="absolute top-[22%] left-[2%] z-50"
                    >
                      <div className="bg-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium text-orange-600 whitespace-nowrap">
                        쉐프토리를 선택하세요 👇
                        <div className="absolute -bottom-1 right-4 w-2 h-2 bg-white rotate-45" />
                      </div>
                    </motion.div>

                    <motion.button
                      variants={fadeInVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: SIMULATION_DELAYS.SHEET_DELAY / 1000 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCreateClick}
                      className="absolute top-[32%] left-[4%] w-20 h-24 z-40 flex flex-col items-center justify-center"
                      aria-label="쉐프토리 선택"
                    >
                      <span className="absolute inset-0 bg-orange-500/30 rounded-xl animate-ping" />
                      <span className="absolute inset-0 border-3 border-orange-500 rounded-xl" />
                      <span className="absolute inset-0 border-2 border-orange-300/60 rounded-xl animate-pulse" />
                    </motion.button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 3. Loading Layer: Analyzing */}
          <AnimatePresence>
            {subStep === 'analyzing' && (
              <motion.div
                variants={fadeInVariants}
                initial="hidden"
                animate="visible"
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
                  variants={progressVariants}
                  initial="hidden"
                  animate="visible"
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
