import client from "@/src/shared/client/main/client";
import { z } from "zod";
import {
  RecipeStatus,
  RecipeProgressDetail,
  RecipeProgressStep,
} from "@/src/entities/user-recipe/type/type";
import createPaginatedSchema from "@/src/shared/schema/paginatedSchema";
import { parseWithErrLog } from "@/src/shared/schema/zodErrorLogger";
import { UserRecipesSchema,} from "./schema";

export const PaginatedSchema = createPaginatedSchema(UserRecipesSchema);
export type PaginatedRecipes = z.infer<typeof PaginatedSchema>;

export async function fetchAllRecipesSummary({ page }: { page: number }) {
  const response = await client.get(`/recipes/recent?page=${page}`);
  const data = response.data;
  console.log("fetchRecipe!!", JSON.stringify(data, null, 2));
  return parseWithErrLog(PaginatedSchema, {
    ...data,
    data: data.recentRecipes.map((recipe: any) => transformRecipe(recipe)),
  });
}

export async function fetchCategorizedRecipesSummary({
  categoryId,
  categoryName,
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
  return parseWithErrLog(PaginatedSchema, {
    currentPage: data.currentPage,
    hasNext: data.hasNext,
    totalElements: data.totalElements,
    totalPages: data.totalPages,
    data: data.categorizedRecipes
      .map((recipe: any) =>
        transformRecipe({ ...recipe, category: categoryName })
      )
      .sort(
        (a: any, b: any) =>
          new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime()
      ),
  });
}

export async function fetchUnCategorizedRecipesSummary(params: {
  page: number;
}): Promise<PaginatedRecipes> {
  const { page } = params;
  const response = await client.get(`/recipes/uncategorized?page=${page}`);
  const data = response.data;

  return parseWithErrLog(PaginatedSchema, {
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
    viewedAt: new Date(recipe.viewedAt),
    recipeDetailMeta: recipe.description
      ? {
          description: recipe.description,
          servings: recipe.servings,
          cookingTime: recipe.cookTime,
        }
      : undefined,
    tags: recipe.tags
      ? recipe.tags.map((tag: any) => ({
          name: tag.name,
        }))
      : undefined,
    createdAt: new Date(recipe.createdAt),
  };
};

const CreateRecipeResponseSchema = z.object({
  recipeId: z.string(),
});
export type CreateRecipeResponse = z.infer<typeof CreateRecipeResponseSchema>;

export async function createRecipe(videoUrl: string): Promise<string> {
  const createRequest = {
    videoUrl: videoUrl,
  };
  const response = await client.post(`/recipes`, createRequest);
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
  return parseWithErrLog(RecipeProgressDetailSchema, response.data);
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
