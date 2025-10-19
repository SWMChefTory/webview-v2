import { z } from "zod";
import { RecipeDetailMetaSchema, RecipeTagSchema } from "@/src/shared/schema/recipeSchema";

export const VideoInfoSchema = z.object({
  thumbnailUrl: z.string(),
  id: z.string(),
  seconds: z.number(),
  lastPlaySeconds: z.number(),
});

export const UserRecipeSchema = z.object({
  recipeId: z.string(),
  title: z.string(),
  videoInfo: VideoInfoSchema,
  recipeDetailMeta: RecipeDetailMetaSchema.optional(),
  tags: z.array(RecipeTagSchema).optional(),
  viewedAt: z.date(),
});

export const UserRecipesSchema = z.array(UserRecipeSchema);


export type UserRecipe = z.infer<typeof UserRecipeSchema>;
export type VideoInfo = z.infer<typeof VideoInfoSchema>;