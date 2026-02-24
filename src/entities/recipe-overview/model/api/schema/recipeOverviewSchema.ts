import { z } from "zod";

export const RecipeTagSchema = z.object({
  name: z.string(),
});

//success이후에만 호출해야함.
export const RecipeOverviewSchema = z.object({
  recipeId: z.string(),
  recipeTitle: z.string(),
  tags: z.array(RecipeTagSchema).optional(),
  isViewed: z.boolean(),
  description: z.string().optional(),
  servings: z.number().int().optional(),
  cookingTime: z.number().int().optional(),
  videoId: z.string(),
  count: z.number().int().optional(),
  videoUrl: z.string(),
  videoType: z.string(),
  videoThumbnailUrl: z.string(),
  videoSeconds: z.number().int(),
  creditCost: z.number(),
});

export type RecipeOverview = z.infer<typeof RecipeOverviewSchema>;
export type RecipeTag = z.infer<typeof RecipeTagSchema>;
