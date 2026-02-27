import client from "@/src/shared/client/main/client";
import {
  RecipeReportRequestSchema,
  type RecipeReportRequest,
} from "./recipeReportSchema";

export const reportRecipe = async (recipeId: string, body: RecipeReportRequest) => {
  const validated = RecipeReportRequestSchema.parse(body);
  return client.post(`/api/v1/recipes/${recipeId}/reports`, validated);
};
