import { useFetchRecommendRecipes } from "@/src/entities/recommend-recipe/model/useRecommendRecipe";
import { RecommendType, VideoTypeQuery } from "@/src/entities/recommend-recipe";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { useRouter } from "next/router";
import { navigateToRecipeDetail } from "@/src/shared/navigation/navigateToRecipeDetail";
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
  const router = useRouter();
  const { entities: recipes } = useFetchRecommendRecipes({
    recommendType: RecommendType.POPULAR,
    videoType: VideoTypeQuery.SHORTS,
  });

  return (
    <HorizontalScrollAreaDesktop gap="gap-6" aspectRatio="aspect-[9/16]">
      {recipes.slice(0, 6).map((recipe) => (
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
          <ShortsRecipeCardReady
            recipe={{
              id: recipe.recipeId,
              isViewed: recipe.isViewed,
              videoThumbnailUrl: recipe.videoInfo.videoThumbnailUrl,
              recipeTitle: recipe.recipeTitle,
            }}
            isTablet={true}
          />
        </div>
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
