import { useFetchRecommendRecipes } from "@/src/entities/recommend-recipe/model/useRecommendRecipe";
import { RecommendType } from "@/src/entities/recommend-recipe/type/recommendType";
import { VideoType } from "@/src/entities/recommend-recipe/type/videoType";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { RecipeCardWrapper } from "../../../widgets/recipe-creating-modal/recipeCardWrapper";
import { ViewMoreCard } from "@/src/shared/ui/card";
import {
  PopularRecipesTitleReady,
  RecipeCardReady,
  RecipeCardSkeleton,
} from "./popularRecipes.common";

export function PopularRecipesDesktop() {
  return (
    <PopularRecipesTemplateDesktop
      title={<PopularRecipesTitleReady />}
      recipeSection={
        <SSRSuspense fallback={<RecipeCardSectionSkeleton />}>
          <RecipeCardSectionReady />
        </SSRSuspense>
      }
    />
  );
}

const PopularRecipesTemplateDesktop = ({
  title,
  recipeSection,
}: {
  title: React.ReactNode;
  recipeSection: React.ReactNode;
}) => {
  return (
    <div>
      <div className="h-6" />
      <div className="px-8">{title}</div>
      <div className="h-6" />
      <div className="px-8">{recipeSection}</div>
    </div>
  );
};

function RecipeCardSectionReady() {
  const { entities: recipes } = useFetchRecommendRecipes({
    recommendType: RecommendType.POPULAR,
    videoType: VideoType.NORMAL,
  });

  return (
    <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
      {recipes.slice(0, 5).map((recipe) => (
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
      <ViewMoreCard href="/recommend?recipeType=POPULAR&videoType=NORMAL" />
    </div>
  );
}

function RecipeCardSectionSkeleton() {
  return (
    <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
      {Array.from({ length: 5 }, (_, index) => (
        <RecipeCardSkeleton key={index} isTablet={true} />
      ))}
    </div>
  );
}
