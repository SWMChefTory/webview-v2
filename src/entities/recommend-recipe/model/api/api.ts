import { z } from "zod";

import {
  RecipeDetailMetaSchema,
  RecipeTagSchema,
} from "@/src/entities/schema/recipe/recipeSchema";
import { VideoInfoSchema } from "@/src/entities/schema/recipe/videoInfoSchema";
import { createCursorPaginatedSchema } from "@/src/entities/schema/pagenation/paginatedSchema";
import { parseWithErrLog } from "@/src/entities/schema/logger/zodErrorLogger";
import client from "@/src/shared/client/main/client";

import { RecommendType, VideoTypeQuery } from "./schema/enum";

const RecommendRecipeSchema = z.object({
  recipeId: z.string(),
  recipeTitle: z.string(),
  tags: z.array(RecipeTagSchema),
  isViewed: z.boolean(),
  videoInfo: VideoInfoSchema,
  detailMeta: RecipeDetailMetaSchema,
  creditCost: z.number(),
});

const RecommendRecipesSchema = z.array(RecommendRecipeSchema);

const PaginatedRecommendRecipeSchema = createCursorPaginatedSchema(
  RecommendRecipesSchema,
);

export type RecommendRecipe = z.infer<typeof RecommendRecipeSchema>;
export type PaginatedRecommendRecipeResponse = z.infer<
  typeof PaginatedRecommendRecipeSchema
>;

export const fetchRecommendRecipes = async ({
  cursor,
  recommendType,
  videoType = VideoTypeQuery.ALL,
}: {
  cursor: string | undefined | null;
  recommendType: RecommendType;
  videoType?: VideoTypeQuery;
}): Promise<PaginatedRecommendRecipeResponse> => {
  const path = `/recipes/recommend/${recommendType}`;
  const response = await (async () => {
    if (cursor !== undefined) {
      if (cursor === null) {
        return await client.get(path, {
          params: { cursor: null, query: videoType },
        });
      }
      return await client.get(path, {
        params: { cursor, query: videoType },
      });
    }
    return await client.get(path, {
      params: { query: videoType },
    });
  })();

  if (!response.data || Object.keys(response.data).length === 0) {
    throw new Error("No data");
  }
  
  const rawData = response.data;
  const transformed = {
    nextCursor: rawData.nextCursor,
    hasNext: rawData.hasNext,
    data: (rawData.recommendRecipes).map((item : any) => ({
      recipeId: item.recipeId,
      recipeTitle: item.recipeTitle,
      tags: item.tags,
      isViewed: item.isViewed ?? false,
      videoInfo: {
        videoId: item.videoId,
        videoThumbnailUrl: item.videoThumbnailUrl,
        videoSeconds: item.videoSeconds,
        videoTitle: item.recipeTitle,
        channelTitle: item.channelTitle,
        videoType: item.videoType,
      },
      detailMeta: {
        description: item.description,
        servings: item.servings,
        cookingTime: item.cookingTime,
      },
      creditCost: item.creditCost,
    })),
  };
  return parseWithErrLog(PaginatedRecommendRecipeSchema, transformed);
};
