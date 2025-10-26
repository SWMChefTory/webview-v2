import client from "@/src/shared/client/main/client";
import { z } from "zod";
import { VideoType } from "../type/videoType";

const PopularSummaryRecipeResponseSchema = z.object({
  recipeId: z.string(),
  recipeTitle: z.string(),
  videoThumbnailUrl: z.string(),
  videoId: z.string(),
  videoUrl: z.string(),
  count: z.number(),
  isViewd: z.boolean(),
  videoType: z.enum(VideoType),
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
  console.log("fetchPopularSummary!", JSON.stringify(response));
  return response.data;
}
