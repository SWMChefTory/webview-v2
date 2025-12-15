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
import { useFetchRecipeProgressWithToast } from "@/src/entities/user-recipe/model/useUserRecipe";
import {
  UserRecipe,
} from "@/src/entities/user-recipe/model/schema";
import { ProgressDetailsCheckList } from "@/src/entities/user-recipe/ui/progress";
import { Loader2 } from "lucide-react";
import { RecipeStatus } from "@/src/entities/user-recipe/type/type";
import { useRouter } from "next/router";
import { TimerTag } from "@/src/features/timer/ui/timerTag";
import { useRecipeCreatingViewOpenStore } from "@/src/widgets/recipe-creating-view/recipeCreatingViewOpenStore";
import TextSkeleton from "@/src/shared/ui/skeleton/text";
import { useElapsedTime } from "@/src/features/format/recipe-info/useElapsedTime";
import { useLangcode } from "@/src/shared/translation/useLangCode";

export const UserRecipeCardReady = ({
  userRecipe,
}: {
  userRecipe: UserRecipe;
}) => {
  const router = useRouter();
  const progress = useFetchRecipeProgressWithToast(userRecipe.recipeId);

  return (
    <div className="relative flex flex-col w-[160px]">
      <SSRSuspense fallback={<RecipeProgressSkeleton />}>
        <RecipeProgressReady userRecipe={userRecipe} />
      </SSRSuspense>
      <div
        className="relative w-[160] h-[90]"
        onClick={() => {
          if (progress.recipeStatus === RecipeStatus.SUCCESS) {
            router.push(`/recipe/${userRecipe.recipeId}/detail`);
          }
        }}
      >
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
      <div className="w-full">
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
  return (
    <p className="text-sm line-clamp-1 text-transparent">
      레시피를 만들어주세요
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
          클릭해서 레시피 생성
        </div>
      </div>
      <div className="w-full">
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
  const { recipeStatus } = useFetchRecipeProgressWithToast(userRecipe.recipeId);
  if (recipeStatus === RecipeStatus.SUCCESS) {
    return <></>;
  }
  return (
    <div className="absolute inset-0 flex items-center overflow-hidden z-10">
      <ProgressDetailsCheckList recipeStatus={recipeStatus} />
    </div>
  );
};
