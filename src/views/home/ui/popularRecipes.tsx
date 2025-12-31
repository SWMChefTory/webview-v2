import { useFecthPopularRecipe } from "@/src/entities/popular-recipe/model/usePopularRecipe";
import { Skeleton } from "@/components/ui/skeleton";
import TextSkeleton from "@/src/shared/ui/skeleton/text";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import {
  AlreadyEnrolledChip,
  CreatingStatusChip,
} from "../../../shared/ui/chip/recipeCreatingStatusChip";
import { VideoType } from "@/src/entities/popular-recipe/type/videoType";
import { RecipeCardWrapper } from "../../../widgets/recipe-create-dialog/recipeCardWrapper";
import { HorizontalScrollArea } from "./horizontalScrollArea";
import { IoChevronForwardOutline } from "react-icons/io5";
import Link from "next/link";
import { useFetchRecipeProgress } from "@/src/entities/user-recipe/model/useUserRecipe";
import { RecipeStatus } from "@/src/entities/user-recipe/type/type";
import { useHomeTranslation } from "../hooks/useHomeTranslation";
import { PopularSummaryRecipeDto } from "@/src/entities/popular-recipe/api/api";

export function PopularRecipes() {
  const { t } = useHomeTranslation();
  return (
    <div>
      <div className="h-4" />
      <Link href="/popular-recipe">
        <div className="pl-4 flex items-center">
          <div className="text-xl font-semibold">{t("popularRecipes")}</div>
          <IoChevronForwardOutline className="size-6" color="black" />
        </div>
      </Link>
      <div className="h-3" />
      <SSRSuspense fallback={<RecipeCardSectionSkeleton />}>
        <RecipeCardSectionReady />
      </SSRSuspense>
    </div>
  );
}

function RecipeCardSectionSkeleton() {
  return (
    <HorizontalScrollArea onReachEnd={() => {}}>
      {Array.from({ length: 3 }).map((_, index) => (
        <RecipeCardSkeleton key={index} />
      ))}
      <div className="flex flex-row gap-2 whitespace-normal min-w-[100.5vw]"></div>
    </HorizontalScrollArea>
  );
}

function RecipeCardSectionReady() {
  const {
    data: recipes,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useFecthPopularRecipe(VideoType.NORMAL);

  return (
    <HorizontalScrollArea
      onReachEnd={() => {
        if (hasNextPage) {
          fetchNextPage();
        }
      }}
    >
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
          trigger={<RecipeCardReady recipe={recipe} />}
        />
      ))}

      {isFetchingNextPage && <RecipeCardSkeleton />}
      <div className="flex flex-row gap-2 whitespace-normal min-w-[100.5vw]"></div>
    </HorizontalScrollArea>
  );
}

export function RecipeCardReady({
  recipe,
}: {
  recipe: PopularSummaryRecipeDto;
}) {
  const { recipeStatus } = useFetchRecipeProgress({
    recipeId: recipe.recipeId,
  });
  return (
    <div className="flex flex-col">
      <div className="flex relative flex-col w-[320px]">
        <div className="h-[180] overflow-hidden rounded-md">
          <div className="absolute top-[12] left-[12] bg-black/10 z-10 ">
            <AlreadyEnrolledChip
              isEnrolled={
                recipeStatus === RecipeStatus.SUCCESS && recipe.isViewed
              }
            />
            <CreatingStatusChip
              isInCreating={recipeStatus === RecipeStatus.IN_PROGRESS}
            />
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
