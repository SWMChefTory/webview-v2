import client from "@/src/shared/client/main/client";
import { parseWithErrLog } from "@/src/shared/schema/zodErrorLogger";
import { ThemeRecipePageResponseSchema } from "@/src/pages/home/entities/theme-recipe/type";

export async function fetchTrendingRecipes() {
  const response = await client.get("/recipes/trending");
  console.log("response!!!", JSON.stringify(response.data, null, 2));
  console.log("!!!!!!!!!!!!!!", JSON.stringify({...response.data, data: response.data.trendRecipes}, null, 2));
  return parseWithErrLog(ThemeRecipePageResponseSchema, {...response.data, data: response.data.trendRecipes});
}

export async function fetchChefRecommendRecipes() {
  const response = await client.get("/recipes/chef");
  return parseWithErrLog(ThemeRecipePageResponseSchema, {...response.data, data: response.data.chefRecipes});
}