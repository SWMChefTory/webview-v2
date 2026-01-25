import { useFetchPopularRecipe } from "@/src/entities/popular-recipe/model/usePopularRecipe";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { VideoType } from "@/src/entities/popular-recipe/type/videoType";
import { RecipeCardWrapper } from "../../../widgets/recipe-create-dialog/recipeCardWrapper";
import { HorizontalScrollArea } from "./horizontalScrollArea";
import {
  PopularShortsRecipesTitleReady,
  ShortsRecipeCardReady,
  ShortsRecipeCardSkeleton,
} from "./popularShortsRecipes.common";

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
  const {
    data: recipes,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useFetchPopularRecipe(VideoType.SHORTS);

  return (
    <HorizontalScrollArea
      onReachEnd={() => {
        if (hasNextPage) {
          fetchNextPage();
        }
      }}
    >
      <div className="flex flex-row gap-2 whitespace-normal min-w-[100.5vw]">
        {recipes.map((recipe) => (
          <RecipeCardWrapper
            key={recipe.recipeId}
            recipeId={recipe.recipeId}
            recipeCreditCost={recipe.creditCost}
            recipeTitle={recipe.recipeTitle}
            recipeIsViewed={recipe.isViewed}
            recipeVideoType={recipe.videoType}
            recipeVideoUrl={recipe.videoUrl}
            entryPoint="popular_normal"
            trigger={<ShortsRecipeCardReady recipe={recipe} isTablet={false} />}
          />
        ))}
        {isFetchingNextPage && <ShortsRecipeCardSkeleton isTablet={false} />}
      </div>
    </HorizontalScrollArea>
  );
};

/**
 * 로딩 Skeleton
 */
const ShortPopularRecipesSectionSkeleton = () => {
  return (
    <HorizontalScrollArea>
      <div className="flex flex-row gap-2 whitespace-normal min-w-[100.5vw]">
        {Array.from({ length: 3 }).map((_, i) => (
          <ShortsRecipeCardSkeleton key={i} isTablet={false} />
        ))}
      </div>
    </HorizontalScrollArea>
  );
};
