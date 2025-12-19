import { z } from "zod";
import { RecipeTagSchema } from "@/src/shared/schema/recipeSchema";
import createPaginatedSchema from "@/src/shared/schema/paginatedSchema";

// ============================================
// 챌린지 정보 스키마
// ============================================

export const ChallengeInfoSchema = z.object({
  isParticipant: z.literal(true),
  challengeType: z.enum(["SINGLE", "HOUSEWIFE"]),
  challengeName: z.string(),
  completedCount: z.number(),
  totalCount: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  kakaoOpenChatUrl: z.string(),
});

export const NonParticipantSchema = z.object({
  isParticipant: z.literal(false),
});

// Discriminated Union으로 타입 안전성 확보
export const ChallengeDataSchema = z.discriminatedUnion("isParticipant", [
  ChallengeInfoSchema,
  NonParticipantSchema,
]);

export type ChallengeInfo = z.infer<typeof ChallengeInfoSchema>;
export type NonParticipant = z.infer<typeof NonParticipantSchema>;
export type ChallengeData = z.infer<typeof ChallengeDataSchema>;

// ============================================
// 챌린지 레시피 스키마
// ============================================

export const ChallengeRecipeSchema = z.object({
  recipeId: z.string(),
  recipeTitle: z.string(),
  tags: z.array(RecipeTagSchema).optional(),
  description: z.string().optional(),
  servings: z.number().optional(),
  cookingTime: z.number().optional(),
  videoId: z.string(),
  videoThumbnailUrl: z.string(),
  videoSeconds: z.number().optional(),
  videoType: z.enum(["SHORTS", "NORMAL"]).optional(),
});

export type ChallengeRecipe = z.infer<typeof ChallengeRecipeSchema>;

// 페이지네이션 (기존 유틸 재사용)
export const PaginatedChallengeRecipesSchema = createPaginatedSchema(
  z.array(ChallengeRecipeSchema)
);

export type PaginatedChallengeRecipes = z.infer<
  typeof PaginatedChallengeRecipesSchema
>;
