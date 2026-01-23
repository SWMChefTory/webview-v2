import { useFecthPopularRecipe } from "@/src/entities/popular-recipe/model/usePopularRecipe";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { VideoType } from "@/src/entities/popular-recipe/type/videoType";
import { RecipeCardWrapper } from "../../../widgets/recipe-create-dialog/recipeCardWrapper";
import {
  PopularRecipesTitleReady,
  RecipeCardReady,
  RecipeCardSkeleton,
} from "./popularRecipes.common";
import { HorizontalScrollAreaTablet } from "./horizontalScrollAreaTablet";

/**
 * PopularRecipes 섹션 - 태블릿 버전 (768px ~)
 *
 * 특징:
 * - 레시피 목록: 가로 스크롤 + 더보기 링크
 * - 더보기: /popular-recipe 페이지로 이동
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
      <div className="h-4 xl:h-6" />
      <div className="px-6 xl:px-8">{title}</div>
      <div className="h-4 xl:h-6" />
      {recipeSection}
    </div>
  );
};

/**
 * 레시피 목록 섹션 (태블릿)
 * 가로 스크롤 + 더보기 링크
 */
function RecipeCardSectionReady() {
  const { data: recipes } = useFecthPopularRecipe(VideoType.NORMAL);

  return (
    <HorizontalScrollAreaTablet moreLink="/popular-recipe" gap="gap-5">
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
          trigger={<RecipeCardReady recipe={recipe} isTablet={true} />}
        />
      ))}
    </HorizontalScrollAreaTablet>
  );
}

/**
 * 로딩 Skeleton (태블릿)
 */
function RecipeCardSectionSkeleton() {
  return (
    <HorizontalScrollAreaTablet gap="gap-5">
      {Array.from({ length: 6 }, (_, index) => (
        <RecipeCardSkeleton key={index} isTablet={true} />
      ))}
    </HorizontalScrollAreaTablet>
  );
}
