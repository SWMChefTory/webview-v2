import client from "@/src/shared/client/main/client";
import { z } from "zod";
import { RecipeStatus, RecipeProgressDetail, RecipeProgressStep } from "./enum";
import { createCursorPaginatedSchema } from "@/src/entities/schema/pagenation/paginatedSchema";
import { parseWithErrLog } from "@/src/entities/schema/logger/zodErrorLogger";
import { UserRecipesSchema } from "./schema";

export const PaginatedSchema = createCursorPaginatedSchema(UserRecipesSchema);
export type PaginatedRecipes = z.infer<typeof PaginatedSchema>;

export async function fetchAllRecipesSummary({
  cursor,
}: {
  cursor: string | null | undefined;
}) {
  const path = "/recipes/recent";
  const response = await (async () => {
    if (cursor !== undefined) {
      if (cursor === null) {
        return await client.get(path, { params: { cursor: null } });
      }
      return await client.get(path, {
        params: { cursor },
      });
    }
    return await client.get(path);
  })();

  const data = response.data;
  return parseWithErrLog(PaginatedSchema, {
    ...data,
    data: data.recentRecipes.map((recipe: any) => transformRecipe(recipe)),
  });
}

export async function fetchCategorizedRecipesSummary({
  categoryId,
  categoryName,
  cursor,
}: {
  categoryId: string;
  categoryName: string;
  cursor: string | null | undefined;
}): Promise<PaginatedRecipes> {
  const path = `/recipes/categorized/${categoryId}`
  const response = await (async () => {
    if (cursor !== undefined) {
      if (cursor === null) {
        return await client.get(path, { params: { cursor: null } });
      }
      return await client.get(path, {
        params: { cursor },
      });
    }
    return await client.get(path);
  })();

  const data = response.data;
  return parseWithErrLog(PaginatedSchema, {
    ...data,
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

const transformRecipe = (recipe: any) => {
  return {
    recipeId: recipe.recipeId,
    videoInfo: {
      videoId: recipe.videoId,
      videoTitle: recipe.recipeTitle,
      channelTitle: recipe.channelTitle,
      videoThumbnailUrl: recipe.videoThumbnailUrl,
      videoSeconds: recipe.videoSeconds,
      videoType: recipe?.videoType ?? "NORMAL",
    },
    viewedAt: new Date(recipe.viewedAt),
    viewStatus: {
      id: recipe.recipeId,
      viewedAt: new Date(recipe.viewedAt),
      lastPlaySeconds: recipe.lastPlaySeconds,
      createdAt: new Date(recipe.viewedAt),
    },
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


//레시피 진행 상태 조회, user가 소유한 레시피가 아니더라도 조회할 수 있음.
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

const BookmarkResponseSchema = z.object({
  message: z.string(),
});

export type BookmarkResponse = z.infer<typeof BookmarkResponseSchema>;

export async function enrollBookmark(recipeId: string): Promise<BookmarkResponse> {
  const response = await client.post(`/recipes/${recipeId}/bookmark`);
  return parseWithErrLog(BookmarkResponseSchema, response.data);
}

export async function cancelBookmark(recipeId: string): Promise<void> {
  return await client.delete(`/recipes/${recipeId}/bookmark`);
}
