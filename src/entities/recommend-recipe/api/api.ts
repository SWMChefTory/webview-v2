import client from "@/src/shared/client/main/client";
import { z } from "zod";
import createPaginatedSchema from "@/src/shared/schema/paginatedSchema";
import { parseWithErrLog } from "@/src/shared/schema/zodErrorLogger";
import { RecommendType } from "@/src/entities/category/type/cuisineType";

const RecommendRecipeSchema = z.object({
  recipeId: z.string(),
  recipeTitle: z.string(),
  videoThumbnailUrl: z.string(),
  videoId: z.string(),
  count: z.number().optional(),
  videoUrl: z.string(),
  isViewed: z.boolean(),
  videoType: z.string(),
});

const RecommendRecipesSchema = z.array(RecommendRecipeSchema);

const PaginatedRecommendRecipeSchema = createPaginatedSchema(RecommendRecipesSchema);

export type RecommendRecipe = z.infer<typeof RecommendRecipeSchema>;
export type PaginatedRecommendRecipeResponse = z.infer<typeof PaginatedRecommendRecipeSchema>;

export const fetchRecommendRecipes = async ({
  page,
  recommendType,
}: {
  page: number;
  recommendType: RecommendType;
}): Promise<PaginatedRecommendRecipeResponse> => {
  const url = `/recipes/recommend/${recommendType}?page=${page}`;

  const response = await client.get(url);
  
  const data = {
    currentPage: response.data.currentPage ?? 0,
    totalPages: response.data.totalPages ?? 0,
    totalElements: response.data.totalElements ?? 0,
    hasNext: response.data.hasNext ?? false,
    data: (response.data.recommendRecipes || []).map((recipe: any) => ({
      recipeId: recipe.recipeId,
      recipeTitle: recipe.recipeTitle,
      videoThumbnailUrl: recipe.videoThumbnailUrl,
      videoId: recipe.videoId,
      count: recipe.count,
      videoUrl: recipe.videoUrl,
      isViewed: recipe.isViewed,
      videoType: recipe.videoType,
    })),
  };
  
  return parseWithErrLog(PaginatedRecommendRecipeSchema, data);
};

