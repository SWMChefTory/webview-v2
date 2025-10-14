import {z} from "zod";

export const RecipeCreationInfoSchema = z.object({
  videoUrl: z.string(),
  categoryId: z.string(),
});

export type RecipeCreationInfo = z.infer<typeof RecipeCreationInfoSchema>;