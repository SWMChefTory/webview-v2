import client from "@/src/shared/client/main/client";
import { z } from "zod";
import {
  RecipeDetailMetaSchema,
  RecipeTagSchema,
} from "@/src/shared/schema/recipeSchema";
import { VideoInfoSchema } from "@/src/shared/schema/videoInfoSchema";
import { createCursorPaginatedSchema } from "@/src/shared/schema/paginatedSchema";
import { parseWithErrLog } from "@/src/shared/schema/zodErrorLogger";
import { RecommendType } from "@/src/entities/recommend-recipe/type/recommendType";
import { VideoType } from "../type/videoType";

// API 원시 응답 데이터 스키마
const RawRecommendRecipeSchema = z.object({
  recipeId: z.string(),
  recipeTitle: z.string(),
  tags: z.array(RecipeTagSchema),
  isViewed: z.boolean().optional(),
  description: z.string(),
  servings: z.number(),
  cookingTime: z.number(),
  videoId: z.string(),
  videoThumbnailUrl: z.string(),
  videoSeconds: z.number(),
  videoType: z.enum(["SHORTS", "NORMAL"]),
  creditCost: z.number(),
});

// 변환된 레시피 스키마
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
  RecommendRecipesSchema
);

export type RecommendRecipe = z.infer<typeof RecommendRecipeSchema>;
export type PaginatedRecommendRecipeResponse = z.infer<
  typeof PaginatedRecommendRecipeSchema
>;

export const fetchRecommendRecipes = async ({
  cursor,
  recommendType,
  videoType = VideoType.ALL,
}: {
  cursor: string | undefined | null;
  recommendType: RecommendType;
  videoType?: VideoType;
}): Promise<PaginatedRecommendRecipeResponse> => {
  const path = `/recipes/recommend/${recommendType}`;
  const response = await (async () => {
    if (cursor !== undefined) {
      if (cursor === null) {
        return await client.get(path, { params: { cursor: null, query:videoType } });
      }
      return await client.get(path, {
        params: { cursor: cursor, query:videoType },
      });
    }
    return await client.get(path, {
      params: { query:videoType },
    });
  })();

  // 빈 응답 처리
  if (!response.data || Object.keys(response.data).length === 0) {
    throw new Error("No data");
  }

  // API 응답 데이터 파싱
  const rawRecipes = z
    .array(RawRecommendRecipeSchema)
    .parse(response.data.recommendRecipes || []);

  const data = {
    nextCursor: response.data.nextCursor,
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
      creditCost: recipe.creditCost,
    })),
  };

  return parseWithErrLog(PaginatedRecommendRecipeSchema, data);
};
