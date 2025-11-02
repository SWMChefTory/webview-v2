import client from "@/src/shared/client/main/client";
import { z } from "zod";
import { VideoType } from "../type/videoType";
import { parseWithErrLog } from "@/src/shared/schema/zodErrorLogger";
import createPaginatedSchema from "@/src/shared/schema/paginatedSchema";

const PopularSummaryRecipeResponseSchema = z.object({
  recipeId: z.string(),
  recipeTitle: z.string(),
  videoThumbnailUrl: z.string(),
  videoId: z.string(),
  videoUrl: z.string(),
  count: z.number(),
  isViewed: z.boolean(),
  videoType: z.enum(VideoType),
});

// const PopularSummaryRecipeApiResponseSchema = z.object({
//   recommendRecipes: PopularSummaryRecipeResponseSchema.array(),
// });

const PopularSummaryRecipePagenatedResponse = createPaginatedSchema(
  PopularSummaryRecipeResponseSchema.array()
);

export type PopularSummaryRecipe = z.infer<
  typeof PopularSummaryRecipeResponseSchema
>;

export type PopularSummaryRecipePagenatedResponse = z.infer<
  typeof PopularSummaryRecipePagenatedResponse
>;

export async function fetchPopularSummary({
  page,
  videoType
}: {
  page: number;
  videoType: VideoType;
}): Promise<PopularSummaryRecipePagenatedResponse> {
  console.log("fetchPopularSummary", `/recipes/recommend?page=${page}&query=${videoType}`);
  const response = await client.get(`/recipes/recommend?page=${page}&query=${videoType}`);
  return parseWithErrLog(PopularSummaryRecipePagenatedResponse, {
    currentPage: response.data.currentPage,
    hasNext: response.data.hasNext,
    totalElements: response.data.totalElements,
    totalPages: response.data.totalPages,
    data: response.data.recommendRecipes,
  });
}
