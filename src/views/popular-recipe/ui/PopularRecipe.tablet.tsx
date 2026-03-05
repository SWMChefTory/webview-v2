import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { useRouter } from "next/router";
import { navigateToRecipeDetail } from "@/src/shared/navigation/navigateToRecipeDetail";
import {
  PopularRecipeCard,
  PopularRecipeCardSkeleton,
} from "@/src/views/popular-recipe/ui/components/PopularRecipeCard";
import {
  usePopularRecipeController,
  usePopularRecipeContent,
  PopularRecipePageProps,
} from "./PopularRecipe.controller";
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
  const router = useRouter();
  const { recipes, isFetchingNextPage, loadMoreRef } = usePopularRecipeContent("tablet");
  const { observeRef, trackClick } = useRecipeTracking('POPULAR_RECIPES');

  return (
    <div className="pb-16">
      <div className="grid grid-cols-3 gap-8 min-h-[50vh]">
        {recipes.map((recipe, index) => (
          <div
            key={recipe.recipeId}
            className="cursor-pointer"
            ref={(el) => observeRef(el, recipe.recipeId, index)}
            onClick={() => {
              trackClick(recipe.recipeId, index);
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
            <PopularRecipeCard recipe={recipe} isTablet />
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
