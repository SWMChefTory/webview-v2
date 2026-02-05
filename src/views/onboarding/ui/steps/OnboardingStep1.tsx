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
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
};

// 각 상태별 이미지 경로
const STEP_IMAGES: Record<Step1State, string> = {
  youtube: '/images/onboarding/app-share_1.png',
  share_sheet: '/images/onboarding/app-share_2.png',
  create_confirm: '/images/onboarding/app-share_3.png',
  home_saved: '/images/onboarding/app-home.png',
};

// 상태 순서 (이전/다음 네비게이션용)
const STEP_ORDER: Step1State[] = ['youtube', 'share_sheet', 'create_confirm', 'home_saved'];

export function OnboardingStep1() {
  const { t } = useOnboardingTranslation();
  const { nextStep, prevStep, currentStep } = useOnboardingStore();

  const [step1State, setStep1State] = useState<Step1State>('youtube');
  const currentIndex = STEP_ORDER.indexOf(step1State);

  // 타이틀 텍스트 - 간소화
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

  // 다음 상태로 이동
  const moveToNextState = useCallback(() => {
    track(AMPLITUDE_EVENT.ONBOARDING_STEP_COMPLETE, {
      step: currentStep,
      step_count: 3,
      sub_step: step1State,
    });

    if (currentIndex < STEP_ORDER.length - 1) {
      setStep1State(STEP_ORDER[currentIndex + 1]);
    } else {
      setTimeout(() => nextStep(), 200);
    }
  }, [currentIndex, step1State, currentStep, nextStep]);

  // 이전 상태로 이동
  const moveToPrevState = useCallback(() => {
    if (currentIndex > 0) {
      setStep1State(STEP_ORDER[currentIndex - 1]);
    } else {
      prevStep();
    }
  }, [currentIndex, prevStep]);

  return (
    <StepContainer
      currentStep={currentStep}
      onNext={moveToNextState}
      onPrev={moveToPrevState}
      onSkip={nextStep}
    >
      <div className="w-full flex flex-col items-center justify-center gap-3">
        {/* Title - 간소화 */}
        <AnimatePresence mode="wait">
          <motion.h1
            key={`title-${step1State}`}
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.15 }}
            className="text-lg lg:text-xl font-bold text-gray-900 text-center px-4"
          >
            {getTitle()}
          </motion.h1>
        </AnimatePresence>

        {/* Image Area - 크기 축소 */}
        <motion.button
          onClick={moveToNextState}
          className="relative w-[200px] cursor-pointer active:scale-[0.98] transition-transform"
          aria-label="다음 단계로 이동"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={step1State}
              variants={scaleInVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.15 }}
              className="relative w-full"
              style={{ aspectRatio: '9/19.5' }}
            >
              <Image
                src={STEP_IMAGES[step1State]}
                alt={`Step ${step1State}`}
                fill
                className="object-contain"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </motion.button>

        {/* 현재 단계 표시 - 동그라미 */}
        <div className="flex gap-1.5">
          {STEP_ORDER.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'bg-orange-500 w-4' : 'bg-gray-200 w-1.5'
              }`}
            />
          ))}
        </div>
      </div>
    </StepContainer>
  );
}
