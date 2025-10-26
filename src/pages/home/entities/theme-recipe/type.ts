import { z } from "zod";
import createPaginatedSchema from "@/src/shared/schema/paginatedSchema";

export const ThemeRecipeSchema = z.object({
  recipeId: z.string(),
  recipeTitle: z.string(),
  videoThumbnailUrl: z.string(),
  videoId: z.string(),
  count: z.number(),
  videoUrl: z.string(),
  isViewed: z.boolean(),
  videoType: z.string(),
});

export const ThemeRecipesSchema = z.array(ThemeRecipeSchema);

export const ThemeRecipePageResponseSchema = createPaginatedSchema(ThemeRecipesSchema);

export type ThemeRecipe = z.infer<typeof ThemeRecipeSchema>;
export type ThemeRecipePageResponse = z.infer<typeof ThemeRecipePageResponseSchema>;
export type ThemeRecipes = z.infer<typeof ThemeRecipesSchema>;