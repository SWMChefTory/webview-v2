import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { useFetchRecommendRecipes } from "@/src/entities/recommend-recipe/model/useRecommendRecipe";
import { RecommendType, VideoTypeQuery } from "@/src/entities/recommend-recipe";
import { useRouter } from "next/router";
import { navigateToRecipeDetail } from "@/src/shared/navigation/navigateToRecipeDetail";
import { HorizontalScrollArea } from "./horizontalScrollArea";
import {
  PopularShortsRecipesTitleReady,
  ShortsRecipeCardReady,
  ShortsRecipeCardSkeleton,
} from "./popularShortsRecipes.common";
import { useCallback } from "react";
import { useRecipeTracking } from "@/src/shared/tracking";

/**
 * PopularShortsRecipes 섹션 - 모바일 버전 (0 ~ 767px)
 *
 * 특징:
 * - 레시피 목록: HorizontalScrollArea (가로 스크롤)
 * - 무한 스크롤: onReachEnd 이벤트
 * - 카드: 180x320 (세로형 Shorts)
 */
export function PopularShortsRecipesMobile() {
  return (
    <PopularShortsRecipesTemplateMobile
      title={<PopularShortsRecipesTitleReady />}
      recipeSection={
        <SSRSuspense fallback={<ShortPopularRecipesSectionSkeleton />}>
          <ShortPopularRecipesSectionReady />
        </SSRSuspense>
      }
    />
  );
}

/**
 * 모바일 레이아웃 템플릿
 */
const PopularShortsRecipesTemplateMobile = ({
  title,
  recipeSection,
}: {
  title: React.ReactNode;
  recipeSection: React.ReactNode;
}) => {
  return (
    <div>
      <div className="h-6" />
      {title}
      <div className="h-3" />
      {recipeSection}
    </div>
  );
};

/**
 * Shorts 레시피 목록 섹션
 * HorizontalScrollArea + 무한 스크롤
 */
const ShortPopularRecipesSectionReady = () => {
  const router = useRouter();
  const {
    entities: recipes,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useFetchRecommendRecipes({
    recommendType: RecommendType.POPULAR,
    videoType: VideoTypeQuery.SHORTS,
  });

  const handleReachEnd = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const { observeRef, trackClick } = useRecipeTracking('HOME_POPULAR_SHORTS');

  return (
    <HorizontalScrollArea onReachEnd={handleReachEnd}>
      {recipes.map((recipe, index) => (
        <div
          key={recipe.recipeId}
          className="cursor-pointer"
          ref={(el) => observeRef(el, recipe.recipeId, index)}
          onClick={() => {
            trackClick(recipe.recipeId, index);
            navigateToRecipeDetail(router, {
              recipeId: recipe.recipeId,
              recipeTitle: recipe.recipeTitle,
              videoId: recipe.videoInfo.videoId,
              description: recipe.detailMeta.description,
              servings: recipe.detailMeta.servings,
              cookingTime: recipe.detailMeta.cookingTime,
            });
          }}
        >
          <ShortsRecipeCardReady
            recipe={{
              id: recipe.recipeId,
              isViewed: recipe.isViewed,
              videoThumbnailUrl: recipe.videoInfo.videoThumbnailUrl,
              recipeTitle: recipe.recipeTitle,
            }}
            isTablet={false}
          />
        </div>
      ))}
      {isFetchingNextPage && <ShortsRecipeCardSkeleton isTablet={false} />}
    </HorizontalScrollArea>
  );
};

/**
 * 로딩 Skeleton
 */
const ShortPopularRecipesSectionSkeleton = () => {
  return (
    <HorizontalScrollArea>
      {Array.from({ length: 3 }).map((_, i) => (
        <ShortsRecipeCardSkeleton key={i} isTablet={false} />
      ))}
    </HorizontalScrollArea>
  );
};
