import { useOnboardingTranslation } from "../../hooks/useOnboardingTranslation";
import { StepContainer } from "../components/StepContainer";
import { useOnboardingStore } from "../../stores/useOnboardingStore";
import { useOnboardingNavigation } from "../../hooks/useOnboardingNavigation";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { useRouter } from "next/router";
import { motion } from "motion/react";
import { usePreventBack } from "../../hooks/usePreventBack";
import { useState, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

// 애니메이션 variants
const successVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: { scale: 1, rotate: 0 },
};

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const cardScaleVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

// YouTube URL 검증 함수
const isValidYoutubeUrl = (url: string): boolean => {
  if (!url.trim()) return false;
  const pattern = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  return pattern.test(url);
};

// 인기 레시피 샘플 데이터 (나중에 API로 교체 가능)
const POPULAR_RECIPES = [
  {
    id: 'kimchi-stew',
    name: '김치찌개',
    emoji: 'Kimchi',
    image: '/images/onboarding/app-recipe-summary.png',
  },
  {
    id: 'pasta',
    name: '토마토 파스타',
    emoji: '🍝',
    image: '/images/onboarding/app-recipe-summary.png',
  },
  {
    id: 'fried-rice',
    name: '볶음밥',
    emoji: '🍛',
    image: '/images/onboarding/app-recipe-summary.png',
  },
];

export function OnboardingStep3() {
  const { t } = useOnboardingTranslation();
  const { completeOnboarding } = useOnboardingStore();
  const { currentStep } = useOnboardingNavigation();
  const router = useRouter();

  const [url, setUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [inputMode, setInputMode] = useState(false); // true면 URL 입력 모드

  // Prevent back button
  usePreventBack();

  // URL 유효성 검증
  const isUrlValid = useMemo(() => isValidYoutubeUrl(url), [url]);

  // 온보딩 완료 후 라우팅 처리 (통합 함수)
  const handleFinish = useCallback(() => {
    completeOnboarding();
    router.replace('/');
  }, [completeOnboarding, router]);

  // 레시피 카드 선택
  const handleRecipeSelect = useCallback((recipeId: string, recipeName: string) => {
    track(AMPLITUDE_EVENT.ONBOARDING_COMPLETE, {
      type: 'recipe_select',
      recipe_id: recipeId,
      recipe_name: recipeName,
    });
    handleFinish();
  }, [handleFinish]);

  const handleSave = async () => {
    if (!url.trim() || !isUrlValid) return;

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
           <Image
             src="/images/onboarding/app-home.png"
             alt="Home"
             width={256}
             height={256}
           />
        </div>

        {/* Success Animation */}
        <motion.div
          variants={successVariants}
          initial="hidden"
          animate="visible"
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
          variants={fadeInUpVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3"
        >
          {t('step3.title')}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeInUpVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          className="text-lg text-gray-600 mb-6 break-keep leading-relaxed"
        >
          {t('step3.subtitle')}
        </motion.p>

        {/* 레시피 선택 카드 영역 (입력 모드가 아닐 때만 표시) */}
        {!inputMode ? (
          <motion.div
            variants={fadeInUpVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
            className="w-full mb-6"
          >
            <p className="text-sm text-gray-500 mb-4">바로 시작할 수 있는 레시피</p>
            <div className="grid grid-cols-3 gap-3">
              {POPULAR_RECIPES.map((recipe, index) => (
                <motion.button
                  key={recipe.id}
                  variants={cardScaleVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.6 + index * 0.1 }}
                  onClick={() => handleRecipeSelect(recipe.id, recipe.name)}
                  className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-100 hover:border-orange-400 hover:shadow-lg transition-all group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100 group-hover:from-orange-100 group-hover:to-orange-200 transition-all" />
                  <div className="relative z-10 flex flex-col items-center justify-center h-full">
                    <span className="text-4xl mb-2">{recipe.emoji}</span>
                    <span className="text-xs font-medium text-gray-700">{recipe.name}</span>
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="px-4 text-sm text-gray-400">또는</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* YouTube 입력 모드로 전환 버튼 */}
            <motion.button
              variants={fadeInUpVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.9 }}
              onClick={() => setInputMode(true)}
              className="w-full py-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-orange-400 hover:text-orange-600 transition-all font-medium flex items-center justify-center gap-2"
            >
              <span>🔗</span>
              <span>YouTube 링크로 저장하기</span>
            </motion.button>
          </motion.div>
        ) : (
          /* URL 입력 모드 */
          <motion.div
            variants={fadeInUpVariants}
            initial="hidden"
            animate="visible"
            className="w-full mb-6"
          >
            {/* 뒤로가기 버튼 */}
            <button
              onClick={() => setInputMode(false)}
              className="mb-4 text-sm text-gray-500 hover:text-orange-600 flex items-center gap-1 mx-auto"
            >
              <span>←</span>
              <span>레시피 선택으로</span>
            </button>

            {/* Input Field */}
            <motion.div
              variants={fadeInUpVariants}
              initial="hidden"
              animate="visible"
              className="w-full mb-4 relative"
            >
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={t('step3.input.placeholder')}
                className={cn(
                  "w-full px-5 py-4 rounded-xl border transition outline-none text-gray-800 placeholder:text-gray-400 bg-gray-50/50 text-center",
                  url && !isUrlValid && "border-red-300 focus:border-red-400 focus:ring-red-200",
                  (!url || isUrlValid) && "border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                )}
                disabled={isSaving}
              />
              {/* URL 검증 피드백 */}
              {url && !isUrlValid && (
                <p className="text-xs text-red-500 mt-2">유효한 YouTube 링크를 입력해주세요</p>
              )}
            </motion.div>

            {/* Primary Button: Save */}
            <motion.button
              variants={fadeInUpVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
              onClick={handleSave}
              disabled={isSaving || !url.trim() || !isUrlValid}
              className={cn(
                "w-full py-4 rounded-2xl font-bold text-white text-lg transition-all shadow-lg flex items-center justify-center gap-2 mb-3",
                url.trim() && isUrlValid
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
          </motion.div>
        )}

        {/* Secondary Button: Explore (항상 표시) */}
        <motion.button
          variants={fadeInUpVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: inputMode ? 0.3 : 1.0 }}
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
