import client from "@/src/shared/client/main/client";
import { z } from "zod";

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

export async function fetchCategorizedRecipesSummary(params: {
  categoryId: string;
  page: number;
}): Promise<PaginatedRecipes> {
  const { categoryId, page } = params;

  console.log(
    "[FETCH CATEGORIZED RECIPES SUMMARY] : 다시실행 ",
    JSON.stringify(params)
  );

  const response = await client.get(
    `/recipes/categorized/${categoryId}?page=${page}`
  );

  const data = response.data;
  return PaginatedSchema.parse({
    currentPage: data.currentPage,
    hasNext: data.hasNext,
    totalElements: data.totalElements,
    totalPages: data.totalPages,
    data: data.categorizedRecipes.map((recipe: any) => transformRecipe(recipe)),
  });
}

export async function fetchUnCategorizedRecipesSummary(params: {
  page: number;
}): Promise<PaginatedRecipes> {
  const { page } = params;
  console.log(
    "[FETCH CATEGORIZED RECIPES SUMMARY] : 다시실행 ",
    JSON.stringify(params)
  );
  const response = await client.get(`/recipes/uncategorized?page=${page}`);
  const data = response.data;
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

export async function createRecipe(videoUrl: string): Promise<string> {
  const createRequest = {
    video_url: videoUrl,
  };
  const response = await client.post<string>(`/recipes`, createRequest);
  console.log("[CREATE RECIPE] : ", JSON.stringify(response.data));
  return response.data;
}

export enum RecipeStatus {
  IN_PROGRESS = "IN_PROGRESS",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

export enum RecipeProgressDetail {
  READY = "READY",
  CAPTION = "CAPTION",
  INGREDIENT = "INGREDIENT",
  TAG = "TAG",
  DETAIL_META = "DETAIL_META",
  BRIEFING = "BRIEFING",
  STEP = "STEP",
  FINISHED = "FINISHED",
}

const RecipeProgressDetailSchema = z.object({
  recipeStatus: z.enum(RecipeStatus),
  recipeProgressDetails: z.array(z.enum(RecipeProgressDetail)).optional(),
});

export type RecipeCreateStatusResponse = z.infer<typeof RecipeProgressDetailSchema>;

export async function fetchRecipeProgress(
  recipeId: string
): Promise<RecipeCreateStatusResponse> {
  const response = await client.get<RecipeCreateStatusResponse>(
    `/recipes/progress/${recipeId}`
  );
  return RecipeProgressDetailSchema.parse(response.data);
}