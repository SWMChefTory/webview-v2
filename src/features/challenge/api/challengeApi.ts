import client from "@/src/shared/client/main/client";
import { parseWithErrLog } from "@/src/shared/schema/zodErrorLogger";
import {
  ChallengeData,
  ChallengeDataSchema,
  ChallengeRecipe,
  PaginatedChallengeRecipes,
  PaginatedChallengeRecipesSchema,
} from "../model/schema";
import { MOCK_PARTICIPANT } from "../model/mockData";
import {
  fetchAllRecipesSummary,
  type PaginatedRecipes,
} from "@/src/entities/user-recipe/model/api";
import type { UserRecipe } from "@/src/entities/user-recipe/model/schema";

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

  // TODO: 실제 API 엔드포인트 확정 후 수정
  const response = await client.get("/challenges/my");
  return parseWithErrLog(ChallengeDataSchema, response.data);
}

// ============================================
// 챌린지 레시피 목록 조회
// ============================================

export async function fetchChallengeRecipes({
  page,
}: {
  page: number;
}): Promise<PaginatedChallengeRecipes> {
  if (USE_MOCK) {
    // Mock 모드: 나의 레시피 API를 호출하여 테스트 데이터로 활용
    const myRecipes = await fetchAllRecipesSummary({ page });
    return convertToChallengeRecipes(myRecipes);
  }

  // TODO: 실제 API 엔드포인트 확정 후 수정
  const response = await client.get(`/challenges/recipes?page=${page}`);
  return parseWithErrLog(PaginatedChallengeRecipesSchema, response.data);
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

/**
 * PaginatedRecipes → PaginatedChallengeRecipes 변환
 */
function convertToChallengeRecipes(
  paginatedRecipes: PaginatedRecipes
): PaginatedChallengeRecipes {
  return {
    currentPage: paginatedRecipes.currentPage,
    hasNext: paginatedRecipes.hasNext,
    totalElements: paginatedRecipes.totalElements,
    totalPages: paginatedRecipes.totalPages,
    data: paginatedRecipes.data.map(convertUserRecipeToChallengeRecipe),
  };
}
