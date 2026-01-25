import { useFetchPopularRecipe } from "@/src/entities/popular-recipe/model/usePopularRecipe";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { VideoType } from "@/src/entities/popular-recipe/type/videoType";
import { RecipeCardWrapper } from "../../../widgets/recipe-create-dialog/recipeCardWrapper";
import {
  PopularShortsRecipesTitleReady,
  ShortsRecipeCardReady,
  ShortsRecipeCardSkeleton,
} from "./popularShortsRecipes.common";
import { HorizontalScrollAreaDesktop } from "./horizontalScrollArea.desktop";

export function PopularShortsRecipesDesktop() {
  return (
    <PopularShortsRecipesTemplateDesktop
      title={<PopularShortsRecipesTitleReady />}
      recipeSection={
        <SSRSuspense fallback={<ShortPopularRecipesSectionSkeleton />}>
          <ShortPopularRecipesSectionReady />
        </SSRSuspense>
      }
    />
  );
}

const PopularShortsRecipesTemplateDesktop = ({
  title,
  recipeSection,
}: {
  title: React.ReactNode;
  recipeSection: React.ReactNode;
}) => {
  return (
    <div>
      <div className="h-8" />
      <div className="px-8">{title}</div>
      <div className="h-6" />
      <div className="px-8">{recipeSection}</div>
    </div>
  );
};

const ShortPopularRecipesSectionReady = () => {
  const { data: recipes } = useFetchPopularRecipe(VideoType.SHORTS);

  return (
    <HorizontalScrollAreaDesktop gap="gap-6" aspectRatio="aspect-[9/16]">
      {recipes.slice(0, 6).map((recipe) => (
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
    </HorizontalScrollAreaDesktop>
  );
};

const ShortPopularRecipesSectionSkeleton = () => {
  return (
    <HorizontalScrollAreaDesktop gap="gap-6" aspectRatio="aspect-[9/16]">
      {Array.from({ length: 6 }, (_, index) => (
        <ShortsRecipeCardSkeleton key={index} isTablet={true} />
      ))}
    </HorizontalScrollAreaDesktop>
  );
};
