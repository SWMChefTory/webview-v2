// 애니메이션 관련 상수
export const ANIMATION = {
  DURATION_SEC: 0.2,      // 0.35 → 0.2로 단축 (빠른 전환)
  SLIDE_OFFSET: 30,       // 50 → 30으로 단축 (짧은 이동 거리)
  EASE: [0.25, 0.1, 0.25, 1] as const,
} as const;

// 타이밍 관련 상수
export const TIMING = {
  NEXT_STEP_DELAY_MS: 100,     // 200 → 100으로 단축
  VOICE_SUCCESS_DELAY_MS: 400, // 600 → 400으로 단축
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
