import { useOnboardingTranslation } from "../../hooks/useOnboardingTranslation";
import { useHapticFeedback } from "../../hooks/useHapticFeedback";
import { StepContainer } from "../components/StepContainer";
import { OnboardingMicButton } from "../components/OnboardingMicButton";
import { HandsFreeModeTooltipCompact } from "../components/HandsFreeModeTooltip";
import { useOnboardingStore } from "../../stores/useOnboardingStore";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { slideXVariants, createSlideTransition } from "../shared/animations";
import { PREVIEW_BUTTON, TIMING } from "../shared/constants";
import { BasicIntent } from "@/src/views/recipe-step/lib/parseIntent";

// Step 2 상태 타입
type Step2State = 'summary' | 'ingredients' | 'steps' | 'cooking';

// 음성 인식 상태
type VoiceStatus = 'idle' | 'listening' | 'recognized' | 'failed';

// 음성 과제 상태 (cooking 모드 내 2단계)
type VoiceTaskState = 'play_video' | 'next_step' | 'completed';

// 각 상태별 이미지 경로
const STEP_IMAGES: Record<Step2State, string> = {
  summary: '/images/onboarding/app-detail_1.png',
  ingredients: '/images/onboarding/app-detail_2.png',
  steps: '/images/onboarding/app-detail_3.png',
  cooking: '/images/onboarding/app-cooking_home.png',
};

// 각 상태별 이미지 alt 텍스트 키
const STEP_ALT_KEYS: Record<Step2State, string> = {
  summary: 'step2.alt.summary',
  ingredients: 'step2.alt.ingredients',
  steps: 'step2.alt.steps',
  cooking: 'step2.alt.cooking',
};

// 상태 순서
const STEP_ORDER: Step2State[] = ['summary', 'ingredients', 'steps', 'cooking'];

