import { ThumbnailEmpty, ThumbnailReady, ThumbnailSkeleton } from "@/src/entities/user_recipe/ui/thumbnail";
import { TitleReady, TitleEmpty, TitleSkeleton } from "@/src/entities/user_recipe/ui/title";

import { useFetchRecipeProgress, UserRecipe } from "@/src/entities/user_recipe/model/useUserRecipe";
import { ElapsedViewTimeEmpty, ElapsedViewTimeReady, ElapsedViewTimeSkeleton } from "../../../entities/user_recipe/ui/detail";
export const UserRecipeCardReady = ({
  userRecipe
}: {
  userRecipe: UserRecipe;
}) => {
  const progress = useFetchRecipeProgress(userRecipe.recipeId);
  return (
    <div className="w-[156]">
      <ThumbnailReady imgUrl={userRecipe.videoInfo.thumbnailUrl} />
      <div className="w-full">
        <TitleReady title={userRecipe.title} />
        <ElapsedViewTimeReady details={userRecipe.getSubTitle()} />
      </div>
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

