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

/**
 * 남은 일수 계산 (D-day)
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
