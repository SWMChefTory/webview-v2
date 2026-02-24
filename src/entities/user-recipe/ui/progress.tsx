import { RecipeStatus } from "@/src/shared/enums/recipe";
import { Spinner } from "@/components/ui/spinner";
import { useQueryClient } from "@tanstack/react-query";
import { ALL_RECIPES, useFetchRecipeProgress } from "../model/useUserRecipe";
import { useTranslation } from "next-i18next";

export const ProgressDetailsCheckList = ({
  recipeStatusCurrent,
}: {
  recipeStatusCurrent: RecipeStatus;
}) => {
  const { t } = useTranslation("user-recipe");
  const queryClient = useQueryClient();
  if (recipeStatusCurrent === RecipeStatus.SUCCESS) {
    return <></>;
  }
  return (
    <div className="flex flex-col gap-1 md:gap-1.5 lg:gap-2 pt-[16] md:pt-4 lg:pt-5 flex-start p-[8] md:p-2.5 lg:p-3 bg-gray-800/80 rounded-md md:rounded-md lg:rounded-lg h-full justify-start w-full items-center z-999">
      <div className="text-white font-bold text-lg md:text-lg lg:text-xl">
        {recipeStatusCurrent !== RecipeStatus.FAILED && t("progress.creating")}
      </div>  
      <div className="flex flex-1 w-full items-center justify-center">
        {recipeStatusCurrent === RecipeStatus.FAILED ? (
          <div
            className="text-white font-bold text-lg md:text-lg lg:text-xl"
            onClick={
              recipeStatusCurrent === RecipeStatus.FAILED
                ? () => {
                    queryClient.invalidateQueries({
                      queryKey: [ALL_RECIPES],
                    });
                  }
                : () => {}
            }
          >
            {t("progress.failed")}
          </div>
        ) : (
          <Spinner className="size-12 md:size-13 lg:size-14 text-orange-500" />
        )}
      </div>
    </div>
  );
};
