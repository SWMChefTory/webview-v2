import client from "@/src/shared/client/main/client";
import { fetchAllRecipesSummary } from "@/src/entities/user-recipe/model/api";
import type { UserRecipe } from "@/src/entities/user-recipe/model/schema";
import {
  ParticipantSchema,
  NonParticipantSchema,
  ChallengeRecipesResponseSchema,
  type ChallengeData,
  type ChallengeRecipe,
  type ChallengeRecipesResponse,
} from "../model/schema";
import {
  MOCK_PARTICIPANT,
  MOCK_COMPLETE_RECIPES,
} from "../model/mockData";

// ============================================
// Mock 모드 설정
// ============================================

const USE_MOCK = process.env.NEXT_PUBLIC_CHALLENGE_USE_MOCK === "true";

// ============================================
// 챌린지 정보 조회
// ============================================

export async function fetchChallengeInfo(): Promise<ChallengeData> {
  if (USE_MOCK) {
    // 개발 시 Mock 데이터 반환
    // 비참여자 테스트: MOCK_NON_PARTICIPANT로 변경
    await simulateNetworkDelay();
    return MOCK_PARTICIPANT;
  }

  try {
    const response = await client.get("/recipes/challenge");
    const data = response.data;

    // snake_case → camelCase 변환 + Zod 검증
    return ParticipantSchema.parse({
      isParticipant: true,
      challengeId: data.challengeId,
      challengeType: data.type,
      startDate: data.startAt,
      endDate: data.endAt,
    });
  } catch {
    // 챌린지 없음 = 비참여자
    return NonParticipantSchema.parse({ isParticipant: false });
  }
}

// ============================================
// 챌린지 레시피 목록 조회
// ============================================

export async function fetchChallengeRecipes({
  challengeId,
  page,
}: {
  challengeId: string;
  page: number;
}): Promise<ChallengeRecipesResponse> {
  if (USE_MOCK) {
    // Mock 모드: 나의 레시피 API를 호출하여 테스트 데이터로 활용
    await simulateNetworkDelay();
    const myRecipes = await fetchAllRecipesSummary({ cursor: null });
    return {
      completeRecipes: MOCK_COMPLETE_RECIPES,
      challengeRecipes: myRecipes.data.map(convertUserRecipeToChallengeRecipe),
      currentPage: page,
      totalPages: 1,
      totalElements: myRecipes.data.length,
      hasNext: false,
    };
  }

  // 실제 API 호출 (에러 시 상위로 전파 - ErrorBoundary에서 처리)
  const response = await client.get(
      `/recipes/challenge/${challengeId}?page=${page}`
  );

  // snake_case → camelCase 변환 + Zod 검증
  return ChallengeRecipesResponseSchema.parse({
    completeRecipes: response.data.completeRecipes.map(
        (r: { recipeId: string }) => ({
          recipeId: r.recipeId,
        })
    ),
    challengeRecipes: response.data.challengeRecipes.map(
        (r: {
          recipeId: string;
          recipeTitle: string;
          tags?: { name: string }[];
          description?: string;
          servings?: number;
          cookingTime?: number;
          videoId: string;
          videoUrl?: string;
          videoType?: string;
          videoThumbnailUrl: string;
          videoSeconds?: number;
          isViewed?: boolean;
        }) => ({
          recipeId: r.recipeId,
          recipeTitle: r.recipeTitle,
          tags: r.tags,
          description: r.description,
          servings: r.servings,
          cookingTime: r.cookingTime,
          videoId: r.videoId,
          videoUrl: r.videoUrl,
          videoType: r.videoType,
          videoThumbnailUrl: r.videoThumbnailUrl,
          videoSeconds: r.videoSeconds,
          isViewed: r.isViewed,
        })
    ),
    currentPage: response.data.currentPage,
    totalPages: response.data.totalPages,
    totalElements: response.data.totalElements,
    hasNext: response.data.hasNext,
  });
}

// ============================================
// 유틸리티
// ============================================

/**
 * Mock 모드에서 네트워크 지연 시뮬레이션
 * 로딩 상태 테스트용 (500ms)
 */
function simulateNetworkDelay(ms: number = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * UserRecipe → ChallengeRecipe 변환
 * Mock 모드에서 나의 레시피 데이터를 챌린지 형식으로 변환
 */
function convertUserRecipeToChallengeRecipe(
    recipe: UserRecipe
): ChallengeRecipe {
  return {
    recipeId: recipe.recipeId,
    recipeTitle: recipe.title,
    videoThumbnailUrl: recipe.videoInfo.thumbnailUrl,
    videoId: recipe.videoInfo.id,
    videoSeconds: recipe.videoInfo.seconds,
    servings: recipe.recipeDetailMeta?.servings,
    cookingTime: recipe.recipeDetailMeta?.cookingTime,
    tags: recipe.tags,
  };
}
