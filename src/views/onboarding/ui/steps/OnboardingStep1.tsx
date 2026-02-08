import { useOnboardingTranslation } from "../../hooks/useOnboardingTranslation";
import { useHapticFeedback } from "../../hooks/useHapticFeedback";
import { StepContainer } from "../components/StepContainer";
import { useOnboardingStore } from "../../stores/useOnboardingStore";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Image from "next/image";
import { slideXVariants, createSlideTransition } from "../shared/animations";
import { PREVIEW_BUTTON, TIMING } from "../shared/constants";

// Step 1 상태 타입
type Step1State = 'youtube' | 'share_sheet' | 'create_confirm' | 'home_saved';

// 각 상태별 이미지 경로
const STEP_IMAGES: Record<Step1State, string> = {
  youtube: '/images/onboarding/app-share_1.png',
  share_sheet: '/images/onboarding/app-share_2.png',
  create_confirm: '/images/onboarding/app-share_3.png',
  home_saved: '/images/onboarding/app-home.png',
};

// 각 상태별 이미지 alt 텍스트
const STEP_ALT: Record<Step1State, string> = {
  youtube: '유튜브에서 레시피 영상 공유하기',
  share_sheet: '공유 시트에서 Cheftory 선택하기',
  create_confirm: '레시피 생성 확인 화면',
  home_saved: '홈 화면에 저장된 레시피',
};

// 상태 순서 (이전/다음 네비게이션용)
const STEP_ORDER: Step1State[] = ['youtube', 'share_sheet', 'create_confirm', 'home_saved'];

export function OnboardingStep1() {
  const { t } = useOnboardingTranslation();
  const { nextStep, prevStep, currentStep, completeOnboarding, navigationDirection } = useOnboardingStore();
  const { triggerHaptic } = useHapticFeedback();

  const [step1State, setStep1State] = useState<Step1State>(
    navigationDirection === 'backward' ? 'home_saved' : 'youtube'
  );
  const [prevStep1State, setPrevStep1State] = useState<Step1State | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentIndex = STEP_ORDER.indexOf(step1State);
  const prevIndex = prevStep1State !== null ? STEP_ORDER.indexOf(prevStep1State) : 0;
  const direction = prevStep1State === null ? 0 : currentIndex > prevIndex ? 1 : currentIndex < prevIndex ? -1 : 0;

  // cleanup setTimeout on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // 접근성: reduced-motion 체크
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  const transitionConfig = createSlideTransition(shouldAnimate);

  // 건너뛰기: 온보딩 완료 (index.tsx의 useEffect가 '/'로 리다이렉트)
  const handleSkip = useCallback(() => {
    track(AMPLITUDE_EVENT.ONBOARDING_SKIP, {
      step: currentStep,
      step_count: 3,
    });
    completeOnboarding();
  }, [currentStep, completeOnboarding]);

  // 타이틀/서브타이틀 텍스트
  const title = useMemo((): string => {
    switch (step1State) {
      case 'youtube': return t('step1.youtube.title');
      case 'share_sheet': return t('step1.share_sheet.title');
      case 'create_confirm': return t('step1.create_confirm.title');
      case 'home_saved': return t('step1.home_saved.title');
    }
  }, [step1State, t]);

  const subtitle = useMemo((): string => {
    switch (step1State) {
      case 'youtube': return t('step1.youtube.guide');
      case 'share_sheet': return t('step1.share_sheet.guide');
      case 'create_confirm': return t('step1.create_confirm.guide');
      case 'home_saved': return t('step1.home_saved.guide');
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
      timerRef.current = setTimeout(() => nextStep(), TIMING.NEXT_STEP_DELAY_MS);
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
      innerStateIndex={currentIndex}
    >
      <div className="w-full flex-1 flex flex-col items-center justify-center gap-2 min-h-0">
        {/* Section Label */}
        <span className="text-[11px] font-semibold text-orange-500 tracking-wide">
          STEP 1 · {t('step1.sectionLabel')}
        </span>

        {/* Title */}
        <AnimatePresence mode="wait" initial={false}>
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
            {title}
          </motion.h1>
        </AnimatePresence>

        {/* Subtitle */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={`subtitle-${step1State}`}
            variants={slideXVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            custom={{ direction, shouldAnimate }}
            transition={transitionConfig}
            className="text-sm text-gray-600 text-center px-4"
          >
            {subtitle}
          </motion.p>
        </AnimatePresence>

        {/* Image Area */}
        <motion.button
          onClick={moveToNextState}
          whileHover={shouldAnimate ? { scale: 1.02 } : undefined}
          whileTap={shouldAnimate ? { scale: 0.96 } : undefined}
          className="relative cursor-pointer rounded-2xl transition-transform focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 flex-1 min-h-0"
          style={{ width: PREVIEW_BUTTON.WIDTH, maxHeight: PREVIEW_BUTTON.HEIGHT_NORMAL }}
          aria-label={`${STEP_ALT[step1State]}. 터치하여 다음으로 이동.`}
        >
          <AnimatePresence mode="wait" initial={false}>
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
                alt={STEP_ALT[step1State]}
                fill
                className="object-contain"
              />
            </motion.div>
          </AnimatePresence>
        </motion.button>

        {/* 하단 힌트 — 첫 화면: 리워드, 이후: 터치 안내 */}
        {currentIndex === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="text-xs text-amber-600 flex items-center gap-1"
          >
            <Image src="/images/berry/berry.png" alt="" width={14} height={14} />
            <span>끝까지 완료하면 30베리를 드려요</span>
          </motion.p>
        ) : (
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <span>화면을 터치하여 다음</span>
            <span aria-hidden="true">→</span>
          </p>
        )}
      </div>
    </StepContainer>
  );
}
