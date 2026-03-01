import { useMutation } from "@tanstack/react-query";
import { reportRecipe } from "./api/recipeReportApi";
import type { RecipeReportRequest } from "./api/recipeReportSchema";

export const RECIPE_REPORT_QUERY_KEY = "RECIPE_REPORT_QUERY_KEY";

export const useReportRecipe = () => {
  return useMutation({
    mutationFn: ({
      recipeId,
      ...body
    }: RecipeReportRequest & { recipeId: string }) =>
      reportRecipe(recipeId, body),
  });
};
