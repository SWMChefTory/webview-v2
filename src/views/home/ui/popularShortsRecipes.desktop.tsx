import { useFetchRecommendRecipes } from "@/src/entities/recommend-recipe/model/useRecommendRecipe";
import { RecommendType, VideoTypeQuery } from "@/src/entities/recommend-recipe";
import { VideoType } from "@/src/entities/schema";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { RecipeCardWrapper } from "../../../widgets/recipe-creating-modal/recipeCardWrapper";
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
  const { entities: recipes } = useFetchRecommendRecipes({
    recommendType: RecommendType.POPULAR,
    videoType: VideoTypeQuery.SHORTS,
  });

  return (
    <HorizontalScrollAreaDesktop gap="gap-6" aspectRatio="aspect-[9/16]">
      {recipes.slice(0, 6).map((recipe) => (
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
