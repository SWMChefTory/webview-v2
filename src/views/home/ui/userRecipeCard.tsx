import {
  ThumbnailEmpty,
  ThumbnailReady,
  ThumbnailSkeleton,
} from "@/src/entities/user-recipe/ui/thumbnail";
import {
  TitleEmpty,
  TitleReady,
  TitleSkeleton,
} from "@/src/entities/user-recipe/ui/title";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { useFetchRecipeProgress, useFetchRecipeProgressWithRefetch } from "@/src/entities/user-recipe/model/useUserRecipe";
import { UserRecipe } from "@/src/entities/user-recipe/model/schema";
import { ProgressDetailsCheckList } from "@/src/entities/user-recipe/ui/progress";
import { Loader2 } from "lucide-react";
import { RecipeStatus } from "@/src/entities/user-recipe/type/type";
import router, { useRouter } from "next/router";
import { TimerTag } from "@/src/widgets/timer/modal/ui/timerTag";
import { useRecipeCreatingViewOpenStore } from "@/src/widgets/recipe-creating-form/recipeCreatingFormOpenStore";
import TextSkeleton from "@/src/shared/ui/skeleton/text";
import { useElapsedTime } from "@/src/features/format/recipe-info/useElapsedTime";
import { useLangcode } from "@/src/shared/translation/useLangCode";
import { useTranslation } from "next-i18next";

export const UserRecipeCardReady = ({
  userRecipe,
}:
{
  userRecipe: UserRecipe;
}) => {

  return (
    <div className="relative flex flex-col w-[160px]">
      <SSRSuspense fallback={<RecipeProgressSkeleton />}>
        <RecipeProgressReady recipeId={userRecipe.recipeId} />
      </SSRSuspense>
      <div className="relative w-[160] h-[90]">
        <div className="absolute top-[12] right-[12] z-[10]">
          <TimerTag
            recipeId={userRecipe.recipeId}
            recipeName={userRecipe.title}
          />
        </div>
        <div className="absolute inset-[0]">
          <ThumbnailReady
            imgUrl={userRecipe.videoInfo.thumbnailUrl}
            size={{ width: 160, height: 90 }}
          />
        </div>
      </div>
      <div className="w-full h-16">
        <TitleReady title={userRecipe.title} />
        <ElapsedViewTimeReady viewedAt={userRecipe.viewedAt} />
      </div>
    </div>
  );
};

const ElapsedViewTimeReady = ({ viewedAt }: { viewedAt: Date }) => {
  const lang = useLangcode();
  const { getElapsedTime } = useElapsedTime(lang);
  return (
    <p className="text-sm line-clamp-1 text-gray-500">
      {getElapsedTime(viewedAt)}
    </p>
  );
};

const ElapsedViewTimeEmpty = () => {
  const { t } = useTranslation("user-recipe");

  return (
    <p className="text-sm line-clamp-1 text-transparent">
      {t("empty.pleaseCreate")}
    </p>
  );
};

const ElapsedViewTimeSkeleton = () => {
  return (
    <div className="w-20">
      <TextSkeleton fontSize="text-sm" />
    </div>
  );
};

export const UserRecipeCardEmpty = () => {
  const { open } = useRecipeCreatingViewOpenStore();
  const { t } = useTranslation("user-recipe");

  return (
    <div>
      <div className="flex flex-row h-[90]">
        <div
          onClick={() => {
            open("", "floating_button");
          }}
        >
          <ThumbnailEmpty size={{ width: 160, height: 90 }} />
        </div>
        <div className="w-0.5" />
        <div className="py-2">
          <Tail direction={Direction.LEFT} length={10} color="#F97316" />
        </div>
        <div
          className="flex items-center rounded-sm px-2 h-[24] shrink-0 text-sm text-white bg-[#F97316] shadow-md
            shadow-stone-300"
        >
          {t("empty.clickToCreate")}
        </div>
      </div>
      <div className="w-full h-16">
        <TitleEmpty />
        <ElapsedViewTimeEmpty />
      </div>
    </div>
  );
};

enum Direction {
  UP = "UP",
  DOWN = "DOWN",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
}

const Tail = ({
  direction,
  length,
  color,
}: {
  direction: Direction;
  length: number; // px
  color: string; // "#00aabb" 같은 값
}) => {
  const map = {
    [Direction.DOWN]: { borderSide: "border-t", anchor: "top-0" },
    [Direction.UP]: { borderSide: "border-b", anchor: "bottom-0" },
    [Direction.LEFT]: { borderSide: "border-r", anchor: "right-0" },
    [Direction.RIGHT]: { borderSide: "border-l", anchor: "left-0" },
  } as const;

  const { borderSide, anchor } = map[direction];

  return (
    <div
      className="relative overflow-hidden"
      style={{ width: length, height: length }} // 정사각형 래퍼
    >
      <div
        className={`
          absolute
          ${anchor}
          border-transparent
          ${borderSide}
        `}
        style={{
          borderWidth: length,
          // 방향에 따라 색칠되는 쪽만 컬러
          ...(direction === Direction.DOWN && { borderTopColor: color }),
          ...(direction === Direction.UP && { borderBottomColor: color }),
          ...(direction === Direction.LEFT && { borderRightColor: color }),
          ...(direction === Direction.RIGHT && { borderLeftColor: color }),
        }}
      />
    </div>
  );
};

export const UserRecipeCardSkeleton = () => {
  return (
    <div>
      <ThumbnailSkeleton size={{ width: 160, height: 90 }} />
      <div className="w-full h-16">
        <TitleSkeleton />
        <ElapsedViewTimeSkeleton />
      </div>
    </div>
  );
};

const RecipeProgressSkeleton = () => {
  return (
    <div className="absolute top-0 right-0 w-full h-full bg-gray-500/10 rounded-md flex items-center justify-center z-10">
    </div>
  );
};

const RecipeProgressReady = ({ recipeId }: { recipeId: string }) => {
  const { recipeStatus } = useFetchRecipeProgressWithRefetch(recipeId);

  if (recipeStatus === RecipeStatus.SUCCESS) {
    return (
      <div className="absolute inset-0 flex items-center overflow-hidden z-10"
        onClick={() => {
          if (recipeStatus === RecipeStatus.SUCCESS) {
            router.push(`/recipe/${recipeId}/detail`);
          }
        }}
      />
    );
  }

  return (
    <div className="absolute inset-0 flex items-center overflow-hidden z-10">
      <ProgressDetailsCheckList recipeStatus={recipeStatus} />
    </div>
  );
};
