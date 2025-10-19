import {
  ThumbnailEmpty,
  ThumbnailReady,
  ThumbnailSkeleton,
} from "@/src/entities/user_recipe/ui/thumbnail";
import {
  TitleReady,
  TitleEmpty,
  TitleSkeleton,
} from "@/src/entities/user_recipe/ui/title";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";

import {
  useFetchRecipeProgress,
  UserRecipe,
} from "@/src/entities/user_recipe/model/useUserRecipe";
import {
  ElapsedViewTimeEmpty,
  ElapsedViewTimeReady,
  ElapsedViewTimeSkeleton,
} from "@/src/entities/user_recipe/ui/detail";
import {ProgressDetailsCheckList } from "@/src/entities/user_recipe/ui/progress";
import { Loader2 } from "lucide-react";
import { RecipeStatus } from "@/src/entities/user_recipe/type/type";
import { useRouter } from "next/router";
import { useFetchRecipe } from "@/src/entities/recipe/model/useRecipe";


export const UserRecipeCardReady = ({
  userRecipe,
}: {
  userRecipe: UserRecipe;
}) => {
  const userRouter = useRouter();
  return (
    <div className="flex relative flex-col w-[156]" onClick={() => {
      userRouter.push(`/recipe/${userRecipe.recipeId}/detail`);
    }}>
      <SSRSuspense fallback={<RecipeProgressSkeleton />}>
        <RecipeProgressReady userRecipe={userRecipe} />
      </SSRSuspense>
      <ThumbnailReady imgUrl={userRecipe.videoInfo.thumbnailUrl} />
      <div className="w-full">
        <TitleReady title={userRecipe.title} />
        <ElapsedViewTimeReady details={userRecipe.getSubTitle()} />
      </div>
    </div>
  );
};

const RecipeProgressSkeleton = () => {
  return (
    <div className="absolute top-0 right-0 w-full h-full bg-gray-500/10 rounded-md flex items-center justify-center z-10">
      <Loader2 className="size-[32] animate-spin text-stone-100 z-10" />
    </div>
  );
};

const RecipeProgressReady = ({ userRecipe }: { userRecipe: UserRecipe }) => {
  const { progress } = useFetchRecipeProgress(
    userRecipe.recipeId
  );

  if (
    progress.recipeStatus === RecipeStatus.SUCCESS ||
    progress.recipeStatus === RecipeStatus.FAILED
  ) {
    return <></>;
  }
  return (
    <div className="absolute inset-0 flex items-center overflow-hidden">
      <ProgressDetailsCheckList
        recipeProgressDetails={progress.recipeProgressDetails}
      />
    </div>
  );
};


export const UserRecipeCardEmpty = () => {
  return (
    <div className="w-[156]">
      <ThumbnailEmpty />
      <div className="w-full">
        <TitleEmpty />
        <ElapsedViewTimeEmpty />
      </div>
    </div>
  );
};

export const UserRecipeCardSkeleton = () => {
  return (
    <div className="w-[156]">
      <ThumbnailSkeleton />
      <div className="w-full">
        <TitleSkeleton />
        <ElapsedViewTimeSkeleton />
      </div>
    </div>
  );
};
