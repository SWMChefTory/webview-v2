import client from "@/src/shared/client/main/client";
import { z } from "zod";

import {
  RecipeDetailMetaSchema,
  RecipeTagSchema,
  RecipeStatusSchema,
} from "@/src/entities/schema/recipe/recipeSchema";
import { VideoInfoSchema } from "@/src/entities/schema/recipe/videoInfoSchema";
import { createCursorPaginatedSchema } from "@/src/entities/schema/pagenation/paginatedSchema";
import { parseWithErrLog } from "@/src/entities/schema/logger/zodErrorLogger";

const RawSearchRecipeSchema = z.object({
  recipeId: z.string(),
  recipeTitle: z.string(),
  tags: z.array(RecipeTagSchema),
  isViewed: z.boolean(),
  description: z.string(),
  servings: z.number(),
  cookingTime: z.number(),
  videoId: z.string(),
  channelTitle: z.string(),
  count: z.number(),
  videoUrl: z.string(),
  videoType: z.enum(["SHORTS", "NORMAL"]),
  videoThumbnailUrl: z.string(),
  videoSeconds: z.number(),
  creditCost: z.number(),
});

const RecipeSchema = z.object({
  recipeId: z.string(),
  recipeTitle: z.string(),
  isViewed: z.boolean(),
  tags: z.array(RecipeTagSchema),
  videoInfo: VideoInfoSchema,
  detailMeta: RecipeDetailMetaSchema,
  creditCost: z.number(),
  videoUrl: z.string(),
});

const RecipesSchema = z.array(RecipeSchema);

const PaginatedRecipeSchema = createCursorPaginatedSchema(RecipesSchema);

export type VideoInfoResponse = z.infer<typeof VideoInfoSchema>;
export type RecipeTagResponse = z.infer<typeof RecipeTagSchema>;
export type Recipe = z.infer<typeof RecipeSchema>;
export type PaginatedRecipeResponse = z.infer<typeof PaginatedRecipeSchema>;

export const fetchRecipesSearched = async ({
  query,
  cursor,
}: {
  query: string;
  cursor: string | undefined | null;
}): Promise<PaginatedRecipeResponse> => {
  const path = `/recipes/search?query=${
    query ? encodeURIComponent(query) : "''"
  }`;

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

  const rawRecipes = z
    .array(RawSearchRecipeSchema)
    .parse(response.data.searchedRecipes || []);

  const data = {
    nextCursor: response.data.nextCursor,
    hasNext: response.data.hasNext,
    data: rawRecipes.map((recipe) => ({
      recipeId: recipe.recipeId,
      recipeTitle: recipe.recipeTitle,
      tags: recipe.tags,
      isViewed: recipe.isViewed,
      videoUrl: recipe.videoUrl,
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

  return parseWithErrLog(PaginatedRecipeSchema, data);
};
