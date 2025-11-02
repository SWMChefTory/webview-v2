import client from "@/src/shared/client/main/client";
import { z } from "zod";
import {
  RecipeDetailMetaSchema,
  RecipeTagSchema,
} from "@/src/shared/schema/recipeSchema";
import { VideoInfoSchema } from "@/src/shared/schema/videoInfoSchema";
import createPaginatedSchema from "@/src/shared/schema/paginatedSchema";
import { parseWithErrLog } from "@/src/shared/schema/zodErrorLogger";
import { CuisineType } from "@/src/entities/category/type/cuisineType";

// API 원시 응답 데이터 스키마
const RawCuisineRecipeSchema = z.object({
  recipeId: z.string(),
  recipeTitle: z.string(),
  tags: z.array(RecipeTagSchema).optional(),
  isViewed: z.boolean().optional(),
  description: z.string().optional(),
  servings: z.number().optional(),
  cookingTime: z.number().optional(),
  videoId: z.string(),
  videoTitle: z.string().optional(),
  title: z.string().optional(),
  videoThumbnailUrl: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  videoSeconds: z.number(),
});

// 변환된 레시피 스키마
const CuisineRecipeSchema = z.object({
  recipeId: z.string(),
  recipeTitle: z.string(),
  tags: z.array(RecipeTagSchema).optional(),
  isViewed: z.boolean().optional(),
  videoInfo: VideoInfoSchema,
  detailMeta: RecipeDetailMetaSchema.optional(),
});

const CuisineRecipesSchema = z.array(CuisineRecipeSchema);

const PaginatedCuisineRecipeSchema = createPaginatedSchema(CuisineRecipesSchema);

export type CuisineRecipe = z.infer<typeof CuisineRecipeSchema>;
export type PaginatedCuisineRecipeResponse = z.infer<typeof PaginatedCuisineRecipeSchema>;

export const fetchCuisineRecipes = async ({
  page,
  cuisineType,
}: {
  page: number;
  cuisineType: CuisineType;
}): Promise<PaginatedCuisineRecipeResponse> => {
  const url = `/recipes/cuisine/${cuisineType}?page=${page}`;
  
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
  const rawRecipes = z.array(RawCuisineRecipeSchema).parse(response.data.cuisineRecipes || []);
  
  const data = {
    currentPage: response.data.currentPage ?? 0,
    totalPages: response.data.totalPages ?? 0,
    totalElements: response.data.totalElements ?? 0,
    hasNext: response.data.hasNext ?? false,
    data: rawRecipes.map((recipe) => ({
      recipeId: recipe.recipeId,
      recipeTitle: recipe.recipeTitle,
      tags: recipe.tags,
      isViewed: recipe.isViewed,
      videoInfo: {
        videoId: recipe.videoId,
        videoTitle: recipe.videoTitle || recipe.title,
        videoThumbnailUrl: recipe.videoThumbnailUrl || recipe.thumbnailUrl,
        videoSeconds: recipe.videoSeconds,
      },
      detailMeta: recipe.description || recipe.servings || recipe.cookingTime ? {
        description: recipe.description,
        servings: recipe.servings,
        cookingTime: recipe.cookingTime,
      } : undefined,
    })),
  };
  
  return parseWithErrLog(PaginatedCuisineRecipeSchema, data);
};

