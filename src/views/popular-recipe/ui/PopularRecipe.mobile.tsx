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

export function PopularRecipeMobile() {
  const props = usePopularRecipeController("mobile");
  return <PopularRecipeMobileLayout {...props} />;
}

function PopularRecipeMobileLayout({ title}: PopularRecipePageProps) {
  return (
    <div className="px-4">
      <div className="h-4" />
      <div className="text-2xl font-semibold">{title}</div>
      <div className="h-4" />
      <SSRSuspense fallback={<PopularRecipesSkeleton />}>
        <PopularRecipesContent />
      </SSRSuspense>
    </div>
  );
}

function PopularRecipesContent() {
  const router = useRouter();
  const { recipes, isFetchingNextPage, onScroll } = usePopularRecipeContent("mobile");
  const { observeRef, trackClick } = useRecipeTracking('POPULAR_RECIPES');

  return (
    <div className="overflow-y-scroll h-[100vh] no-scrollbar" onScroll={onScroll}>
      <div className="grid grid-cols-2 gap-2 min-h-[100.5vh]">
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
            <PopularRecipeCard recipe={recipe} />
          </div>
        ))}
        {isFetchingNextPage && (
          <>
            <PopularRecipeCardSkeleton />
            <PopularRecipeCardSkeleton />
          </>
        )}
      </div>
    </div>
  );
}

function PopularRecipesSkeleton() {
  return (
    <div className="overflow-y-scroll h-[100vh] no-scrollbar">
      <div className="grid grid-cols-2 gap-2 min-h-[100.5vh]">
        {Array.from({ length: 10 }).map((_, index) => (
          <PopularRecipeCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
