import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { useFetchRecommendRecipes } from "@/src/entities/recommend-recipe/model/useRecommendRecipe";
import { RecommendType, VideoTypeQuery } from "@/src/entities/recommend-recipe";
import { VideoType } from "@/src/entities/schema";
import { RecipeCardWrapper } from "../../../widgets/recipe-creating-modal/recipeCardWrapper";
import { useCallback } from "react";
import {
  PopularShortsRecipesTitleReady,
  ShortsRecipeCardReady,
  ShortsRecipeCardSkeleton,
} from "./popularShortsRecipes.common";
import { HorizontalScrollArea } from "./horizontalScrollArea";


/**
 * PopularShortsRecipes 섹션 - 태블릿 버전 (768px ~)
 *
 * 특징:
 * - 레시피 목록: 가로 스크롤
 * - 더보기: 없음 (별도 페이지 미존재)
 */
export function PopularShortsRecipesTablet() {
  return (
    <PopularShortsRecipesTemplateTablet
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
 * 태블릿 레이아웃 템플릿
 */
const PopularShortsRecipesTemplateTablet = ({
  title,
  recipeSection,
}: {
  title: React.ReactNode;
  recipeSection: React.ReactNode;
}) => {
  return (
    <div>
      <div className="h-8" />
      <div className="px-6 mb-6">{title}</div>
      {recipeSection}
    </div>
  );
};

/**
 * Shorts 레시피 목록 섹션 (태블릿)
 * 가로 스크롤 (더보기 없음)
 */
const ShortPopularRecipesSectionReady = () => {
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

  return (
    <HorizontalScrollArea gap="gap-4" onReachEnd={handleReachEnd}>
      {recipes.map((recipe) => (
        <RecipeCardWrapper
          key={recipe.recipeId}
          recipeId={recipe.recipeId}
          recipeCreditCost={recipe.creditCost}
          recipeTitle={recipe.recipeTitle}
          recipeIsViewed={recipe.isViewed}
          recipeVideoType={recipe.videoInfo.videoType === "SHORTS" ? VideoType.SHORTS : VideoType.NORMAL}
          recipeVideoUrl={`https://www.youtube.com/watch?v=${recipe.videoInfo.videoId}`}
          entryPoint="popular_shorts"
          videoId={recipe.videoInfo.videoId}
          description={recipe.detailMeta.description}
          servings={recipe.detailMeta.servings}
          cookingTime={recipe.detailMeta.cookingTime}
          trigger={
            <ShortsRecipeCardReady
              recipe={{
                id: recipe.recipeId,
                isViewed: recipe.isViewed,
                videoThumbnailUrl: recipe.videoInfo.videoThumbnailUrl,
                recipeTitle: recipe.recipeTitle,
              }}
              isTablet={true}
            />
          }
        />
      ))}

      {isFetchingNextPage && <ShortsRecipeCardSkeleton isTablet={true} />}
    </HorizontalScrollArea>
  );
};

/**
 * 로딩 Skeleton (태블릿)
 */
const ShortPopularRecipesSectionSkeleton = () => {
  return (
    <HorizontalScrollArea gap="gap-4">
      {Array.from({ length: 8 }, (_, index) => (
        <ShortsRecipeCardSkeleton key={index} isTablet={true} />
      ))}
    </HorizontalScrollArea>
  );
};
