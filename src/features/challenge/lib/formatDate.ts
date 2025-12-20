// ============================================
// 챌린지 상태 타입
// ============================================

export type ChallengeStatus = "BEFORE" | "ONGOING" | "ENDED";

// ============================================
// 날짜 포맷 함수
// ============================================

/**
 * ISO 날짜 문자열을 한국어 형식으로 변환
 * @param dateString - "2024-12-16" 형식
 * @returns "12월 16일" 형식
 */
export function formatChallengeDate(dateString: string): string {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}월 ${day}일`;
}

/**
 * 챌린지 기간 문자열 생성
 * @returns "12월 16일 ~ 12월 22일" 형식
 */
export function formatChallengePeriod(
  startDate: string,
  endDate: string
): string {
  return `${formatChallengeDate(startDate)} ~ ${formatChallengeDate(endDate)}`;
}

// ============================================
// 챌린지 상태 판단 함수
// ============================================

/**
 * 현재 날짜 기준 챌린지 상태 반환
 */
export function getChallengeStatus(
  startDate: string,
  endDate: string
): ChallengeStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);

  if (today < start) return "BEFORE";
  if (today > end) return "ENDED";
  return "ONGOING";
}

// ============================================
// D-day / 일차 계산 함수
// ============================================

/**
 * 시작일까지 남은 일수 (시작 전 상태용)
 * @returns "D-3", "D-2", "D-1", "D-Day"
 */
export function calculateDaysUntilStart(startDate: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const diffTime = start.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "D-Day";
  return `D-${diffDays}`;
}

/**
 * 현재 진행 일차 계산 (진행 중 상태용)
 * @returns "1일차", "2일차", ...
 */
export function calculateCurrentDay(startDate: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

  return `${diffDays}일차`;
}

/**
 * 상태에 따른 뱃지 텍스트 반환
 * - BEFORE: "D-3" (시작까지)
 * - ONGOING: "3일차" (진행 중)
 * - ENDED: "종료"
 */
export function getStatusBadgeText(
  startDate: string,
  endDate: string
): string {
  const status = getChallengeStatus(startDate, endDate);

  switch (status) {
    case "BEFORE":
      return calculateDaysUntilStart(startDate);
    case "ONGOING":
      return calculateCurrentDay(startDate);
    case "ENDED":
      return "종료";
  }
}

/**
 * 남은 일수 계산 (D-day) - 종료일 기준
 * @deprecated getStatusBadgeText 사용 권장
 * @param endDate - 종료일 "2024-12-22" 형식
 * @returns D-day 문자열 ("D-3", "D-Day", "종료")
 */
export function calculateDday(endDate: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);

  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "종료";
  if (diffDays === 0) return "D-Day";
  return `D-${diffDays}`;
}
