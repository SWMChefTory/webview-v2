import {
  useFetchRecommendRecipes,
  RecommendType,
  VideoTypeQuery,
} from "@/src/entities/recommend-recipe";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { useRouter } from "next/router";
import { navigateToRecipeDetail } from "@/src/shared/navigation/navigateToRecipeDetail";
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
  const router = useRouter();
  const { entities: recipes } = useFetchRecommendRecipes({
    recommendType: RecommendType.POPULAR,
    videoType: VideoTypeQuery.NORMAL,
  });

  return (
    <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
      {recipes.slice(0, 5).map((recipe) => (
        <div
          key={recipe.recipeId}
          className="cursor-pointer"
          onClick={() => {
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
        </div>
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
