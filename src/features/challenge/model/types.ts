// 챌린지 타입 (단일 소스)
export const CHALLENGE_TYPES = ["SINGLE", "HOUSEWIFE"] as const;
export type ChallengeType = (typeof CHALLENGE_TYPES)[number];

// 챌린지 타입 라벨
export const CHALLENGE_TYPE_LABELS: Record<ChallengeType, string> = {
  SINGLE: "자취생",
  HOUSEWIFE: "주부",
};

// 구글폼 URL (TODO: 실제 URL로 교체)
export const CHALLENGE_SIGNUP_FORM_URL = "https://forms.gle/xxx";
