import client from "@/src/shared/client/main/client";
import { parseWithErrLog } from "@/src/shared/schema/zodErrorLogger";
import {
  ChallengeData,
  ChallengeDataSchema,
  PaginatedChallengeRecipes,
  PaginatedChallengeRecipesSchema,
} from "../model/schema";
import {
  MOCK_PARTICIPANT,
  MOCK_PAGINATED_RECIPES,
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
    await simulateNetworkDelay();
    return MOCK_PAGINATED_RECIPES;
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
