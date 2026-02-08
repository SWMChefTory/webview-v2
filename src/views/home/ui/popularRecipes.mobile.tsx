import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { useFetchRecommendRecipes } from "@/src/entities/recommend-recipe/model/useRecommendRecipe";
import { RecommendType, VideoTypeQuery } from "@/src/entities/recommend-recipe";
import { VideoType } from "@/src/entities/schema";
import { RecipeCardWrapper } from "../../../widgets/recipe-creating-modal/recipeCardWrapper";
import { HorizontalScrollArea } from "./horizontalScrollArea";
import { RecipeListCardNormal } from "@/src/widgets/recipe-cards-section/RecipeCardsSection.mobile";
import {
  PopularRecipesTitleReady,
  RecipeCardReady,
  RecipeCardSkeleton,
} from "./popularRecipes.common";
import { useCallback } from "react";
import Link from "next/link";

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
    recommendType: RecommendType.POPULAR,
    videoType: VideoTypeQuery.NORMAL,
  });

  const handleReachEnd = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <HorizontalScrollArea onReachEnd={handleReachEnd}>
      {recipes.map((recipe) => (
        <Link href={{
            pathname: `/recipe/${recipe.recipeId}/detail`,
            query: {
              title: recipe.recipeTitle,
              videoId: recipe.videoInfo.videoId,
              description: recipe.detailMeta.description,
              servings: recipe.detailMeta.servings,
              cookingTime: recipe.detailMeta.cookingTime,
            },
          }} key={recipe.recipeId}>
          <RecipeCardReady
            recipe={{
              id: recipe.recipeId,
              isViewed: recipe.isViewed,
              videoThumbnailUrl: recipe.videoInfo.videoThumbnailUrl,
              recipeTitle: recipe.recipeTitle,
              isViewd: recipe.isViewed,
            }}
            isTablet={false}
          />{" "}
        </Link>
      ))}

      {isFetchingNextPage && <RecipeCardSkeleton isTablet={false} />}
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
    </HorizontalScrollArea>
  );
}
