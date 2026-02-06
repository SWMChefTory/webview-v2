import { useOnboardingTranslation } from "../../hooks/useOnboardingTranslation";
import { StepContainer } from "../components/StepContainer";
import { useOnboardingStore } from "../../stores/useOnboardingStore";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/router";

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

// 슬라이드 애니메이션 variants (방향성 있음)
interface SlideCustom {
  direction: number;
  shouldAnimate: boolean;
}

const slideXVariants = {
  hidden: (custom: SlideCustom) => ({
    opacity: custom.shouldAnimate ? 0 : 1,
    x: custom.shouldAnimate ? (custom.direction > 0 ? 50 : -50) : 0,
  }),
  visible: { opacity: 1, x: 0 },
  exit: (custom: SlideCustom) => ({
    opacity: custom.shouldAnimate ? 0 : 1,
    x: custom.shouldAnimate ? (custom.direction > 0 ? -50 : 50) : 0,
  }),
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
  const { nextStep, prevStep, currentStep, completeOnboarding } = useOnboardingStore();
  const router = useRouter();

  const [step1State, setStep1State] = useState<Step1State>('youtube');
  const [prevStep1State, setPrevStep1State] = useState<Step1State | null>(null);
  const currentIndex = STEP_ORDER.indexOf(step1State);
  const prevIndex = prevStep1State !== null ? STEP_ORDER.indexOf(prevStep1State) : 0;
  // 방향: 1 = forward, -1 = backward, 0 = initial
  const direction = prevStep1State === null ? 0 : currentIndex > prevIndex ? 1 : currentIndex < prevIndex ? -1 : 0;

  // 접근성: reduced-motion 체크
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  // 애니메이션 설정 (Step 1: 빠른 전환)
  const transitionConfig = {
    duration: shouldAnimate ? 0.15 : 0,
    ease: shouldAnimate ? [0.25, 0.1, 0.25, 1] as const : undefined,
  };

  // 햅틱 피드백
  const triggerHaptic = useCallback(() => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
  }, []);

  // 건너락기: 바로 온보딩 완료
  const handleSkip = useCallback(() => {
    track(AMPLITUDE_EVENT.ONBOARDING_SKIP, {
      step: currentStep,
      step_count: 3,
    });
    completeOnboarding();
    router.replace('/');
  }, [currentStep, completeOnboarding, router]);

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

  // 서브타이틀 텍스트
  const getSubtitle = useCallback((): string => {
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
    triggerHaptic();
    track(AMPLITUDE_EVENT.ONBOARDING_STEP_COMPLETE, {
      step: currentStep,
      step_count: 3,
      sub_step: step1State,
    });

    setPrevStep1State(step1State);
    if (currentIndex < STEP_ORDER.length - 1) {
      setStep1State(STEP_ORDER[currentIndex + 1]);
    } else {
      setTimeout(() => nextStep(), 200);
    }
  }, [currentIndex, step1State, currentStep, nextStep, triggerHaptic]);

  // 이전 상태로 이동
  const moveToPrevState = useCallback(() => {
    setPrevStep1State(step1State);
    if (currentIndex > 0) {
      setStep1State(STEP_ORDER[currentIndex - 1]);
    } else {
      prevStep();
    }
  }, [currentIndex, step1State, prevStep]);

  return (
    <StepContainer
      currentStep={currentStep}
      onNext={moveToNextState}
      onPrev={moveToPrevState}
      onSkip={handleSkip}
    >
      <div className="w-full flex flex-col items-center justify-center gap-2">
        {/* Title */}
        <AnimatePresence mode="sync" initial={false}>
          <motion.h1
            key={`title-${step1State}`}
            variants={slideXVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            custom={{ direction, shouldAnimate }}
            transition={transitionConfig}
            className="text-lg lg:text-xl font-bold text-gray-900 text-center px-4"
          >
            {getTitle()}
          </motion.h1>
        </AnimatePresence>

        {/* Subtitle */}
        <AnimatePresence mode="sync" initial={false}>
          <motion.p
            key={`subtitle-${step1State}`}
            variants={slideXVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            custom={{ direction, shouldAnimate }}
            transition={transitionConfig}
            className="text-sm text-gray-500 text-center px-4"
          >
            {getSubtitle()}
          </motion.p>
        </AnimatePresence>

        {/* Image Area */}
        <motion.button
          onClick={moveToNextState}
          whileHover={shouldAnimate ? { scale: 1.02 } : undefined}
          whileTap={shouldAnimate ? { scale: 0.96 } : undefined}
          className={`relative w-[280px] h-[580px] cursor-pointer rounded-2xl transition-transform focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 ${
            currentIndex < STEP_ORDER.length - 1 ? 'ring-1 ring-orange-500/30' : ''
          }`}
          aria-label={`온보딩 ${currentIndex + 1}단계: ${getTitle()}. 터치하여 다음으로 이동.`}
          aria-current={currentIndex === STEP_ORDER.length - 1 ? 'step' : undefined}
        >
          <AnimatePresence mode="sync" initial={false}>
            <motion.div
              key={step1State}
              variants={slideXVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              custom={{ direction, shouldAnimate }}
              transition={transitionConfig}
              className="relative w-full h-full rounded-2xl overflow-hidden"
              style={{ willChange: shouldAnimate ? 'transform, opacity' : 'auto' }}
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

        {/* 현재 단계 표시 - 번호 있는 인디케이터 */}
        <div className="flex gap-2" role="progressbar" aria-label="온보딩 진행률" aria-valuemin={1} aria-valuemax={STEP_ORDER.length} aria-valuenow={currentIndex + 1}>
          {STEP_ORDER.map((_, idx) => (
            <div
              key={idx}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                idx === currentIndex
                  ? 'bg-orange-500 text-white'
                  : idx < currentIndex
                    ? 'bg-orange-200 text-orange-700'
                    : 'bg-gray-200 text-gray-400'
              }`}
              aria-label={`${idx + 1}단계 ${idx === currentIndex ? '현재' : idx < currentIndex ? '완료' : '미진행'}`}
              aria-current={idx === currentIndex ? 'true' : undefined}
            >
              {idx + 1}
            </div>
          ))}
        </div>
      </div>
    </StepContainer>
  );
}
