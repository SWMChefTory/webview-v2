import client from "@/src/shared/client/main/client";

import {
  RecipeOverviewSchema,
  type RecipeOverview,
} from "@/src/entities/recipe-overview/model/api/schema/recipeOverviewSchema";

//조회를 수행하지 않는 레시피 호출
export const fetchRecipeOverview = async (
  id: string,
): Promise<RecipeOverview> => {
  const response = await client.get(`/recipes/overview/${id}`);
  const data = response.data;
  return RecipeOverviewSchema.parse(data);
};
