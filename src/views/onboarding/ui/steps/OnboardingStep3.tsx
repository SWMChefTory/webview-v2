import { useOnboardingTranslation } from "../../hooks/useOnboardingTranslation";
import { StepContainer } from "../components/StepContainer";
import { useOnboardingStore } from "../../stores/useOnboardingStore";
import { useOnboardingNavigation } from "../../hooks/useOnboardingNavigation";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { useRouter } from "next/router";
import { motion, useReducedMotion } from "motion/react";
import { useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

// 인기 레시피 API
import { useFetchPopularRecipe } from "@/src/entities/popular-recipe/model/usePopularRecipe";
import { VideoType } from "@/src/entities/recommend-recipe/type/videoType";

// 애니메이션 variants
const fadeInUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const cardScaleVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

// 스켈레톤 로딩 컴포넌트
const RecipeCardSkeleton = () => (
  <div className="relative aspect-[4/3] rounded-lg bg-gray-200 animate-pulse">
    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
  </div>
);

export function OnboardingStep3() {
  const { t } = useOnboardingTranslation();
  const { completeOnboarding } = useOnboardingStore();
  const { currentStep } = useOnboardingNavigation();
  const router = useRouter();

  // 접근성: reduced-motion 체크
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  // 인기 레시피 데이터 (실제 API)
  const { data: popularRecipes = [] } = useFetchPopularRecipe('NORMAL' as VideoType);

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

  // 요리 모드 시작 (메인 CTA)
  const handleStartCooking = useCallback(() => {
    track(AMPLITUDE_EVENT.ONBOARDING_COMPLETE, { type: 'start_cooking' });
    handleFinish();
  }, [handleFinish]);

  // 둘러보기
  const handleExplore = useCallback(() => {
    track(AMPLITUDE_EVENT.ONBOARDING_COMPLETE, { type: 'explore' });
    handleFinish();
  }, [handleFinish]);

  return (
    <StepContainer
      currentStep={currentStep}
      onNext={() => {}} // Custom handling in button
      onPrev={() => {}}
      onSkip={handleExplore}
    >
      <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-3 px-2">

        {/* Tory Character - Main Hero */}
        <motion.div
          className="relative"
          animate={shouldAnimate ? {
            y: [0, -12, 0],
            rotate: [0, 3, -3, 0],
          } : undefined}
          transition={shouldAnimate ? {
            duration: 4,
            repeat: Infinity,
            ease: [0.25, 0.1, 0.25, 1],
          } : undefined}
        >
          <motion.div
            animate={shouldAnimate ? {
              scale: [1, 1.1, 1],
            } : undefined}
            transition={shouldAnimate ? {
              duration: 2,
              repeat: Infinity,
              ease: [0.25, 0.1, 0.25, 1],
            } : undefined}
            className="absolute inset-0 bg-orange-400/20 rounded-full blur-2xl"
          />
          <Image
            src="/images/onboarding/tory-cooking.png"
            alt="Tory cooking character"
            width={180}
            height={180}
            className="relative z-10 drop-shadow-xl"
            priority
          />
        </motion.div>

        {/* Success Emoji - Subtle */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.1
          }}
          className="text-4xl"
        >
          🎉
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={fadeInUpVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-gray-900 text-center"
        >
          {t('step3.title')}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeInUpVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="text-sm text-gray-600 text-center px-4"
        >
          {t('step3.subtitle')}
        </motion.p>

        {/* 100 Berries Promotion Badge */}
        <motion.div
          variants={fadeInUpVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full border border-amber-300"
        >
          <span className="text-xl">🎁</span>
          <span className="text-sm font-semibold text-amber-800">100 베리를 드려요!</span>
        </motion.div>

        {/* Primary CTA: Start Cooking Mode */}
        <motion.button
          variants={fadeInUpVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
          onClick={handleStartCooking}
          className="w-full max-w-[280px] py-4 rounded-2xl font-bold text-white text-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          aria-label="요리 모드를 시작하고 홈으로 이동"
        >
          <span aria-hidden="true">🍳</span>
          <span>요리 모드 시작</span>
        </motion.button>

        {/* Divider */}
        <motion.div
          variants={fadeInUpVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
          className="flex items-center w-full gap-3"
        >
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">또는</span>
          <div className="flex-1 h-px bg-gray-200" />
        </motion.div>

        {/* Popular Recipes Section */}
        <motion.div
          variants={fadeInUpVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.7 }}
          className="w-full"
        >
          <p className="text-xs text-gray-500 mb-3 text-center">인기 레시피</p>

          {/* Recipe Cards Grid */}
          <div className="grid grid-cols-3 gap-2 mb-3" role="list" aria-label="인기 레시피 목록">
            {popularRecipes.length === 0 ? (
              // Fallback: 로딩 스켈레톤
              <>
                <RecipeCardSkeleton />
                <RecipeCardSkeleton />
                <RecipeCardSkeleton />
              </>
            ) : (
              popularRecipes.slice(0, 3).map((recipe, index) => (
                <motion.button
                  key={recipe.recipeId}
                  role="listitem"
                  variants={cardScaleVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.8 + index * 0.1 }}
                  onClick={() => handleRecipeSelect(recipe.recipeId, recipe.recipeTitle)}
                  className="relative aspect-[4/3] rounded-lg overflow-hidden border border-gray-200 hover:border-orange-400 hover:shadow-md transition-all focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                  aria-label={`레시피: ${recipe.recipeTitle}, 선택하여 시작`}
                >
                  <img
                    src={recipe.videoThumbnailUrl}
                    alt={recipe.recipeTitle}
                    className="w-full h-full object-cover"
                  />
                  {/* Dark overlay for text readability */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                  {/* Recipe title overlay */}
                  <div className="absolute bottom-1 left-1 right-1">
                    <p className="text-[10px] text-white font-medium line-clamp-1 text-center">
                      {recipe.recipeTitle}
                    </p>
                  </div>
                </motion.button>
              ))
            )}
          </div>

          {/* More Recipes Link */}
          <Link
            href="/popular-recipe"
            onClick={() => {
              track(AMPLITUDE_EVENT.ONBOARDING_COMPLETE, { type: 'explore_more' });
              completeOnboarding();
            }}
            className="flex items-center justify-center gap-1 text-xs text-orange-600 hover:text-orange-700 font-medium transition-colors focus-visible:underline focus-visible:underline-offset-2"
            aria-label="인기 레시피 더보기 페이지로 이동"
          >
            <span>인기 레시피 더보기</span>
            <span aria-hidden="true">→</span>
          </Link>
        </motion.div>

      </div>
    </StepContainer>
  );
}
