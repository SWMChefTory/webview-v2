import { z } from "zod";
import { RecipeTagSchema } from "@/src/entities/schema/recipe/recipeSchema";
import { CHALLENGE_TYPES } from "./types";

// ============================================
// 챌린지 참여자 정보 스키마
// ============================================

// 참여자 정보 (API 성공 시, API 레이어에서 변환)
export const ParticipantSchema = z.object({
  isParticipant: z.literal(true),
  challengeId: z.string(), // 레시피 API 호출에 필요
  challengeType: z.enum(CHALLENGE_TYPES),
  startDate: z.string(), // API에서 start_at → startDate 변환
  endDate: z.string(), // API에서 end_at → endDate 변환
});

// 비참여자 (API 에러 시)
export const NonParticipantSchema = z.object({
  isParticipant: z.literal(false),
});

// Discriminated Union으로 타입 안전성 확보
export const ChallengeDataSchema = z.discriminatedUnion("isParticipant", [
  ParticipantSchema,
  NonParticipantSchema,
]);

// ============================================
// 완료된 레시피 스키마
// ============================================

export const CompleteRecipeSchema = z.object({
  recipeId: z.string(),
});

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
  videoUrl: z.string().optional(), // 추가
  videoType: z.enum(["SHORTS", "NORMAL"]).optional(),
  videoThumbnailUrl: z.string(),
  videoSeconds: z.number().optional(),
  isViewed: z.boolean().optional(),
});

// ============================================
// 챌린지 레시피 목록 응답 스키마 (API 2 전체 응답)
// ============================================

export const ChallengeRecipesResponseSchema = z.object({
  completeRecipes: z.array(CompleteRecipeSchema),
  challengeRecipes: z.array(ChallengeRecipeSchema),
  currentPage: z.number(),
  totalPages: z.number(),
  totalElements: z.number(),
  hasNext: z.boolean(),
});

// ============================================
// 타입 export
// ============================================

export type Participant = z.infer<typeof ParticipantSchema>;
export type NonParticipant = z.infer<typeof NonParticipantSchema>;
export type ChallengeData = z.infer<typeof ChallengeDataSchema>;
export type CompleteRecipe = z.infer<typeof CompleteRecipeSchema>;
export type ChallengeRecipe = z.infer<typeof ChallengeRecipeSchema>;
export type ChallengeRecipesResponse = z.infer<
  typeof ChallengeRecipesResponseSchema
>;
