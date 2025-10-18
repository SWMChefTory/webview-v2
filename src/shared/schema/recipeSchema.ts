import { RecipeStatus } from "@/src/shared/enums/recipe";
import z from "zod";

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

const RecipeStatusSchema = z.enum([
  RecipeStatus.SUCCESS,
  RecipeStatus.FAILED,
  RecipeStatus.IN_PROGRESS,
]);

export type RecipeDetailMetaResponse = z.infer<typeof RecipeDetailMetaSchema>;
export type RecipeTagResponse = z.infer<typeof RecipeTagSchema>;

export {
  RecipeDetailMetaSchema,
  IngredientSchema,
  RecipeStepDetailSchema,
  RecipeStepSchema,
  RecipeTagSchema,
  RecipeBriefingSchema,
  RecipeStatusSchema,
};
