import client from "@/src/shared/client/main/client";
import {
  RecipeOverviewSchema,
  RecipeOverview,
} from "@/src/entities/recipe-overview/schema/recipeOverview";

//recipe와 다른점은 조회를 하지 않음. 즉 조회수가 안올라감
export const fetchRecipeOverview = async (id: string): Promise<RecipeOverview> => {
  const response = await client.get(`/recipes/overview/${id}`);
  const data = response.data;
  console.log("!!!!!!!!!!!!!!!!", JSON.stringify(data));
  return RecipeOverviewSchema.parse(data);
};
