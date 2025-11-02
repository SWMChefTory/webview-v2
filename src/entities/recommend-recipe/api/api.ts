import client from "@/src/shared/client/main/client";
import { z } from "zod";
import createPaginatedSchema from "@/src/shared/schema/paginatedSchema";
import { parseWithErrLog } from "@/src/shared/schema/zodErrorLogger";
import { RecommendType } from "@/src/entities/category/type/cuisineType";

// API 원시 응답 데이터 스키마
const RawRecommendRecipeSchema = z.object({
  recipeId: z.string(),
  recipeTitle: z.string(),
  videoThumbnailUrl: z.string(),
  videoId: z.string(),
  count: z.number().optional(),
  videoUrl: z.string(),
  isViewed: z.boolean(),
  videoType: z.string(),
});

// 변환된 레시피 스키마
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
  
  // 빈 응답 처리
  if (!response.data || Object.keys(response.data).length === 0) {
    return {
      currentPage: 0,
      totalPages: 0,
      totalElements: 0,
      hasNext: false,
      data: [],
    };
  }
  
  // API 응답 데이터 파싱
  const rawRecipes = z.array(RawRecommendRecipeSchema).parse(response.data.recommendRecipes || []);
  
  const data = {
    currentPage: response.data.currentPage ?? 0,
    totalPages: response.data.totalPages ?? 0,
    totalElements: response.data.totalElements ?? 0,
    hasNext: response.data.hasNext ?? false,
    data: rawRecipes.map((recipe) => ({
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

