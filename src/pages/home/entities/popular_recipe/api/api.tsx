import client from "@/src/shared/client/main/client";
import { z } from "zod";

const PopularSummaryRecipeResponseSchema = z.object({
  recipeId: z.string(),
  recipeTitle: z.string(),
  videoThumbnailUrl: z.string(),
  videoId: z.string(),
  videoUrl: z.string(),
  count: z.number(),
});

const PopularSummaryRecipeApiResponseSchema = z.object({
  recommendRecipes: PopularSummaryRecipeResponseSchema.array(),
});

export type PopularSummaryRecipe = z.infer<typeof PopularSummaryRecipeResponseSchema>;
export type PopularSummaryRecipeResponse = z.infer<typeof PopularSummaryRecipeApiResponseSchema>;

export async function fetchPopularSummary(): Promise<PopularSummaryRecipeResponse> {
  const response = await client.get(
    `/recipes/recommend`
  );
  return response.data;
}
