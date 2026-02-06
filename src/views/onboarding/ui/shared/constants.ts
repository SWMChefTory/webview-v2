// 애니메이션 관련 상수
export const ANIMATION = {
  DURATION_SEC: 0.35,
  SLIDE_OFFSET: 50,
  EASE: [0.25, 0.1, 0.25, 1] as const,
} as const;

// 타이밍 관련 상수
export const TIMING = {
  NEXT_STEP_DELAY_MS: 200,
  VOICE_SUCCESS_DELAY_MS: 600,
  HAPTIC_DURATION_MS: 10,
} as const;

// 미리보기 버튼 크기
export const PREVIEW_BUTTON = {
  WIDTH: 280,
  HEIGHT_NORMAL: 580,
  HEIGHT_COOKING: 520,
} as const;

// Tory 캐릭터 이미지 크기
export const TORY_IMAGE = {
  WIDTH: 180,
  HEIGHT: 180,
} as const;
