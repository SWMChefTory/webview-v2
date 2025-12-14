import Fire from "./assets/fire.png";
import {
  PopularRecipe,
  useFecthPopularRecipe,
} from "@/src/entities/popular-recipe/model/usePopularRecipe";
import { VideoType } from "@/src/entities/popular-recipe/type/videoType";
import {
  AlreadyEnrolledChip,
  CreatingStatusChip,
} from "../../../shared/ui/chip/chip";
import { RecipeCardWrapper } from "../../../widgets/recipe-create-dialog/recipeCardWrapper";
import { HorizontalScrollArea } from "./horizontalScrollArea";
import { useFetchRecipeProgress } from "@/src/entities/user_recipe/model/useUserRecipe";
import { RecipeStatus } from "@/src/entities/user_recipe/type/type";
import { Skeleton } from "@/components/ui/skeleton";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";

export function PopularShortsRecipes() {
  return (
    <div>
      <div className="h-6" />
      <div className="pl-4 flex items-center gap-2">
        <div className="text-xl font-semibold">쇼츠 인기 레시피</div>
        <img src={Fire.src} className="size-6" />
      </div>
      <div className="h-3" />
      <SSRSuspense fallback={<ShortPopularRecipesSectionSkeleton />}>
        <ShortPopularRecipesSectionReady />
      </SSRSuspense>
    </div>
  );
}

const ShortPopularRecipesSectionSkeleton = () => {
  return (
    <HorizontalScrollArea>
      <div className=" flex flex-row gap-2 whitespace-normal min-w-[100.5vw]">
        {Array.from({ length: 3 }).map((_, i) => (
          <ShortsRecipeCardSkeleton key={i} />
        ))}
      </div>
    </HorizontalScrollArea>
  );
};

const ShortPopularRecipesSectionReady = () => {
  const {
    data: recipes,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useFecthPopularRecipe(VideoType.SHORTS);
  return (
    <HorizontalScrollArea
      onReachEnd={() => {
        if (hasNextPage) {
          fetchNextPage();
        }
      }}
    >
      <div className=" flex flex-row gap-2 whitespace-normal min-w-[100.5vw]">
        {recipes.map((recipe) => (
          <RecipeCardWrapper
            recipe={recipe}
            key={recipe.recipeId}
            trigger={<ShortsRecipeCardReady recipe={recipe} />}
            source="popular_shorts"
          />
        ))}
        {isFetchingNextPage && <ShortsRecipeCardSkeleton />}
      </div>
    </HorizontalScrollArea>
  );
};

function ShortsRecipeCardSkeleton() {
  return <Skeleton className="flex shrink-0 w-[180] h-[320] rounded-md" />;
}

function ShortsRecipeCardReady({ recipe }: { recipe: PopularRecipe }) {
  const { recipeStatus } = useFetchRecipeProgress({
    recipeId: recipe.recipeId,
  });
  return (
    <div className="relative w-[180] h-[320] overflow-hidden rounded-md ">
      <div className="absolute top-[12] left-[8]">
        <AlreadyEnrolledChip
          isEnrolled={recipe.isViewed && recipeStatus === RecipeStatus.SUCCESS}
        />
        <CreatingStatusChip
          isInCreating={recipeStatus === RecipeStatus.IN_PROGRESS}
        />
      </div>
      <img
        src={recipe.videoThumbnailUrl}
        className="block w-full h-full object-cover "
      />
      <div className="absolute text-left bottom-[24] w-[160px] left-[10] font-bold text-white line-clamp-2">
        {recipe.recipeTitle}
      </div>
    </div>
  );
}
