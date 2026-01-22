import React from "react";
import { VideoType } from "@/src/entities/popular-recipe/type/videoType";
import { useFecthPopularRecipe } from "@/src/entities/popular-recipe/model/usePopularRecipe";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { RecipeCardWrapper } from "@/src/widgets/recipe-create-dialog/recipeCardWrapper";
import { RecipeCreateToast } from "@/src/entities/user-recipe/ui/toast";
import { Viewport } from "@radix-ui/react-toast";
import { useTranslation } from "next-i18next";
import {
  PopularRecipeCard,
  PopularRecipeCardSkeleton,
} from "@/src/views/popular-recipe/ui/components/PopularRecipeCard";

export function PopularRecipeTablet() {
  const { t } = useTranslation("popular-recipe");

  return (
    <div className="w-full max-w-[1200px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-6">
      <div className="h-6" />
      <div className="text-2xl lg:text-3xl font-semibold">{t("popularRecipes")}</div>
      <div className="h-6" />
      <SSRSuspense fallback={<PopularRecipesSkeleton />}>
        <PopularRecipesReady />
      </SSRSuspense>
    </div>
  );
}

function PopularRecipesReady() {
  const {
    data: recipes,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useFecthPopularRecipe(VideoType.NORMAL);

  const observerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  return (
    <div className="pb-8">
      <div className="grid grid-cols-3 gap-6 2xl:gap-8 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 min-h-[50vh]">
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
      <div ref={observerRef} className="h-10 w-full" />
      <RecipeCreateToast>
        <Viewport className="fixed right-6 top-2 z-1000 w-[360px]" />
      </RecipeCreateToast>
    </div>
  );
}

function PopularRecipesSkeleton() {
  return (
    <div className="pb-8">
      <div className="grid grid-cols-3 gap-6 2xl:gap-8 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 min-h-[50vh]">
        {Array.from({ length: 15 }).map((_, index) => (
          <PopularRecipeCardSkeleton key={index} isTablet />
        ))}
      </div>
    </div>
  );
}
