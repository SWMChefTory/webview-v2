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

import { useFetchRecipeProgress } from "@/src/entities/user_recipe/model/useUserRecipe";

import {
  getElapsedTime,
  UserRecipe,
} from "@/src/entities/user_recipe/model/schema";

import {
  ElapsedViewTimeEmpty,
  ElapsedViewTimeReady,
  ElapsedViewTimeSkeleton,
} from "@/src/entities/user_recipe/ui/detail";
import { ProgressDetailsCheckList } from "@/src/entities/user_recipe/ui/progress";
import { Loader2 } from "lucide-react";
import { RecipeStatus } from "@/src/entities/user_recipe/type/type";
import { useRouter } from "next/router";
import { useIsInTutorialStore } from "@/src/shared/tutorial/isInTutorialStore";
import { driverObj } from ".";
import { useEffect } from "react";

export const UserRecipeCardReady = ({
  userRecipe,
}: {
  userRecipe: UserRecipe;
}) => {
  const userRouter = useRouter();
  const progress = useFetchRecipeProgress(userRecipe.recipeId);

  function isTutorialId(){
    return userRecipe.videoInfo.id === "XPmywm8Dnx4"
  }
  useEffect(() => {
    if (useIsInTutorialStore.getState().isInTutorial && isTutorialId()) {
      useIsInTutorialStore.getState().setIsTutorialRecipeCardCreated(true);
    }
  }, []);
  return (
    <div
      data-tour={isTutorialId() ? "recipe-card" : ""}
      className="flex relative flex-col w-[320px]"
    >
      <SSRSuspense fallback={<RecipeProgressSkeleton />}>
        <RecipeProgressReady userRecipe={userRecipe} />
      </SSRSuspense>
      <div className="relative w-[320] h-[180]" onClick={() => {
        if (progress.recipeStatus === RecipeStatus.SUCCESS) {
          userRouter.push(`/recipe/${userRecipe.recipeId}/detail`);
          if (useIsInTutorialStore.getState().isInTutorial && isTutorialId()) {
            driverObj.destroy();
            useIsInTutorialStore.getState().finishTutorial();
          }
        }
      }}>
        <div className="absolute top-0 left-0">
          <div className="absolute top-[12] left-[12]">
          </div>
          <ThumbnailReady
            imgUrl={userRecipe.videoInfo.thumbnailUrl}
            size={{ width: 320, height: 180 }}
          />
        </div>
      </div>
      <div className="w-full">
        <TitleReady title={userRecipe.title} />
        <ElapsedViewTimeReady details={getElapsedTime(userRecipe.viewedAt)} />
      </div>
    </div>
  );
};

export const UserRecipeCardEmpty = () => {
  return (
    <div className="w-[320px]">
      <ThumbnailEmpty size={{ width: 320, height: 180 }} />
      <div className="w-full">
        <TitleEmpty />
        <ElapsedViewTimeEmpty />
      </div>
    </div>
  );
};

export const UserRecipeCardSkeleton = () => {
  return (
    <div>
      <ThumbnailSkeleton size={{ width: 320, height: 180 }} />
      <div className="w-full">
        <TitleSkeleton />
        <ElapsedViewTimeSkeleton />
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
  const { recipeStatus } = useFetchRecipeProgress(userRecipe.recipeId);
  if (
    recipeStatus === RecipeStatus.SUCCESS
  ) {
    return <></>;
  }
  return (
    <div className="absolute inset-0 flex items-center overflow-hidden z-10">
      <ProgressDetailsCheckList
        recipeStatus={recipeStatus}
      />
    </div>
  );
};
