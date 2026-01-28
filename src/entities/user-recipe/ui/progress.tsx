import { RecipeStatus } from "@/src/shared/enums/recipe";
import { Spinner } from "@/components/ui/spinner";
import { useQueryClient } from "@tanstack/react-query";
import { ALL_RECIPES } from "../model/useUserRecipe";
import { useTranslation } from "next-i18next";

export const ProgressDetailsCheckList = ({
  recipeStatus,
}: {
  recipeStatus: RecipeStatus;
}) => {
  const { t } = useTranslation("user-recipe");
  const queryClient = useQueryClient();
  if (recipeStatus === RecipeStatus.SUCCESS) {
    return <></>;
  }
  return (
    <div className="flex flex-col gap-1 pt-[16] flex-start p-[8] bg-gray-800/80 rounded-md h-full justify-start w-full items-center z-999">
      <div className="text-white font-bold text-lg">
        {recipeStatus !== RecipeStatus.FAILED && t("progress.creating")}
      </div>
      <div className="flex flex-1 w-full items-center justify-center">
        {recipeStatus === RecipeStatus.FAILED ? (
          <div className="text-white font-bold text-lg"
          onClick={recipeStatus === RecipeStatus.FAILED ? () => {
            queryClient.invalidateQueries({
              queryKey: [ALL_RECIPES],
            });
          } : (() => {})}
          >
            {t("progress.failed")}
          </div>
        ) : (
          <Spinner className="size-12 text-orange-500" />
        )}
      </div>
    </div>
  );
};
