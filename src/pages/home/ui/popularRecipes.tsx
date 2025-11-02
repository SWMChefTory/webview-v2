import {
  useFecthPopularRecipe,
  PopularRecipe,
} from "@/src/entities/popular-recipe/model/usePopularRecipe";
import { Skeleton } from "@/components/ui/skeleton";
import TextSkeleton from "@/src/shared/ui/skeleton/text";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { AlreadyEnrolledChip } from "../../../shared/ui/chip/chip";
import { VideoType } from "@/src/entities/popular-recipe/type/videoType";
import { RecipeCardWrapper } from "../../../widgets/recipe-create-dialog/recipeCardWrapper";
import { HorizontalScrollArea } from "./horizontalScrollArea";
import { IoChevronForwardOutline } from "react-icons/io5";
import Link from "next/link";

export function PopularRecipes() {
  const { fetchNextPage, hasNextPage } = useFecthPopularRecipe(
    VideoType.NORMAL
  );

  return (
    <div>
      <div className="h-12" />
      <Link href="/popular-recipe">
        <div className="pl-4 flex items-center">
          <div className="text-2xl font-semibold">인기 레시피</div>
          <IoChevronForwardOutline className="size-6" color="black" />
        </div>
      </Link>
      <div className="h-3" />
      <HorizontalScrollArea
        onReachEnd={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
      >
        <div className="flex flex-row gap-2 whitespace-normal min-w-[100.5vw]">
          <SSRSuspense fallback={<RecipeCardSectionSkeleton />}>
            <RecipeCardSectionReady />
          </SSRSuspense>
        </div>
      </HorizontalScrollArea>
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
  const { data: recipes, isFetchingNextPage } = useFecthPopularRecipe(
    VideoType.NORMAL
  );
  return (
    <>
      {recipes.map((recipe) => (
        <RecipeCardWrapper
          recipe={recipe}
          key={recipe.recipeId}
          trigger={<RecipeCardReady recipe={recipe} />}
        />
      ))}
      {isFetchingNextPage && <RecipeCardSkeleton />}
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
