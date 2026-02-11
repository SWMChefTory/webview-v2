import { useOnboardingTranslation } from "../../hooks/useOnboardingTranslation";
import { StepContainer } from "../components/StepContainer";
import { useOnboardingStore } from "../../stores/useOnboardingStore";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { getOnboardingDuration } from "../OnboardingPage.controller";
import { motion, useReducedMotion } from "motion/react";
import { useCallback } from "react";
import Image from "next/image";
import { fadeInUpVariants } from "../shared/animations";
import { TORY_IMAGE } from "../shared/constants";

// 인기 레시피 API (recommend-recipe 엔티티의 POPULAR 타입 사용)
import {
  useFetchRecommendRecipes,
  RecommendType,
  VideoType,
} from "@/src/entities/recommend-recipe";

// 튜토리얼 완료 API
import { completeTutorial } from "@/src/entities/user";
import { BALANCE_QUERY_KEY } from "@/src/entities/balance";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";

// 스켈레톤 로딩 컴포넌트
const RecipeCardSkeleton = () => (
  <div className="flex flex-col">
    <div className="aspect-video rounded-md bg-gray-200 animate-pulse" />
    <div className="mt-2 h-3 w-[80%] bg-gray-200 rounded animate-pulse" />
    <div className="mt-1 h-3 w-[50%] bg-gray-200 rounded animate-pulse" />
  </div>
);

const noop = () => {};

