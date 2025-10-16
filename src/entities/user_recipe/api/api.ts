import client from "@/src/shared/client/main/client";
import { z } from "zod";
import {
  RecipeStatus,
  RecipeProgressDetail,
  RecipeProgressStep,
} from "@/src/entities/user_recipe/type/type";

const VideoInfoSchema = z.object({
  thumbnailUrl: z.string(),
  id: z.string(),
  seconds: z.number(),
  lastPlaySeconds: z.number(),
});

const CategoryInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const UserRecipeSchema = z.object({
  recipeId: z.string(),
  title: z.string(),
  videoInfo: VideoInfoSchema,
  categoryInfo: CategoryInfoSchema.optional(),
  viewedAt: z.date(),
});

const PaginatedSchema = z.object({
  currentPage: z.number(),
  hasNext: z.boolean(),
  totalElements: z.number(),
  totalPages: z.number(),
  data: z.array(UserRecipeSchema),
});

type PaginatedRecipes = z.infer<typeof PaginatedSchema>;
export type UserRecipeResponse = z.infer<typeof UserRecipeSchema>;
export type VideoInfoResponse = z.infer<typeof VideoInfoSchema>;
export type CategoryInfoResponse = z.infer<typeof CategoryInfoSchema>;

export async function fetchCategorizedRecipesSummary({
  categoryId,
  categoryName: category,
  page,
}: {
  categoryId: string;
  categoryName: string;
  page: number;
}): Promise<PaginatedRecipes> {

  const response = await client.get(
    `/recipes/categorized/${categoryId}?page=${page}`
  );

  const data = response.data;
  return PaginatedSchema.parse({
    currentPage: data.currentPage,
    hasNext: data.hasNext,
    totalElements: data.totalElements,
    totalPages: data.totalPages,
    data: data.categorizedRecipes.map((recipe: any) =>
      transformRecipe({ ...recipe, category })
    ),
  });
}

export async function fetchUnCategorizedRecipesSummary(params: {
  page: number;
}): Promise<PaginatedRecipes> {
  const { page } = params;
  const response = await client.get(`/recipes/uncategorized?page=${page}`);
  const data = response.data;
  console.log("[FETCH UNCATEGORIZED RECIPES SUMMARY] totalElements : ", JSON.stringify(data.totalElements));
  console.log("[FETCH UNCATEGORIZED RECIPES SUMMARY] pages : ", JSON.stringify(data.totalPages));
  console.log("[FETCH UNCATEGORIZED RECIPES SUMMARY] hasNext : ", JSON.stringify(data.hasNext));
  return PaginatedSchema.parse({
    currentPage: data.currentPage,
    hasNext: data.hasNext,
    totalElements: data.totalElements,
    totalPages: data.totalPages,
    data: data.unCategorizedRecipes.map((recipe: any) =>
      transformRecipe(recipe)
    ),
  });
}

const transformRecipe = (recipe: any) => {
  return {
    recipeId: recipe.recipeId,
    title: recipe.recipeTitle,
    videoInfo: {
      id: recipe.videoId,
      thumbnailUrl: recipe.videoThumbnailUrl,
      seconds: recipe.videoSeconds,
      lastPlaySeconds: recipe.lastPlaySeconds,
    },
    categoryInfo: recipe.categoryId
      ? {
          id: recipe.categoryId,
          name: recipe.category,
        }
      : undefined,
    viewedAt: new Date(recipe.viewedAt),
  };
};

const CreateRecipeResponseSchema = z.object({
  recipeId: z.string(),
});
export type CreateRecipeResponse = z.infer<typeof CreateRecipeResponseSchema>;

export async function createRecipe(videoUrl: string): Promise<string> {
  const createRequest = {
    video_url: videoUrl,
  };
  const response = await client.post(`/recipes`, createRequest);
  console.log("[CREATE RECIPE] : ", JSON.stringify(response.data));
  return CreateRecipeResponseSchema.parse(response.data).recipeId;
}

const RecipeProgressDetailSchema = z.object({
  recipeStatus: z.enum(RecipeStatus),
  recipeProgressStatuses: z.array(
    z.object({
      progressStep: z.enum(RecipeProgressStep),
      progressDetail: z.enum(RecipeProgressDetail),
    })
  ),
});

export type RecipeCreateStatusResponse = z.infer<
  typeof RecipeProgressDetailSchema
>;

export async function fetchRecipeProgress(
  recipeId: string
): Promise<RecipeCreateStatusResponse> {
  const response = await client.get<RecipeCreateStatusResponse>(
    `/recipes/progress/${recipeId}`
  );
  console.log("[FETCH RECIPE PROGRESS] : ", JSON.stringify(response.data));
  return RecipeProgressDetailSchema.parse(response.data);
}

export async function updateCategory({
  recipeId,
  targetCategoryId,
}: {
  recipeId: string;
  targetCategoryId: string;
}): Promise<void> {
  const request = {
    category_id: targetCategoryId,
  };
  return await client.put(`/recipes/${recipeId}/categories`, request);
}
