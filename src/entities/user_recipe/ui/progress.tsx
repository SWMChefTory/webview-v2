import { RecipeStatus } from "@/src/shared/enums/recipe";
import { Spinner } from "@/components/ui/spinner"

export const ProgressDetailsCheckList = ({
  recipeStatus,
}: {
  recipeStatus: RecipeStatus;
}) => {
  if (
    recipeStatus === RecipeStatus.SUCCESS ||
    recipeStatus === RecipeStatus.FAILED
  ) {
    return <></>;
  }
  return (
    <div className="flex flex-col gap-1 pt-[16] flex-start p-[8] bg-gray-800/80 rounded-md h-full justify-start w-full items-center">
      <div className="text-white font-bold text-lg">레시피 생성중</div>
      <div className="flex flex-1 w-full items-center justify-center">
      <Spinner className="size-16 text-orange-500" />
      </div>
    </div>
  );
};