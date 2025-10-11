import {z} from "zod";

export const RecipeCreationInfoSchema = z.object({
  videoUrl: z.string(),
});

export type RecipeCreationInfo = z.infer<typeof RecipeCreationInfoSchema>;