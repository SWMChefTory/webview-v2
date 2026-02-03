import client from "@/src/shared/client/main/client";
import { z } from "zod";
import {
  RecipeStatus,
  RecipeProgressDetail,
  RecipeProgressStep,
} from "@/src/entities/user-recipe/type/type";
import { createCursorPaginatedSchema } from "@/src/shared/schema/paginatedSchema";
import { parseWithErrLog } from "@/src/shared/schema/zodErrorLogger";
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

  console.log("fetchAllRecipesSummary", JSON.stringify(response.data, null, 2));

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
