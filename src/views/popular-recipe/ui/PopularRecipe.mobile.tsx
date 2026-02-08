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
import { VideoType } from "@/src/entities/schema";

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
  const { recipes, isFetchingNextPage, onScroll } = usePopularRecipeContent("mobile");

  return (
    <div className="overflow-y-scroll h-[100vh] no-scrollbar" onScroll={onScroll}>
      <div className="grid grid-cols-2 gap-2 min-h-[100.5vh]">
        {recipes.map((recipe) => (
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
            videoId={recipe.videoInfo.videoId}
            description={recipe.detailMeta.description}
            servings={recipe.detailMeta.servings}
            cookingTime={recipe.detailMeta.cookingTime}
            trigger={<PopularRecipeCard recipe={recipe} />}
          />
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
