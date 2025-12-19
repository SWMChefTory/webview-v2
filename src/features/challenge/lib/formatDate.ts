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
