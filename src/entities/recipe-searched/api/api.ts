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
  tags: z.array(RecipeTagSchema),
  isViewed: z.boolean(),
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

// 변환된 레시피 스키마
const RecipeSchema = z.object({
  recipeId: z.string(),
  recipeTitle: z.string(),
  isViewed: z.boolean(),
  tags: z.array(RecipeTagSchema),
  videoInfo: VideoInfoSchema,
  detailMeta: RecipeDetailMetaSchema,
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
    currentPage: response.data.currentPage,
    totalPages: response.data.totalPages,
    totalElements: response.data.totalElements,
    hasNext: response.data.hasNext,
    data: rawRecipes.map((recipe) => ({
      recipeId: recipe.recipeId,
      recipeTitle: recipe.recipeTitle,
      tags: recipe.tags,
      isViewed: recipe.isViewed,
      videoInfo: {
        videoId: recipe.videoId,
        videoTitle: recipe.recipeTitle,
        videoThumbnailUrl: recipe.videoThumbnailUrl,
        videoSeconds: recipe.videoSeconds,
        videoType: recipe.videoType,
      },
      detailMeta: {
        description: recipe.description,
        servings: recipe.servings,
        cookingTime: recipe.cookingTime,
      },
    })),
  };
  
  return parseWithErrLog(PaginatedRecipeSchema, data);
};
