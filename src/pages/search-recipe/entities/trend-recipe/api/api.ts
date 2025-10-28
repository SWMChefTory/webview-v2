import client from "@/src/shared/client/main/client";
import { parseWithErrLog } from "@/src/shared/schema/zodErrorLogger";
import { ThemeRecipePageResponseSchema, ThemeRecipePageResponse } from "@/src/pages/home/entities/theme-recipe/type";

export async function fetchTrendingRecipes({ page }: { page: number }): Promise<ThemeRecipePageResponse> {
  const response = await client.get(`/recipes/trending?page=${page}`);
  return parseWithErrLog(ThemeRecipePageResponseSchema, {
    ...response.data,
    data: response.data.trendRecipes,
  });
}

