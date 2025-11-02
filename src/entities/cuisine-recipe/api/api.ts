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

  console.log('Fetching Cuisine Recipes:', { url, cuisineType, page });
  
  const response = await client.get(url);
  
  console.log('Response status:', response.status);
  console.log('Response data:', JSON.stringify(response.data, null, 2));
  console.log('Response data keys:', Object.keys(response.data));
  
  // 빈 응답 처리
  if (!response.data || Object.keys(response.data).length === 0) {
    console.warn('Empty response from cuisine API, returning empty data');
    return {
      currentPage: 0,
      totalPages: 0,
      totalElements: 0,
      hasNext: false,
      data: [],
    };
  }
  
  const data = {
    currentPage: response.data.currentPage ?? 0,
    totalPages: response.data.totalPages ?? 0,
    totalElements: response.data.totalElements ?? 0,
    hasNext: response.data.hasNext ?? false,
    data: (response.data.cuisineRecipes || []).map((recipe: any) => ({
      recipeId: recipe.recipeId,
      recipeTitle: recipe.recipeTitle,
      tags: recipe.tags?.map((tag: any) => ({ name: tag.name })),
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
  
  console.log('Mapped data:', JSON.stringify(data, null, 2));
  
  return parseWithErrLog(PaginatedCuisineRecipeSchema, data);
};

