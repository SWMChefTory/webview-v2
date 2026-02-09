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

export function PopularRecipeDesktop() {
  const props = usePopularRecipeController("desktop");
  return <PopularRecipeDesktopLayout {...props} />;
}

function PopularRecipeDesktopLayout({ title, renderToast }: PopularRecipePageProps) {
  return (
    <div className="w-full max-w-[1600px] mx-auto px-8">
      <div className="h-12" />
      <div className="text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">{title}</div>
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
  const { recipes, isFetchingNextPage, loadMoreRef } = usePopularRecipeContent("desktop");

  return (
    <div className="pb-16">
      <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 lg:gap-8 min-h-[50vh]">
        {recipes.map((recipe) => (
          <div key={recipe.recipeId} className="transition-transform duration-300 hover:scale-[1.02] hover:z-10 origin-bottom">
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
          </div>
        ))}
        {isFetchingNextPage && (
          <>
            <PopularRecipeCardSkeleton isTablet />
            <PopularRecipeCardSkeleton isTablet />
            <PopularRecipeCardSkeleton isTablet />
            <PopularRecipeCardSkeleton isTablet />
            <PopularRecipeCardSkeleton isTablet />
          </>
        )}
      </div>
      <div ref={loadMoreRef} className="h-10 w-full" />
      {renderToast("fixed right-8 top-4 z-1000 w-[400px]")}
    </div>
  );
}

function PopularRecipesSkeleton() {
  return (
    <div className="pb-12">
      <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8 min-h-[50vh]">
        {Array.from({ length: 15 }).map((_, index) => (
          <PopularRecipeCardSkeleton key={index} isTablet />
        ))}
      </div>
    </div>
  );
}
