import { z } from "zod";

export const RecipeTagSchema = z.object({
  name: z.string(),
});

export const RecipeOverviewSchema = z.object({
  recipeId: z.string(),
  recipeTitle: z.string(),
  tags: z.array(RecipeTagSchema),
  isViewed: z.boolean(),
  description: z.string(),
  servings: z.number().int(),
  cookingTime: z.number().int(),
  videoId: z.string(),
  count: z.number().int(),
  videoUrl: z.string(),
  videoType: z.string(),
  videoThumbnailUrl: z.string(),
  videoSeconds: z.number().int(),
});

// 타입 뽑아 쓰고 싶으면
export type RecipeOverview = z.infer<typeof RecipeOverviewSchema>;
export type RecipeTag = z.infer<typeof RecipeTagSchema>;
