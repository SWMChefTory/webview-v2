import client from "@/src/shared/client/main/client";
import { z } from "zod";
import {
  RecipeDetailMetaSchema,
  RecipeTagSchema,
  RecipeStatusSchema,
} from "@/src/shared/schema/recipeSchema";
import { VideoInfoSchema } from "@/src/shared/schema/videoInfoSchema";
import createPaginatedSchema from "@/src/shared/schema/paginatedSchema";
import { parseWithErrLog } from "@/src/shared/schema/zodErrorLogger";

const RecipeSchema = z.object({
  recipeId: z.string(),
  recipeTitle: z.string(),
  tags: z.array(RecipeTagSchema).optional(),
  videoInfo: VideoInfoSchema,
  detailMeta: RecipeDetailMetaSchema.optional(),
});

const RecipesSchema = z.array(RecipeSchema);

const PaginatedRecipeSchema = createPaginatedSchema(RecipesSchema);

export type VideoInfoResponse = z.infer<typeof VideoInfoSchema>;
export type RecipeTagResponse = z.infer<typeof RecipeTagSchema>;
export type Recipe = z.infer<typeof RecipeSchema>;
export type PaginatedRecipeResponse = z.infer<typeof PaginatedRecipeSchema>;

export const fetchRecipesSearched = async ({
  page,
  query,
}: {
  page: number;
  query: string;
}): Promise<PaginatedRecipeResponse> => {
  const url = `/recipes/search?query=${encodeURIComponent(query)}&page=${page}`;
  console.log("요청 url: ", url);

  const response = await client.get(url);
  const data = {
    currentPage: response.data.currentPage,
    totalPages: response.data.totalPages,
    totalElements: response.data.totalElements,
    hasNext: response.data.hasNext,
    data: response.data.searchedRecipes,
  };
  console.log("search recipes: ", JSON.stringify(data, null, 2));
  return parseWithErrLog(PaginatedRecipeSchema, data);
};
