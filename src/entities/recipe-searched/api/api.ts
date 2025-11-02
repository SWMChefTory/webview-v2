import client from "@/src/shared/client/main/client";
import { z } from "zod";
import {
  RecipeDetailMetaSchema,
  RecipeTagSchema,
  RecipeStatusSchema,
} from "@/src/shared/schema/recipeSchema";
import { VideoInfoSchema } from "@/src/shared/schema/videoInfoSchema";
import createPaginatedSchema from "@/src/shared/schema/paginatedSchema";
import { parseWithErrLog } from "@/src/shared/schema/zodErrorLogger";

// API 원시 응답 데이터 스키마
const RawSearchRecipeSchema = z.object({
  recipeId: z.string(),
  recipeTitle: z.string(),
  tags: z.array(RecipeTagSchema).optional(),
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
const RecipeSchema = z.object({
  recipeId: z.string(),
  recipeTitle: z.string(),
  tags: z.array(RecipeTagSchema).optional(),
  videoInfo: VideoInfoSchema,
  detailMeta: RecipeDetailMetaSchema.optional(),
});

const RecipesSchema = z.array(RecipeSchema);

const PaginatedRecipeSchema = createPaginatedSchema(RecipesSchema);

export type VideoInfoResponse = z.infer<typeof VideoInfoSchema>;
export type RecipeTagResponse = z.infer<typeof RecipeTagSchema>;
export type Recipe = z.infer<typeof RecipeSchema>;
export type PaginatedRecipeResponse = z.infer<typeof PaginatedRecipeSchema>;

export const fetchRecipesSearched = async ({
  page,
  query,
}: {
  page: number;
  query: string;
}): Promise<PaginatedRecipeResponse> => {
  const url = `/recipes/search?query=${query?encodeURIComponent(query):"''"}&page=${page}`;

  const response = await client.get(url);
  
  // API 응답 데이터 파싱
  const rawRecipes = z.array(RawSearchRecipeSchema).parse(response.data.searchedRecipes || []);
  
  const data = {
    currentPage: response.data.currentPage ?? 0,
    totalPages: response.data.totalPages ?? 0,
    totalElements: response.data.totalElements ?? 0,
    hasNext: response.data.hasNext ?? false,
    data: rawRecipes.map((recipe) => ({
      recipeId: recipe.recipeId,
      recipeTitle: recipe.recipeTitle,
      tags: recipe.tags,
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
  
  return parseWithErrLog(PaginatedRecipeSchema, data);
};
