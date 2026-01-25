import { useFetchPopularRecipe } from "@/src/entities/popular-recipe/model/usePopularRecipe";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { VideoType } from "@/src/entities/popular-recipe/type/videoType";
import { RecipeCardWrapper } from "../../../widgets/recipe-create-dialog/recipeCardWrapper";
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
  const { data: recipes } = useFetchPopularRecipe(VideoType.SHORTS);

  return (
    <HorizontalScrollArea gap="gap-4">
      {recipes.map((recipe) => (
        <RecipeCardWrapper
          key={recipe.recipeId}
          recipeId={recipe.recipeId}
          recipeCreditCost={recipe.creditCost}
          recipeTitle={recipe.recipeTitle}
          recipeIsViewed={recipe.isViewed}
          recipeVideoType={recipe.videoType}
          recipeVideoUrl={recipe.videoUrl}
          entryPoint="popular_shorts"
          trigger={<ShortsRecipeCardReady recipe={recipe} isTablet={true} />}
        />
      ))}
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
