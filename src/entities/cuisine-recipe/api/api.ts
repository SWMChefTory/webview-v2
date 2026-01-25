import client from "@/src/shared/client/main/client";
import { z } from "zod";
import {
  RecipeDetailMetaSchema,
  RecipeTagSchema,
} from "@/src/shared/schema/recipeSchema";
import { VideoInfoSchema } from "@/src/shared/schema/videoInfoSchema";
import { createCursorPaginatedSchema } from "@/src/shared/schema/paginatedSchema";
import { parseWithErrLog } from "@/src/shared/schema/zodErrorLogger";
import { CuisineType } from "@/src/entities/cuisine-recipe/type/cuisineType";

// API 원시 응답 데이터 스키마
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
  videoSeconds: z.number(),
  creditCost: z.number(),
});

// 변환된 레시피 스키마
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
      params: { cursor: cursor },
    });
  })();

  // 빈 응답 처리
  if (!response.data || Object.keys(response.data).length === 0) {
    throw new Error("No data");
  }

  // API 응답 데이터 파싱
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

// export async function fetchPopularSummary({
//   cursor,
//   recommendType,
//   videoType,
// }: {
//   cursor: string | null | undefined;
//   recommendType: RecommendType;
//   videoType?: VideoType;
// }): Promise<PopularSummaryRecipePagenatedResponse> {
//   const path = `/recipes/recommend/${recommendType}`;
//   const response = await (async () => {
//     if (cursor === undefined) {
//       return await client.get(path, {
//         params: {
//           query: videoType,
//         },
//       });
//     }
//     return await client.get(path, {
//       params: {
//         query: videoType,
//         cursor: cursor,
//       },
//     });
//   })();

//   return parseWithErrLog(PopularSummaryRecipePagenatedResponse, {
//     hasNext: response.data.hasNext,
//     nextCursor: response.data.nextCursor,
//     data: response.data.recommendRecipes,
//   });
// }
