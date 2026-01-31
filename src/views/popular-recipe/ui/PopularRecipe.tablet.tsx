import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { RecipeCardWrapper } from "@/src/widgets/recipe-creating-modal/recipeCardWrapper";
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

export function PopularRecipeTablet() {
  const props = usePopularRecipeController("tablet");
  return <PopularRecipeTabletLayout {...props} />;
}

function PopularRecipeTabletLayout({ title, renderToast }: PopularRecipePageProps) {
  return (
    <div className="w-full max-w-[1024px] mx-auto px-8">
      <div className="h-10" />
      <div className="text-4xl font-bold text-gray-900 tracking-tight">{title}</div>
      <div className="h-10" />
      <SSRSuspense fallback={<PopularRecipesSkeleton />}>
        <PopularRecipesContent renderToast={renderToast} />
      </SSRSuspense>
    </div>
  );
}

function PopularRecipesContent({
  renderToast,
}: Pick<PopularRecipeContentProps, "renderToast">) {
  const { recipes, isFetchingNextPage, loadMoreRef } = usePopularRecipeContent("tablet");

  return (
    <div className="pb-16">
      <div className="grid grid-cols-3 gap-8 min-h-[50vh]">
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
            trigger={<PopularRecipeCard recipe={recipe} isTablet />}
          />
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
      {renderToast("fixed right-6 top-2 z-1000 w-[360px]")}
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
