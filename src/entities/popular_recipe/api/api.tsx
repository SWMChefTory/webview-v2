import client from "@/src/shared/client/main/client";
import { z } from "zod";
import { VideoType } from "../type/videoType";
import { parseWithErrLog } from "@/src/shared/schema/zodErrorLogger";
import createPaginatedSchema from "@/src/shared/schema/paginatedSchema";
import { RecipeTagSchema } from "@/src/shared/schema/recipeSchema";

const PopularSummaryRecipeResponseSchema = z.object({
  recipeId: z.string(),
  recipeTitle: z.string(),
  tags: z.array(RecipeTagSchema),
  isViewed: z.boolean().optional(),
  description: z.string(),
  servings: z.number(),
  cookingTime: z.number(),
  videoId: z.string(),
  count: z.number(),
  videoUrl: z.string(),
  videoType: z.enum(['SHORTS', 'NORMAL']),
  videoThumbnailUrl: z.string(),
  videoSeconds: z.number(),
});

const PopularSummaryRecipeApiResponseSchema = z.object({
  recommendRecipes: PopularSummaryRecipeResponseSchema.array(),
});

const PopularSummaryRecipePagenatedResponse = createPaginatedSchema(PopularSummaryRecipeApiResponseSchema);

export type PopularSummaryRecipe = z.infer<typeof PopularSummaryRecipeResponseSchema>;
export type PopularSummaryRecipeResponse = z.infer<typeof PopularSummaryRecipeApiResponseSchema>;
export type PopularSummaryRecipePagenatedResponse = z.infer<typeof PopularSummaryRecipePagenatedResponse>;

export async function fetchPopularSummary(): Promise<PopularSummaryRecipeResponse> {
  const response = await client.get(
    `/recipes/recommend`
  );
  console.log("fetchPopularSummary response", JSON.stringify(response.data, null, 2));
  return parseWithErrLog(PopularSummaryRecipeApiResponseSchema, response.data);
}
