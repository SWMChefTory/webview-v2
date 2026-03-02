import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { RecipeCardWrapper } from "@/src/widgets/recipe-creating-modal/recipeCardWrapper";
import { VideoTypeQuery } from "@/src/entities/recipe-searched";
import {
  PopularRecipeCard,
  PopularRecipeCardSkeleton,
} from "@/src/views/popular-recipe/ui/components/PopularRecipeCard";
import {
  usePopularRecipeController,
  usePopularRecipeContent,
  PopularRecipePageProps,
  PopularRecipeContentProps,
} from "./PopularRecipe.controller";
import { VideoType } from "@/src/entities/schema";
import { useRecipeTracking } from "@/src/shared/tracking";

export function PopularRecipeTablet() {
  const props = usePopularRecipeController("tablet");
  return <PopularRecipeTabletLayout {...props} />;
}

function PopularRecipeTabletLayout({ title }: PopularRecipePageProps) {
  return (
    <div className="w-full max-w-[1024px] mx-auto px-8">
      <div className="h-10" />
      <div className="text-4xl font-bold text-gray-900 tracking-tight">{title}</div>
      <div className="h-10" />
      <SSRSuspense fallback={<PopularRecipesSkeleton />}>
        <PopularRecipesContent />
      </SSRSuspense>
    </div>
  );
}

function PopularRecipesContent() {
  const { recipes, isFetchingNextPage, loadMoreRef } = usePopularRecipeContent("tablet");
  const { observeRef, trackClick } = useRecipeTracking('POPULAR_RECIPES');

  return (
    <div className="pb-16">
      <div className="grid grid-cols-3 gap-8 min-h-[50vh]">
        {recipes.map((recipe, index) => (
          <div key={recipe.recipeId} ref={(el) => observeRef(el, recipe.recipeId, index)}>
            <RecipeCardWrapper
              recipeId={recipe.recipeId}
              recipeCreditCost={recipe.creditCost}
              recipeTitle={recipe.recipeTitle}
              recipeIsViewed={recipe.isViewed}
              recipeVideoType={
                recipe.videoInfo.videoType === "SHORTS" ? VideoType.SHORTS : VideoType.NORMAL
              }
              recipeVideoUrl={`https://www.youtube.com/watch?v=${recipe.videoInfo.videoId}`}
              entryPoint="popular_normal"
              videoId={recipe.videoInfo.videoId}
              description={recipe.detailMeta.description}
              servings={recipe.detailMeta.servings}
              cookingTime={recipe.detailMeta.cookingTime}
              onTrackClick={() => trackClick(recipe.recipeId, index)}
              trigger={<PopularRecipeCard recipe={recipe} isTablet />}
            />
          </div>
        ))}
        {isFetchingNextPage && (
          <>
            <PopularRecipeCardSkeleton isTablet />
            <PopularRecipeCardSkeleton isTablet />
            <PopularRecipeCardSkeleton isTablet />
          </>
        )}
      </div>
      <div ref={loadMoreRef} className="h-24 w-full" />
    </div>
  );
}

function PopularRecipesSkeleton() {
  return (
    <div className="pb-8">
      <div className="grid grid-cols-3 gap-6 min-h-[50vh]">
        {Array.from({ length: 15 }).map((_, index) => (
          <PopularRecipeCardSkeleton key={index} isTablet />
        ))}
      </div>
    </div>
  );
}
