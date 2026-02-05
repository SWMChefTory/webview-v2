import { z } from "zod";
import { RecipeDetailMetaSchema, RecipeTagSchema } from "@/src/entities/schema/recipe/recipeSchema";
import { VideoInfoSchema } from "../../../schema/recipe/videoInfoSchema";

/**
 * 북마크/시청정보
 * id: 북마크/시청정보 id
 * viewedAt: 북마크/시청정보 생성일시
 * lastPlaySeconds: 북마크/시청정보 마지막 재생 시간
 * createdAt: 북마크/시청정보 생성일시
 */
export const ViewStatusSchema = z.object({
  id: z.string(),
  viewedAt: z.date(),
  lastPlaySeconds: z.number(),
  createdAt: z.date(),
});

export type ViewStatus = z.infer<typeof ViewStatusSchema>;

export const UserRecipeSchema = z.object({
  recipeId: z.string(),
  viewStatus: ViewStatusSchema.optional(),
  videoInfo: VideoInfoSchema,
  recipeDetailMeta: RecipeDetailMetaSchema.optional(),
  tags: z.array(RecipeTagSchema).optional(),
  createdAt: z.date(),
});

export type UserRecipe = z.infer<typeof UserRecipeSchema>;

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

export type UserRecipes = z.infer<typeof UserRecipesSchema>;
