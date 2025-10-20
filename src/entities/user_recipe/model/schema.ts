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

export const getElapsedTime = (viewedAt: Date) => {
  const now = new Date();
  const elapsedMilliSec = now.getTime() - viewedAt.getTime();
  const totalElapsedSec = Math.floor(elapsedMilliSec / 1000);

  const elapsedMinutes = Math.floor(totalElapsedSec / 60) % 60;
  const elapsedHours = Math.floor(totalElapsedSec / 60 / 60) % 24;
  const elapsedDays = Math.floor(totalElapsedSec / 60 / 60 / 24) % 30;
  const elapsedMonths = Math.floor(totalElapsedSec / 60 / 60 / 24 / 30) % 12;
  const elapsedYears = Math.floor(totalElapsedSec / 60 / 60 / 24 / 30 / 12);

  if (elapsedYears > 0) {
    return `${elapsedYears}년 전`;
  }
  if (elapsedMonths > 0) {
    return `${elapsedMonths}개월 전`;
  }
  if (elapsedDays > 0) {
    return `${elapsedDays}일 전`;
  }
  if (elapsedHours > 0) {
    return `${elapsedHours}시간 전`;
  }
  if (elapsedMinutes > 0) {
    return `${elapsedMinutes}분 전`;
  }
  return "방금 전";
}

export const UserRecipesSchema = z.array(UserRecipeSchema);


export type UserRecipe = z.infer<typeof UserRecipeSchema>;
export type VideoInfo = z.infer<typeof VideoInfoSchema>;