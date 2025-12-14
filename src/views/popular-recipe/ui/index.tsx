import { VideoType } from "@/src/entities/popular-recipe/type/videoType";
import {
  PopularRecipe,
  useFecthPopularRecipe,
} from "@/src/entities/popular-recipe/model/usePopularRecipe";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import TextSkeleton from "@/src/shared/ui/skeleton/text";
import { Skeleton } from "@/components/ui/skeleton";
import { AlreadyEnrolledChip } from "@/src/shared/ui/chip/recipeCreatingStatusChip";
import { RecipeCardWrapper } from "@/src/widgets/recipe-create-dialog/recipeCardWrapper";
import { RecipeCreateToast } from "@/src/entities/user-recipe/ui/toast";
import { Viewport } from "@radix-ui/react-toast";
import { useTranslation } from "next-i18next";

function PopularRecipeContent() {
  const {t} = useTranslation("popular-recipe");
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
      onScroll={(event: any) => {
        if (
          event.target.scrollTop + event.target.clientHeight >=
          event.target.scrollHeight + 10
        ) {
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
            recipe={recipe}
            trigger={<PopularRecipeCard recipe={recipe} />}
          />
        ))}
        {isFetchingNextPage && <PopularRecipesSkeleton />}
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
          <PopularRecipeCard key={index} />
        ))}
      </div>
    </div>
  );
}

function PopularRecipeCard({ recipe }: { recipe?: PopularRecipe }) {
  return (
    <div className="relative aspect-[16/9]">
      {recipe ? (
        <>
          <div className="absolute top-1 left-1">
            <AlreadyEnrolledChip isEnrolled={recipe.isViewed} />
          </div>
          <img
            src={recipe.videoThumbnailUrl}
            alt="popular-recipe"
            className="w-full h-full object-cover rounded-md"
          />
        </>
      ) : (
        <Skeleton className="w-full h-full rounded-md" />
      )}
      <div className="h-1" />
      <div className="relative ">
        <div className="absolute top-0 left-0 text font-medium line-clamp-2 w-full ">
          {recipe ? (
            recipe.recipeTitle
          ) : (
            <div className="flex flex-col w-full">
              <TextSkeleton />
              <TextSkeleton />
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <div className="text-sm invisible">temp text</div>
          <div className="text-sm invisible">temp text</div>
        </div>
      </div>
      <div className="h-6" />
    </div>
  );
}

export default PopularRecipeContent;
