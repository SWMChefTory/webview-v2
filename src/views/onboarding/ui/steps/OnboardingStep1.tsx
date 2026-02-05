import { useOnboardingTranslation } from "../../hooks/useOnboardingTranslation";
import { StepContainer } from "../components/StepContainer";
import { useOnboardingStore } from "../../stores/useOnboardingStore";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

// Step 1 상태 타입
type Step1State = 'youtube' | 'share_sheet' | 'create_confirm' | 'home_saved';

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
const STEP_IMAGES: Record<Step1State, string> = {
  youtube: '/images/onboarding/app-share_1.png',
  share_sheet: '/images/onboarding/app-share_2.png',
  create_confirm: '/images/onboarding/app-share_3.png',
  home_saved: '/images/onboarding/app-home.png',
};

export function OnboardingStep1() {
  const { t } = useOnboardingTranslation();
  const { nextStep, currentStep } = useOnboardingStore();

  const [step1State, setStep1State] = useState<Step1State>('youtube');

  // 타이틀 텍스트
  const getTitle = useCallback((): string => {
    switch (step1State) {
      case 'youtube':
        return t('step1.youtube.title');
      case 'share_sheet':
        return t('step1.share_sheet.title');
      case 'create_confirm':
        return t('step1.create_confirm.title');
      case 'home_saved':
        return t('step1.home_saved.title');
    }
  }, [step1State, t]);

  // 가이드 텍스트
  const getGuide = useCallback((): string => {
    switch (step1State) {
      case 'youtube':
        return t('step1.youtube.guide');
      case 'share_sheet':
        return t('step1.share_sheet.guide');
      case 'create_confirm':
        return t('step1.create_confirm.guide');
      case 'home_saved':
        return t('step1.home_saved.guide');
    }
  }, [step1State, t]);

  // 다음 상태로 이동
  const moveToNextState = useCallback(() => {
    track(AMPLITUDE_EVENT.ONBOARDING_STEP_COMPLETE, {
      step: currentStep,
      step_count: 3,
      sub_step: step1State,
    });

    switch (step1State) {
      case 'youtube':
        setStep1State('share_sheet');
        break;
      case 'share_sheet':
        setStep1State('create_confirm');
        break;
      case 'create_confirm':
        setStep1State('home_saved');
        break;
      case 'home_saved':
        // 홈 상태에서 터치 시 Step 2로 이동
        setTimeout(() => {
          nextStep();
        }, 300);
        break;
    }
  }, [step1State, currentStep, nextStep]);

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
              key={`title-${step1State}`}
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

        {/* Device Mockup Area - 전체 화면 터치 가능 */}
        <motion.button
          onClick={moveToNextState}
          className="relative w-72 h-[500px] bg-black rounded-[2.5rem] shadow-2xl border-4 border-gray-100 overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
          aria-label="다음 단계로 이동"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={step1State}
              variants={scaleInVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <Image
                src={STEP_IMAGES[step1State]}
                alt={`Step ${step1State}`}
                fill
                className="object-cover"
                priority={step1State === 'youtube'}
              />
            </motion.div>
          </AnimatePresence>
        </motion.button>

      </div>
    </StepContainer>
  );
}
