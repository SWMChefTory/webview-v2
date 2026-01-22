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

export function PopularRecipeMobile() {
  const { t } = useTranslation("popular-recipe");

  return (
    <div className="px-4">
      <div className="h-4" />
      <div className="text-2xl font-semibold">{t("popularRecipes")}</div>
      <div className="h-4" />
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

  return (
    <div
      className="overflow-y-scroll h-[100vh] no-scrollbar"
      onScroll={(event: React.UIEvent<HTMLDivElement>) => {
        const target = event.target as HTMLDivElement;
        if (target.scrollTop + target.clientHeight >= target.scrollHeight - 10) {
          if (hasNextPage) {
            fetchNextPage();
          }
        }
      }}
    >
      <div className="grid grid-cols-2 gap-2 min-h-[100.5vh]">
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
      <RecipeCreateToast>
        <Viewport className="fixed right-3 top-2 z-1000 w-[300px]" />
      </RecipeCreateToast>
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
