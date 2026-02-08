import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { useFetchRecommendRecipes } from "@/src/entities/recommend-recipe/model/useRecommendRecipe";
import { RecommendType, VideoTypeQuery } from "@/src/entities/recommend-recipe";
import { VideoType } from "@/src/entities/schema";
import { RecipeCardWrapper } from "../../../widgets/recipe-creating-modal/recipeCardWrapper";
import { useCallback } from "react";
import {
  PopularRecipesTitleReady,
  RecipeCardReady,
  RecipeCardSkeleton,
} from "./popularRecipes.common";
import { HorizontalScrollArea } from "./horizontalScrollArea";

/**
 * PopularRecipes 섹션 - 태블릿 버전 (768px ~)
 *
 * 특징:
 * - 레시피 목록: 가로 스크롤 + 더보기 링크
 * - 더보기: /recommend?recipeType=POPULAR&videoType=NORMAL 페이지로 이동
 */
export function PopularRecipesTablet() {
  return (
    <PopularRecipesTemplateTablet
      title={<PopularRecipesTitleReady />}
      recipeSection={
        <SSRSuspense fallback={<RecipeCardSectionSkeleton />}>
          <RecipeCardSectionReady />
        </SSRSuspense>
      }
    />
  );
}

/**
 * 태블릿 레이아웃 템플릿
 */
const PopularRecipesTemplateTablet = ({
  title,
  recipeSection,
}: {
  title: React.ReactNode;
  recipeSection: React.ReactNode;
}) => {
  return (
    <div>
      <div className="px-6 mb-6">{title}</div>
      {recipeSection}
    </div>
  );
};

/**
 * 레시피 목록 섹션 (태블릿)
 * 가로 스크롤 + 더보기 링크
 */
function RecipeCardSectionReady() {
  const {
    entities: recipes,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useFetchRecommendRecipes({
    recommendType: RecommendType.POPULAR,
    videoType: VideoTypeQuery.NORMAL,
  });

  const handleReachEnd = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <HorizontalScrollArea
      moreLink="/recommend?recipeType=POPULAR&videoType=NORMAL"
      gap="gap-5"
      onReachEnd={handleReachEnd}
    >
      {recipes.map((recipe) => (
        <RecipeCardWrapper
          key={recipe.recipeId}
          recipeId={recipe.recipeId}
          recipeCreditCost={recipe.creditCost}
          recipeTitle={recipe.recipeTitle}
          recipeIsViewed={recipe.isViewed}
          recipeVideoType={
            recipe.videoInfo.videoType === "SHORTS" ? VideoType.SHORTS : VideoType.NORMAL
          }
          recipeVideoUrl={`https://www.youtube.com/watch?v=${recipe.videoInfo.videoId}`}
          entryPoint="popular_normal"
          videoId={recipe.videoInfo.videoId}
          description={recipe.detailMeta.description}
          servings={recipe.detailMeta.servings}
          cookingTime={recipe.detailMeta.cookingTime}
          trigger={
            <RecipeCardReady
              recipe={{
                id: recipe.recipeId,
                isViewed: recipe.isViewed,
                videoThumbnailUrl: recipe.videoInfo.videoThumbnailUrl,
                recipeTitle: recipe.recipeTitle,
                isViewd: recipe.isViewed,
              }}
              isTablet={true}
            />
          }
        />
      ))}

      {isFetchingNextPage && <RecipeCardSkeleton isTablet={true} />}
    </HorizontalScrollArea>
  );
}

/**
 * 로딩 Skeleton (태블릿)
 */
function RecipeCardSectionSkeleton() {
  return (
    <HorizontalScrollArea gap="gap-5">
      {Array.from({ length: 6 }, (_, index) => (
        <RecipeCardSkeleton key={index} isTablet={true} />
      ))}
    </HorizontalScrollArea>
  );
}
