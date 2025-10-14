import client from "@/src/shared/client/main/client";
import { RecipeStatus } from "../enums/recipeStatus";
import { z } from "zod";

const VideoInfoSchema = z.object({
  videoId: z.string(),
  videoTitle: z.string(),
  videoThumbnailUrl: z.string(),
  videoSeconds: z.number(),
});

const ViewStatusSchema = z.object({
  id: z.string(),
  viewedAt: z.string(),
  lastPlaySeconds: z.number(),
  createdAt: z.string(),
});

const RecipeDetailMetaSchema = z.object({
  description: z.string(),
  servings: z.number(),
  cookingTime: z.number(),
});

const IngredientSchema = z.object({
  name: z.string(),
  amount: z.number().optional(),
  unit: z.string().optional(),
});

const RecipeStepDetailSchema = z.object({
  text: z.string(),
  start: z.number(),
});

const RecipeStepSchema = z.object({
  id: z.string(),
  stepOrder: z.number(),
  subtitle: z.string(),
  startTime: z.number(),
  details: z.array(RecipeStepDetailSchema),
});

const RecipeTagSchema = z.object({
  name: z.string(),
});

const RecipeBriefingSchema = z.object({
  content: z.string(),
});

const RecipeSchema = z.object({
    recipeStatus: z.enum([RecipeStatus.SUCCESS, RecipeStatus.FAILED, RecipeStatus.IN_PROGRESS]),
  videoInfo: VideoInfoSchema,
  viewStatus: ViewStatusSchema,
  recipeDetailMeta: RecipeDetailMetaSchema.optional(),
  recipeIngredient: z.array(IngredientSchema).optional(),
  recipeSteps: z.array(RecipeStepSchema).optional(),
  recipeTags: z.array(RecipeTagSchema).optional(),
  recipeBriefing: z.array(RecipeBriefingSchema).optional(),
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
  const data = response.data;
  return RecipeSchema.parse(data);
};

