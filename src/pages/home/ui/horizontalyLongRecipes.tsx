import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Fire from "./assets/fire.png";
import {
  useFecthPopularRecipe,
  PopularRecipe,
  sortByViewed,
} from "@/src/entities/popular-recipe/model/usePopularRecipe";
import { Skeleton } from "@/components/ui/skeleton";
import TextSkeleton from "@/src/shared/ui/skeleton/text";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { useCreateRecipe } from "@/src/entities/user_recipe/model/useUserRecipe";
import { AlreadyEnrolledChip } from "./chips";
import { VideoType } from "../../../entities/popular-recipe/type/videoType";
import { PopularRecipeCardWrapper } from "./popularRecipeCardDialog";

export function HorizontallyLongRecipes() {
  return (
    <div>
      <div className="h-12" />
      <div className="pl-4 flex items-center gap-2">
        <div className="text-2xl font-semibold">인기 레시피</div>
      </div>
      <div className="h-3" />
      <ScrollArea className="whitespace-nowrap w-[100vw]">
        <div className="pl-4 flex flex-row gap-2 whitespace-normal min-w-[100.5vw]">
          <SSRSuspense fallback={<RecipeCardSectionSkeleton />}>
            <RecipeCardSectionReady />
          </SSRSuspense>
        </div>
        <ScrollBar orientation="horizontal" className="opacity-0  z-10" />
      </ScrollArea>
    </div>
  );
}

function RecipeCardSectionSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <RecipeCardSkeleton key={index} />
      ))}
    </>
  );
}

function RecipeCardSectionReady() {
  const { data: recipes } = useFecthPopularRecipe();
  const longRecipes = recipes.filter(
    (recipe) => recipe.videoType === VideoType.NORMAL
  );
  const sortedRecipes = sortByViewed(longRecipes);
  return (
    <>
      {sortedRecipes.map((recipe) => (
        <PopularRecipeCardWrapper
          recipe={recipe}
          key={recipe.recipeId}
          trigger={<RecipeCardReady recipe={recipe} />}
        />
      ))}
    </>
  );
}

export function RecipeCardReady({ recipe }: { recipe: PopularRecipe }) {
  return (
    <div className="flex flex-col">
      <div className="flex relative flex-col w-[320px]">
        <div className="h-[180] overflow-hidden rounded-md">
          <div className="absolute top-[12] left-[12] bg-black/10 z-10 ">
            <AlreadyEnrolledChip isEnrolled={recipe.isViewed} />
          </div>
          <img
            src={recipe.videoThumbnailUrl}
            className="block w-full h-full object-cover "
          />
        </div>
        <div className="text-lg font-semibold w-full overflow-hidden line-clamp-2">
          {recipe.recipeTitle}
        </div>
      </div>
    </div>
  );
}

export function RecipeCardSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        <Skeleton className="w-[320] h-[180] rounded-md" />

        <div className="w-[50%]">
          <TextSkeleton fontSize="text-lg" />
        </div>
        <div className="w-[20%]">
          <TextSkeleton fontSize="text-sm" />
        </div>
      </div>
    </div>
  );
}
