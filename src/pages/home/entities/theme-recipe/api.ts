import client from "@/src/shared/client/main/client";
import { parseWithErrLog } from "@/src/shared/schema/zodErrorLogger";
import { ThemeRecipePageResponseSchema } from "@/src/pages/home/entities/theme-recipe/type";

export async function fetchTrendingRecipes() {
  const response = await client.get("/recipes/recommend/trending");
  return parseWithErrLog(ThemeRecipePageResponseSchema, {...response.data, data: response.data.recommendRecipes});
}

export async function fetchChefRecommendRecipes() {
  const response = await client.get("/recipes/recommend/chef");
  return parseWithErrLog(ThemeRecipePageResponseSchema, {...response.data, data: response.data.recommendRecipes});
}