// 체크 아이콘 컴포넌트
const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export function OnboardingStep2() {
  const { t } = useOnboardingTranslation();
  const { nextStep, prevStep, currentStep, completeOnboarding, navigationDirection } = useOnboardingStore();
  const { triggerHaptic } = useHapticFeedback();

  const [step2State, setStep2State] = useState<Step2State>(
    navigationDirection === 'backward' ? 'cooking' : 'summary'
  );
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>('idle');
  const [prevStep2State, setPrevStep2State] = useState<Step2State | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [micActivated, setMicActivated] = useState(false);
  const isTransitioningRef = useRef(false);

  // 2단계 음성 과제 상태
  const [voiceTaskState, setVoiceTaskState] = useState<VoiceTaskState>('play_video');
  const [completedTasks, setCompletedTasks] = useState({
    playVideo: false,
    nextStep: false,
  });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentIndex = STEP_ORDER.indexOf(step2State);
  const prevIndex = prevStep2State !== null ? STEP_ORDER.indexOf(prevStep2State) : 0;
  const direction = prevStep2State === null ? 0 : currentIndex > prevIndex ? 1 : currentIndex < prevIndex ? -1 : 0;

  // cleanup setTimeout on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // cooking 상태를 벗어나면 마이크/음성 상태 리셋
  useEffect(() => {
    if (step2State !== 'cooking') {
      isTransitioningRef.current = false;
      setMicActivated(false);
      setVoiceStatus('idle');
      setIsListening(false);
      setVoiceTaskState('play_video');
      setCompletedTasks({ playVideo: false, nextStep: false });
    }
  }, [step2State]);

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
    switch (step2State) {
      case 'summary': return t('step2.summary.title');
      case 'ingredients': return t('step2.ingredients.title');
      case 'steps': return t('step2.steps.title');
      case 'cooking': return t('step2.cooking.title');
    }
  }, [step2State, t]);

  // 서브타이틀 - cooking 모드에서는 현재 과제에 따라 동적 변경
  const subtitle = useMemo((): string => {
    if (step2State === 'cooking') {
      switch (voiceTaskState) {
        case 'play_video':
          return t('step2.cooking.voiceTasks.playVideoHint');
        case 'next_step':
          return t('step2.cooking.voiceTasks.nextStepHint');
        case 'completed':
          return t('step2.cooking.voiceTasks.completed');
      }
    }
    switch (step2State) {
      case 'summary': return t('step2.summary.guide');
      case 'ingredients': return t('step2.ingredients.guide');
      case 'steps': return t('step2.steps.guide');
      // cooking 상태는 위에서 처리됨
    }
  }, [step2State, voiceTaskState, t]);

  // 다음 상태로 이동
  const moveToNextState = useCallback(() => {
    if (isTransitioningRef.current) return;
    triggerHaptic();
    track(AMPLITUDE_EVENT.ONBOARDING_STEP_COMPLETE, {
      step: currentStep,
      step_count: 3,
      sub_step: step2State,
      voice_method: 'manual_click',
    });

    setPrevStep2State(step2State);
    if (currentIndex < STEP_ORDER.length - 1) {
      setStep2State(STEP_ORDER[currentIndex + 1]);
    } else {
      isTransitioningRef.current = true;
      nextStep();
    }
  }, [currentIndex, step2State, currentStep, nextStep, triggerHaptic]);

  // 이전 상태로 이동
  const moveToPrevState = useCallback(() => {
    isTransitioningRef.current = false;
    setPrevStep2State(step2State);
    if (currentIndex > 0) {
      setStep2State(STEP_ORDER[currentIndex - 1]);
    } else {
      prevStep();
    }
  }, [currentIndex, step2State, prevStep]);

  // 음성 인식 핸들러 (2단계 과제 시스템)
  const handleIntentRecognized = useCallback((intent: BasicIntent) => {
    console.log('[OnboardingStep2] Intent recognized:', intent, 'current task:', voiceTaskState);

    // VIDEO PLAY 인식 (1단계 과제)
    if (intent === 'VIDEO PLAY' && voiceTaskState === 'play_video' && !completedTasks.playVideo) {
      triggerHaptic();
      setCompletedTasks(prev => ({ ...prev, playVideo: true }));
      setVoiceTaskState('next_step');
      setVoiceStatus('recognized');

      track(AMPLITUDE_EVENT.ONBOARDING_STEP_COMPLETE, {
        step: currentStep,
        step_count: 3,
        sub_step: 'voice_task_play_video',
        voice_method: 'voice',
      });

      // 인식 성공 상태를 잠시 보여주다가 다음 대기 상태로
      timerRef.current = setTimeout(() => {
        setVoiceStatus('idle');
      }, TIMING.VOICE_SUCCESS_DELAY_MS);
      return;
    }

    // NEXT 인식 (2단계 과제)
    if (intent === 'NEXT' && voiceTaskState === 'next_step' && !completedTasks.nextStep) {
      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;
      triggerHaptic();
      setCompletedTasks(prev => ({ ...prev, nextStep: true }));
      setVoiceTaskState('completed');
      setVoiceStatus('recognized');

      track(AMPLITUDE_EVENT.ONBOARDING_STEP_COMPLETE, {
        step: currentStep,
        step_count: 3,
        sub_step: 'voice_task_next_step',
        voice_method: 'voice',
      });

      // 두 과제 완료 후 다음 스텝으로 이동
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        track(AMPLITUDE_EVENT.ONBOARDING_STEP_COMPLETE, {
          step: currentStep,
          step_count: 3,
          sub_step: step2State,
          voice_method: 'voice',
        });
        nextStep();
      }, TIMING.VOICE_SUCCESS_DELAY_MS);
      return;
    }

    // 이미 완료된 과제를 다시 말한 경우
    if ((intent === 'VIDEO PLAY' && completedTasks.playVideo) ||
        (intent === 'NEXT' && completedTasks.nextStep)) {
      setVoiceStatus('recognized');
      timerRef.current = setTimeout(() => {
        setVoiceStatus('idle');
      }, 1000);
      return;
    }
  }, [voiceTaskState, completedTasks, currentStep, nextStep, triggerHaptic]);

  // 음성 인식 실패 시 처리
  const handleVoiceError = useCallback(() => {
    setVoiceStatus('failed');
  }, []);

  const isCookingState = step2State === 'cooking';

  // alt 텍스트 가져오기
  const getAltText = useCallback((state: Step2State): string => {
    return t(STEP_ALT_KEYS[state]);
  }, [t]);

  // 쿠킹 상태에서 하단 네비게이션 가운데에 표시할 마이크 UI
  const micBottomCenter = isCookingState ? (
    <div className="flex flex-col items-center gap-1 w-full">
      {/* 음성 상태 텍스트 — failed 시에도 idle 텍스트 유지 (온보딩에서 부정적 메시지 최소화) */}
      <p className={cn(
        "text-sm font-medium h-5 leading-5 whitespace-nowrap",
        !micActivated ? "text-gray-500" :
        isListening ? "text-blue-600 animate-pulse" :
        voiceStatus === 'recognized' ? "text-green-600" :
        "text-gray-500"
      )}>
        {!micActivated ? t('step2.cooking.tapToStart') :
         isListening ? t('step2.cooking.listening') :
         voiceStatus === 'recognized' ? t('step2.cooking.recognized') :
         voiceTaskState === 'play_video' ? t('step2.cooking.micStatus.playVideoPrompt') :
         voiceTaskState === 'next_step' ? t('step2.cooking.micStatus.nextStepPrompt') :
         t('step2.cooking.recognized')}
      </p>

      {/* 마이크 버튼 */}
      <div className="relative">
        {micActivated && isListening && shouldAnimate && (
          <div className="absolute inset-0 bg-orange-500/40 rounded-full animate-ping" />
        )}
        <OnboardingMicButton
          enabled={micActivated}
          onActivate={() => setMicActivated(true)}
          onNext={() => { /* No-op: onIntentRecognized으로 처리 */ }}
          onError={handleVoiceError}
          onListeningChange={setIsListening}
          onIntentRecognized={handleIntentRecognized}
        />
      </div>

      {/* 음성 실패 시 터치 대안 (마이크 활성화 후에만) */}
      {micActivated && voiceStatus === 'failed' && (
        <button
          onClick={moveToNextState}
          className="text-[10px] text-gray-500 hover:text-orange-600 underline"
        >
          {t('step2.cooking.fallback')}
        </button>
      )}
    </div>
  ) : undefined;

  return (
    <StepContainer
      currentStep={currentStep}
      onNext={moveToNextState}
      onPrev={moveToPrevState}
      onSkip={handleSkip}
      innerStateIndex={currentIndex}
      hideNextButton={isCookingState}
      bottomCenter={micBottomCenter}
    >
      <div className="w-full flex-1 flex flex-col items-center justify-center gap-2 min-h-0">
        {/* Section Label */}
        <span className="text-[11px] font-semibold text-orange-500 tracking-wide">
          STEP 2 · {t('step2.sectionLabel')}
        </span>

        {/* Title */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`title-${step2State}`}
            variants={slideXVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            custom={{ direction, shouldAnimate }}
            transition={transitionConfig}
            className="flex items-center justify-center gap-1.5"
          >
            <h1 className="text-lg lg:text-xl font-bold text-gray-900 text-center px-4">
              {title}
            </h1>
            {isCookingState && <HandsFreeModeTooltipCompact />}
          </motion.div>
        </AnimatePresence>

        {/* Subtitle - cooking 모드에서는 완료 표시와 함께 표시 */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`subtitle-${step2State}-${voiceTaskState}`}
            variants={slideXVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            custom={{ direction, shouldAnimate }}
            transition={transitionConfig}
            className="flex items-center gap-2"
          >
            <p className="text-sm text-gray-600 text-center px-4">
              {subtitle}
            </p>
            {/* 완료 체크 표시들 */}
            {isCookingState && (
              <div className="flex items-center gap-2">
                {completedTasks.playVideo && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-1 text-green-600 text-sm font-medium"
                  >
                    <CheckIcon />
                    <span>{t('step2.cooking.voiceTasks.playVideoLabel')}</span>
                  </motion.span>
                )}
                {completedTasks.nextStep && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-1 text-green-600 text-sm font-medium"
                  >
                    <CheckIcon />
                    <span>{t('step2.cooking.voiceTasks.nextStepLabel')}</span>
                  </motion.span>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Image Area - cooking 상태에서는 음성으로만 진행 */}
        <motion.div
          onClick={isCookingState ? undefined : moveToNextState}
          whileHover={shouldAnimate && !isCookingState ? { scale: 1.02 } : undefined}
          whileTap={shouldAnimate && !isCookingState ? { scale: 0.96 } : undefined}
          role={isCookingState ? "img" : "button"}
          tabIndex={isCookingState ? undefined : 0}
          className={cn(
            "relative rounded-2xl transition-transform focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 flex-1 min-h-0",
            isCookingState ? "cursor-default" : "cursor-pointer"
          )}
          style={{
            width: PREVIEW_BUTTON.WIDTH,
            maxHeight: isCookingState ? PREVIEW_BUTTON.HEIGHT_COOKING : PREVIEW_BUTTON.HEIGHT_NORMAL,
            pointerEvents: isCookingState ? 'none' : 'auto',
          }}
          aria-label={`${getAltText(step2State)}. ${isCookingState ? t('step2.aria.voiceNavigate') : t('step1.aria.touchToNext')}`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step2State}
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
                src={STEP_IMAGES[step2State]}
                alt={getAltText(step2State)}
                fill
                className="object-contain"
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* 터치 안내 - cooking 상태가 아닐 때만 */}
        {!isCookingState && (
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <span>{t('step2.touchHint')}</span>
            <span aria-hidden="true">→</span>
          </p>
        )}
      </div>
    </StepContainer>
  );
}
