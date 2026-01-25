import { useFetchRecommendRecipes } from "@/src/entities/recommend-recipe/model/useRecommendRecipe";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { VideoType } from "@/src/entities/recommend-recipe/type/videoType";
import { RecommendType } from "@/src/entities/recommend-recipe/type/recommendType";
import { RecipeCardWrapper } from "../../../widgets/recipe-create-dialog/recipeCardWrapper";
import { HorizontalScrollArea } from "./horizontalScrollArea";
import {
  PopularRecipesTitleReady,
  RecipeCardReady,
  RecipeCardSkeleton,
} from "./popularRecipes.common";
import { useCallback } from "react";

/**
 * PopularRecipes 섹션 - 모바일 버전 (0 ~ 767px)
 *
 * 특징:
 * - 레시피 목록: HorizontalScrollArea (가로 스크롤)
 * - 무한 스크롤: onReachEnd 이벤트
 * - 카드 width: 320px 고정
 */
export function PopularRecipesMobile() {
  return (
    <PopularRecipesTemplateMobile
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
 * 모바일 레이아웃 템플릿
 */
const PopularRecipesTemplateMobile = ({
  title,
  recipeSection,
}: {
  title: React.ReactNode;
  recipeSection: React.ReactNode;
}) => {
  return (
    <div>
      <div className="h-4" />
      {title}
      <div className="h-3" />
      {recipeSection}
    </div>
  );
};

/**
 * 레시피 목록 섹션
 * HorizontalScrollArea + 무한 스크롤
 */
function RecipeCardSectionReady() {
  const {
    entities: recipes,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useFetchRecommendRecipes({
    videoType: VideoType.NORMAL,
    recommendType: RecommendType.POPULAR,
  });

  const handleReachEnd = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <HorizontalScrollArea
      onReachEnd={handleReachEnd}
    >
      {recipes.map((recipe) => (
        <RecipeCardWrapper
          key={recipe.recipeId}
          recipeId={recipe.recipeId}
          recipeCreditCost={recipe.creditCost}
          recipeTitle={recipe.recipeTitle}
          recipeIsViewed={recipe.isViewed}
          recipeVideoType={VideoType.NORMAL}
          recipeVideoUrl={`https://www.youtube.com/watch?v=${recipe.videoInfo.videoId}`}
          entryPoint="popular_normal"
          trigger={
            <RecipeCardReady
              recipe={{
                id: recipe.recipeId,
                isViewed: recipe.isViewed,
                videoThumbnailUrl: recipe.videoInfo.videoThumbnailUrl,
                recipeTitle: recipe.videoInfo.videoTitle,
              }}
              isTablet={false}
            />
          }
        />
      ))}

      {isFetchingNextPage && <RecipeCardSkeleton isTablet={false} />}
      <div className="flex flex-row gap-2 whitespace-normal min-w-[100.5vw]"></div>
    </HorizontalScrollArea>
  );
}

/**
 * 로딩 Skeleton
 */
function RecipeCardSectionSkeleton() {
  return (
    <HorizontalScrollArea onReachEnd={() => {}}>
      {Array.from({ length: 3 }).map((_, index) => (
        <RecipeCardSkeleton key={index} isTablet={false} />
      ))}
      <div className="flex flex-row gap-2 whitespace-normal min-w-[100.5vw]"></div>
    </HorizontalScrollArea>
  );
}
