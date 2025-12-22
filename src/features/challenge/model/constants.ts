import type { ChallengeType } from "./types";

// ============================================
// 챌린지 하드코딩 상수
// 백엔드에서 제공하지 않는 값들
// ============================================

export const CHALLENGE_CONSTANTS = {
  /** 챌린지 이름 (UI 표시용) */
  name: "집밥 챌린지",

  /** 완료 조건 (3끼 완료 시 챌린지 성공) */
  totalCount: 3,
} as const;

// ============================================
// 타입별 카카오 오픈채팅 URL
// ============================================

export const KAKAO_OPEN_CHAT_URLS: Record<ChallengeType, string> = {
  /** 자취생(1인가구) 챌린지 오픈채팅 */
  SINGLE: "https://open.kakao.com/o/sXzywB7h",
  /** 주부 챌린지 오픈채팅 */
  HOUSEWIFE: "https://open.kakao.com/o/sXzywB7h",
};
