import { RecipeStatus } from "@/src/shared/enums/recipe";
import { Spinner } from "@/components/ui/spinner";
import { useQueryClient } from "@tanstack/react-query";
import { ALL_RECIPE_QUERY_KEY,QUERY_KEY as CATEGORY_QUERY_KEY } from "../model/useUserRecipe";

export const ProgressDetailsCheckList = ({
  recipeStatus,
}: {
  recipeStatus: RecipeStatus;
}) => {
  const queryClient = useQueryClient();
  if (recipeStatus === RecipeStatus.SUCCESS) {
    return <></>;
  }
  return (
    <div className="flex flex-col gap-1 pt-[16] flex-start p-[8] bg-gray-800/80 rounded-md h-full justify-start w-full items-center z-999">
      <div className="text-white font-bold text-lg">
        {recipeStatus !== RecipeStatus.FAILED && "레시피 생성중"}
      </div>
      <div className="flex flex-1 w-full items-center justify-center">
        {recipeStatus === RecipeStatus.FAILED ? (
          <div className="text-white font-bold text-lg"
          onClick={recipeStatus === RecipeStatus.FAILED ? () => {
            queryClient.invalidateQueries({
              queryKey: [ALL_RECIPE_QUERY_KEY],
            });
            queryClient.invalidateQueries({
              queryKey: [CATEGORY_QUERY_KEY],
            });
          } : (() => {})}
          >
            레시피를 만드는데 실패했어요
          </div>
        ) : (
          <Spinner className="size-12 text-orange-500" />
        )}
      </div>
    </div>
  );
};
