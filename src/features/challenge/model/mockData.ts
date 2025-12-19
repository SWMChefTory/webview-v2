import type {
  Participant,
  NonParticipant,
  CompleteRecipe,
} from "./schema";

// ============================================
// 참여자 Mock (API 1 - 변환된 형태)
// ============================================

export const MOCK_PARTICIPANT: Participant = {
  isParticipant: true,
  challengeId: "mock-challenge-1",
  challengeType: "SINGLE",
  startDate: "2025-12-22T00:00:00",
  endDate: "2025-12-28T23:59:59",
};

// ============================================
// 비참여자 Mock
// ============================================

export const MOCK_NON_PARTICIPANT: NonParticipant = {
  isParticipant: false,
};

// ============================================
// 완료된 레시피 Mock
// ============================================

export const MOCK_COMPLETE_RECIPES: CompleteRecipe[] = [
  { recipeId: "challenge-recipe-1" },
  { recipeId: "challenge-recipe-2" },
];
