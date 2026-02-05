import client from "@/src/shared/client/main/client";
import { z } from "zod";

import {
  RecipeDetailMetaSchema,
  RecipeTagSchema,
} from "@/src/entities/schema/recipe/recipeSchema";
import { VideoInfoSchema } from "@/src/entities/schema/recipe/videoInfoSchema";
import { createCursorPaginatedSchema } from "@/src/entities/schema/pagenation/paginatedSchema";
import { parseWithErrLog } from "@/src/entities/schema/logger/zodErrorLogger";

import { CuisineType } from "./schema/enum";

const RawCuisineRecipeSchema = z.object({
  recipeId: z.string(),
  recipeTitle: z.string(),
  tags: z.array(RecipeTagSchema),
  isViewed: z.boolean().optional(),
  description: z.string(),
  servings: z.number(),
  cookingTime: z.number(),
  videoId: z.string(),
  count: z.number(),
  videoUrl: z.string(),
  videoType: z.enum(["SHORTS", "NORMAL"]),
  videoThumbnailUrl: z.string(),
  channelTitle: z.string(),
  videoSeconds: z.number(),
  creditCost: z.number(),
});

const CuisineRecipeSchema = z.object({
  recipeId: z.string(),
  recipeTitle: z.string(),
  tags: z.array(RecipeTagSchema).optional(),
  isViewed: z.boolean().optional(),
  videoInfo: VideoInfoSchema,
  detailMeta: RecipeDetailMetaSchema.optional(),
  creditCost: z.number(),
});

const CuisineRecipesSchema = z.array(CuisineRecipeSchema);

const PaginatedCuisineRecipeSchema =
  createCursorPaginatedSchema(CuisineRecipesSchema);

export type CuisineRecipe = z.infer<typeof CuisineRecipeSchema>;
export type PaginatedCuisineRecipeResponse = z.infer<
  typeof PaginatedCuisineRecipeSchema
>;

export const fetchCuisineRecipes = async ({
  cursor,
  cuisineType,
}: {
  cursor: string | null | undefined;
  cuisineType: CuisineType;
}): Promise<PaginatedCuisineRecipeResponse> => {
  const path = `/recipes/cuisine/${cuisineType}`;

  const response = await (async () => {
    if (cursor === undefined) {
      return await client.get(path);
    }
    if (cursor === null) {
      return await client.get(path, { params: { cursor: null } });
    }
    return await client.get(path, {
      params: { cursor },
    });
  })();

  if (!response.data || Object.keys(response.data).length === 0) {
    throw new Error("No data");
  }

  const rawRecipes = z
    .array(RawCuisineRecipeSchema)
    .parse(response.data.cuisineRecipes || []);

  const data = {
    ...response.data,
    data: rawRecipes.map((recipe) => ({
      recipeId: recipe.recipeId,
      recipeTitle: recipe.recipeTitle,
      tags: recipe.tags,
      isViewed: recipe.isViewed,
      videoInfo: {
        videoId: recipe.videoId,
        videoTitle: recipe.recipeTitle,
        channelTitle: recipe.channelTitle,
        videoThumbnailUrl: recipe.videoThumbnailUrl,
        videoSeconds: recipe.videoSeconds,
        videoType: recipe.videoType,
      },
      detailMeta: {
        description: recipe.description,
        servings: recipe.servings,
        cookingTime: recipe.cookingTime,
      },
      creditCost: recipe.creditCost,
    })),
  };

  return parseWithErrLog(PaginatedCuisineRecipeSchema, data);
};
