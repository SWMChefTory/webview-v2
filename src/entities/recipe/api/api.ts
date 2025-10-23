import client from "@/src/shared/client/main/client";
import {
  IngredientSchema,
  RecipeBriefingSchema,
  RecipeDetailMetaSchema,
  RecipeStatusSchema,
  RecipeStepDetailSchema,
  RecipeStepSchema,
  RecipeTagSchema,
} from "@/src/shared/schema/recipeSchema";
import { VideoInfoSchema } from "@/src/shared/schema/videoInfoSchema";
import { z } from "zod";

const ViewStatusSchema = z.object({
  id: z.string(),
  viewedAt: z.string(),
  lastPlaySeconds: z.number(),
  createdAt: z.string(),
});

const RecipeSchema = z.object({
  videoInfo: VideoInfoSchema,
  recipeStatus: RecipeStatusSchema,
  viewStatus: ViewStatusSchema,
  recipeDetailMeta: RecipeDetailMetaSchema.optional(),
  recipeIngredient: z.array(IngredientSchema).optional(),
  recipeSteps: z.array(RecipeStepSchema).optional(),
  recipeTags: z.array(RecipeTagSchema).optional(),
  recipeBriefings: z.array(RecipeBriefingSchema).optional(),
});

export type VideoInfoResponse = z.infer<typeof VideoInfoSchema>;
export type IngredientResponse = z.infer<typeof IngredientSchema>;
export type RecipeStepDetailResponse = z.infer<typeof RecipeStepDetailSchema>;
export type RecipeStepResponse = z.infer<typeof RecipeStepSchema>;
export type RecipeTagResponse = z.infer<typeof RecipeTagSchema>;
export type RecipeBriefingResponse = z.infer<typeof RecipeBriefingSchema>;
export type ViewStatusResponse = z.infer<typeof ViewStatusSchema>;
export type RecipeDetailMetaResponse = z.infer<typeof RecipeDetailMetaSchema>;
export type RecipeResponse = z.infer<typeof RecipeSchema>;

export const fetchRecipe = async (id: string): Promise<RecipeResponse> => {
  const response = await client.get(`/recipes/${id}`);
  console.log("response", JSON.stringify(response.data, null, 2));
  const data = response.data;
  return RecipeSchema.parse(data);
};
