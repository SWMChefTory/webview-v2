import { useOnboardingTranslation } from "../../hooks/useOnboardingTranslation";
import { StepContainer } from "../components/StepContainer";
import { useOnboardingStore } from "../../stores/useOnboardingStore";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { motion, useReducedMotion } from "motion/react";
import { useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { fadeInUpVariants } from "../shared/animations";
import { TORY_IMAGE } from "../shared/constants";

// 인기 레시피 API
import { useFetchPopularRecipe } from "@/src/entities/popular-recipe/model/usePopularRecipe";
import { VideoType } from "@/src/entities/recommend-recipe/type/videoType";

// 스켈레톤 로딩 컴포넌트
const RecipeCardSkeleton = () => (
  <div className="relative aspect-[4/3] rounded-lg bg-gray-200 animate-pulse">
    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
  </div>
);

const noop = () => {};

export function OnboardingStep3() {
  const { t } = useOnboardingTranslation();
  const { currentStep, completeOnboarding, prevStep } = useOnboardingStore();

  // 접근성: reduced-motion 체크
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  // 인기 레시피 데이터 (실제 API)
  const { data: popularRecipes = [] } = useFetchPopularRecipe(VideoType.NORMAL);

  // 온보딩 완료 (index.tsx의 useEffect가 '/'로 리다이렉트)
  const handleComplete = useCallback((type: string, extra?: Record<string, string>) => {
    track(AMPLITUDE_EVENT.ONBOARDING_COMPLETE, { type, ...extra });
    completeOnboarding();
  }, [completeOnboarding]);

  return (
    <StepContainer
      currentStep={currentStep}
      onNext={noop}
      onPrev={prevStep}
      onSkip={() => handleComplete('explore')}
      hideNextButton={true}
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
            alt="토리 캐릭터 - 온보딩 완료 축하"
            width={TORY_IMAGE.WIDTH}
            height={TORY_IMAGE.HEIGHT}
            className="relative z-10 drop-shadow-xl"
          />
        </motion.div>

        {/* Title - 완료! */}
        <motion.h1
          variants={fadeInUpVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-gray-900 text-center"
        >
          완료!
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeInUpVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="text-sm text-gray-700 text-center px-4"
        >
          핸즈프리 요리를 시작해보세요
        </motion.p>

        {/* 50 Berries Promotion Badge */}
        <motion.div
          variants={fadeInUpVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full border border-amber-300"
        >
          <span className="text-xl" aria-hidden="true">🎁</span>
          <span className="text-sm font-semibold text-amber-800">보상으로 50개가 지급되었습니다!</span>
        </motion.div>

        {/* Primary CTA: Start Cooking Mode */}
        <motion.button
          variants={fadeInUpVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
          onClick={() => handleComplete('start_cooking')}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.97 }}
          className="w-full max-w-[280px] py-4 rounded-2xl font-bold text-white text-lg bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 shadow-[0_4px_0_rgb(180,83,9),0_6px_20px_rgba(234,88,12,0.4)] hover:shadow-[0_4px_0_rgb(180,83,9),0_8px_25px_rgba(234,88,12,0.5)] active:shadow-[0_2px_0_rgb(180,83,9),0_4px_10px_rgba(234,88,12,0.3)] active:translate-y-[2px] transition-all flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 border-b-4 border-orange-700"
          aria-label="바로 이용해보기"
        >
          <span aria-hidden="true">🍳</span>
          <span>바로 이용해보기</span>
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
          <span className="text-xs text-gray-500">또는</span>
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
          <p className="text-xs text-gray-600 mb-3 text-center">인기 레시피</p>

          {/* Recipe Cards Grid */}
          <div className="grid grid-cols-3 gap-2 mb-3" role="list" aria-label="인기 레시피 목록">
            {popularRecipes.length === 0 ? (
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
                  variants={fadeInUpVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.8 + index * 0.1 }}
                  onClick={() => handleComplete('recipe_select', {
                    recipe_id: recipe.recipeId,
                    recipe_name: recipe.recipeTitle,
                  })}
                  className="relative aspect-[4/3] rounded-lg overflow-hidden border border-gray-200 hover:border-orange-400 hover:shadow-md transition-all focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                  aria-label={`레시피: ${recipe.recipeTitle}, 선택하여 시작`}
                >
                  <img
                    src={recipe.videoThumbnailUrl}
                    alt={recipe.recipeTitle}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
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
            className="flex items-center justify-center gap-1 text-xs text-orange-600 hover:text-orange-700 font-medium transition-colors focus-visible:underline focus-visible:underline-offset-2 min-h-[44px]"
            aria-label="인기 레시피 더보기 페이지로 이동"
          >
            <span>인기 레시피 더보기</span>
            <span aria-hidden="true">→</span>
          </Link>

          {/* Tutorial Notice */}
          <p className="text-[10px] text-gray-500 text-center mt-1">
            {t('step3.tutorialNotice')}
          </p>
        </motion.div>

      </div>
    </StepContainer>
  );
}