export function OnboardingStep3() {
  const { t } = useOnboardingTranslation();
  const { currentStep, completeOnboarding, prevStep, voice_tasks_completed } = useOnboardingStore();
  const queryClient = useQueryClient();

  // 접근성: reduced-motion 체크
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  // 인기 레시피 데이터 (실제 API)
  const { entities: popularRecipes = [] } = useFetchRecommendRecipes({
    recommendType: RecommendType.POPULAR,
    videoType: VideoType.NORMAL,
  });

  // 온보딩 완료 (index.tsx의 useEffect가 redirectPath로 리다이렉트)
  // API 실패해도 온보딩은 항상 완료 — 사용자가 화면에 갇히지 않도록
  const handleComplete = useCallback(async (
    exit_type: string,
    redirectPath?: string,
  ) => {
    let isFirstComplete = false;

    try {
      // 튜토리얼 완료 API 호출: true=첫 완료(크레딧 지급), false=이미 완료
      isFirstComplete = await completeTutorial();

      if (isFirstComplete) {
        // 첫 완료: 밸런스 갱신 + 축하 토스트
        queryClient.invalidateQueries({ queryKey: [BALANCE_QUERY_KEY] });
        toast.success(t('step3.berryGranted'), { duration: 3000 });
      }
    } catch (error) {
      // 튜토리얼 API 실패해도 온보딩은 진행 (크레딧만 미지급)
      console.error('Tutorial API failed:', error);
      if (isAxiosError(error)) {
        console.error('Tutorial API error detail:', {
          status: error.response?.status,
          data: error.response?.data,
          errorCode: error.response?.data?.errorCode,
        });
      }
    }

    // 트래킹 및 상태 변경 — 단순화된 3개 핵심 속성
    track(AMPLITUDE_EVENT.ONBOARDING_COMPLETE, {
      global_step: 9,                      // 항상 9 (완료 스텝)
      exit_type,                            // 'start_cooking' | 'explore' | 'explore_more'
      voice_tasks_completed,                // 음성 과제 완료 여부 (store에서 가져옴)
      duration_ms: getOnboardingDuration(), // 총 체류 시간
      isFirstComplete,                      // 첫 완료 여부 (크레딧 지급용)
    });
    completeOnboarding(redirectPath);
  }, [completeOnboarding, queryClient, t, voice_tasks_completed]);

  return (
    <StepContainer
      currentStep={currentStep}
      onNext={noop}
      onPrev={prevStep}
      onSkip={() => handleComplete('explore', '/')}
      hideSkipButton={true}
      hideNextButton={true}
    >
      <div className="w-full max-w-sm mx-auto flex-1 flex flex-col items-center gap-3 px-2 min-h-0 overflow-y-auto">

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
            alt={t('step3.alt.toryCharacter')}
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
          {t('step3.completeTitle')}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeInUpVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="text-sm text-gray-700 text-center px-4"
        >
          {t('step3.completeSubtitle')}
        </motion.p>

        {/* 30 Berries Promotion Badge */}
        <motion.div
          variants={fadeInUpVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full border border-amber-300"
        >
          <span className="text-xl" aria-hidden="true">🎁</span>
          <span className="text-sm font-semibold text-amber-800">{t('step3.rewardBadge')}</span>
        </motion.div>

        {/* Primary CTA: Start Cooking Mode */}
        <motion.button
          variants={fadeInUpVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
          onClick={() => handleComplete('start_cooking', '/')}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.97 }}
          className="w-full max-w-[280px] py-4 rounded-2xl font-bold text-white text-lg bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 shadow-[0_4px_0_rgb(180,83,9),0_6px_20px_rgba(234,88,12,0.4)] hover:shadow-[0_4px_0_rgb(180,83,9),0_8px_25px_rgba(234,88,12,0.5)] active:shadow-[0_2px_0_rgb(180,83,9),0_4px_10px_rgba(234,88,12,0.3)] active:translate-y-[2px] transition-all flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 border-b-4 border-orange-700"
          aria-label={t('step3.startCookingButton')}
        >
          <span aria-hidden="true">🍳</span>
          <span>{t('step3.startCookingButton')}</span>
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
          <span className="text-xs text-gray-500">{t('step3.or')}</span>
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
          <p className="text-xs text-gray-600 mb-3 text-center">{t('step3.popularRecipes')}</p>

          {/* Recipe Cards Grid - 홈 화면 인기 레시피와 동일한 카드 스타일 */}
          <div className="grid grid-cols-3 gap-3 mb-3" role="list" aria-label={t('step3.aria.popularRecipesList')}>
            {popularRecipes.length === 0 ? (
              <>
                <RecipeCardSkeleton />
                <RecipeCardSkeleton />
                <RecipeCardSkeleton />
              </>
            ) : (
              popularRecipes.slice(0, 3).map((recipe, index) => (
                <motion.div
                  key={recipe.recipeId}
                  role="listitem"
                  variants={fadeInUpVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex flex-col cursor-pointer"
                  aria-label={t('step3.aria.recipeItem', { title: recipe.recipeTitle })}
                  onClick={() => handleComplete('recipe_detail', `/recipe/${recipe.recipeId}/detail?title=${encodeURIComponent(recipe.recipeTitle)}&videoId=${recipe.videoInfo.videoId}&description=${encodeURIComponent(recipe.detailMeta?.description ?? '')}&servings=${recipe.detailMeta?.servings ?? 0}&cookingTime=${recipe.detailMeta?.cookingTime ?? 0}`)}
                >
                  <div className="overflow-hidden relative rounded-md aspect-video">
                    <img
                      src={recipe.videoInfo.videoThumbnailUrl || ""}
                      alt={recipe.recipeTitle}
                      className="block w-full h-full object-cover"
                    />
                  </div>
                  <p className="font-semibold w-full overflow-hidden line-clamp-2 mt-2 text-gray-800 text-xs">
                    {recipe.recipeTitle}
                  </p>
                </motion.div>
              ))
            )}
          </div>

          {/* More Recipes Button */}
          <button
            onClick={() => handleComplete('explore_more', '/recommend?recipeType=POPULAR&videoType=NORMAL')}
            className="flex items-center justify-center gap-1 text-xs text-orange-600 hover:text-orange-700 font-medium transition-colors focus-visible:underline focus-visible:underline-offset-2 min-h-[44px] w-full"
            aria-label={t('step3.aria.moreRecipesPage')}
          >
            <span>{t('step3.moreRecipes')}</span>
            <span aria-hidden="true">→</span>
          </button>

          {/* Tutorial Notice */}
          <p className="text-[10px] text-gray-500 text-center mt-1">
            {t('step3.tutorialNotice')}
          </p>
        </motion.div>

      </div>
    </StepContainer>
  );
}
