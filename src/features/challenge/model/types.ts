// 챌린지 타입
export type ChallengeType = "SINGLE" | "HOUSEWIFE";

// 챌린지 타입 라벨
export const CHALLENGE_TYPE_LABELS: Record<ChallengeType, string> = {
  SINGLE: "자취생",
  HOUSEWIFE: "주부",
};

// 구글폼 URL (TODO: 실제 URL로 교체)
export const CHALLENGE_SIGNUP_FORM_URL = "https://forms.gle/xxx";
