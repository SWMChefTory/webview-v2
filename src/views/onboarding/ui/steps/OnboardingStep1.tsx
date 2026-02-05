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

  // 현재 상태 인덱스
  const currentIndex = STEP_ORDER.indexOf(step1State);

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

    if (currentIndex < STEP_ORDER.length - 1) {
      setStep1State(STEP_ORDER[currentIndex + 1]);
    } else {
      // 마지막 상태에서는 Step 2로 이동
      setTimeout(() => {
        nextStep();
      }, 300);
    }
  }, [currentIndex, step1State, currentStep, nextStep]);

  // 이전 상태로 이동
  const moveToPrevState = useCallback(() => {
    if (currentIndex > 0) {
      setStep1State(STEP_ORDER[currentIndex - 1]);
    } else {
      // 첫 상태에서는 Step 이동
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
      <div className="w-full max-w-md mx-auto flex flex-col items-center">

        {/* Title & Guide Text + 현재 단계 표시 */}
        <div className="text-center mb-6 z-10">
          <div className="text-xs text-gray-400 mb-2">
            {currentIndex + 1} / {STEP_ORDER.length}
          </div>
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

        {/* Image Area - 목업 프레임 제거 */}
        <motion.button
          onClick={moveToNextState}
          className="relative w-full max-w-sm mx-auto cursor-pointer active:scale-[0.98] transition-transform"
          aria-label="다음 단계로 이동"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={step1State}
              variants={scaleInVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="relative w-full"
              style={{ aspectRatio: '9/19.5' }} // iPhone 비율
            >
              <Image
                src={STEP_IMAGES[step1State]}
                alt={`Step ${step1State}`}
                fill
                className="object-contain"
                priority // 모든 이미지 프리로딩
              />
            </motion.div>
          </AnimatePresence>
        </motion.button>

        {/* 터치 가이드 */}
        <p className="text-xs text-gray-400 mt-4">
          화면을 터치하거나 아래 버튼을 눌러주세요
        </p>

      </div>
    </StepContainer>
  );
}
