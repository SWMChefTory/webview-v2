import client from "@/src/shared/client/main/client";
import { z } from "zod";
import {
  RecipeStatus,
  RecipeProgressDetail,
  RecipeProgressStep,
} from "@/src/entities/user_recipe/type/type";
import createPaginatedSchema from "@/src/shared/schema/paginatedSchema";
import { parseWithErrLog } from "@/src/shared/schema/zodErrorLogger";
import {RecipeDetailMetaSchema, RecipeTagSchema} from "@/src/shared/schema/recipeSchema";

const VideoInfoSchema = z.object({
  thumbnailUrl: z.string(),
  id: z.string(),
  seconds: z.number(),
  lastPlaySeconds: z.number(),
});

const CategorySchema = z.object({
  categoryId: z.string(),
  categoryName: z.string(),
});

const UserRecipeSchema = z.object({
  recipeId: z.string(),
  title: z.string(),
  videoInfo: VideoInfoSchema,
  categoryInfo: CategorySchema.optional(),
  recipeDetailMeta: RecipeDetailMetaSchema.optional(),
  tags: z.array(RecipeTagSchema).optional(),
  viewedAt: z.date(),
});

const UserRecipesSchema = z.array(UserRecipeSchema);

const PaginatedSchema = createPaginatedSchema(UserRecipesSchema);

type PaginatedRecipes = z.infer<typeof PaginatedSchema>;
export type UserRecipeResponse = z.infer<typeof UserRecipeSchema>;
export type VideoInfoResponse = z.infer<typeof VideoInfoSchema>;
export type CategoryInfoResponse = z.infer<typeof CategorySchema>;

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
    data: data.categorizedRecipes.map((recipe: any) =>
      transformRecipe({ ...recipe, category : categoryName })
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
    categoryInfo: recipe.categoryId
      ? { 
          categoryId: recipe.categoryId,
          categoryName: recipe.category,
        }
      : undefined,

    viewedAt: new Date(recipe.viewedAt),
    recipeDetailMeta: recipe.description? {
      description: recipe.description,
      servings: recipe.servings,
      cookTime: recipe.cookTime,
    } : undefined,
    tags: recipe.tags ? recipe.tags.map((tag: any) => ({
      name: tag.name,
    })) : undefined,
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
