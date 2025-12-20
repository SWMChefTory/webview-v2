// ============================================
// 진행 상황별 메시지 (진행 중)
// ============================================

export const PROGRESS_MESSAGES: Record<number, string> = {
  0: "첫 요리를 시작해보세요!",
  1: "좋아요! 두 번만 더 하면 성공!",
  2: "거의 다 왔어요! 한 번만 더!",
  3: "축하합니다! 챌린지 완료!",
};

// 완료 시 추가 메시지
export const COMPLETION_SUB_MESSAGE = "수고하셨어요! 🎉";

// ============================================
// 시작 전 메시지
// ============================================

export const BEFORE_START_MESSAGES = {
  /** 진행 섹션 메시지 */
  progress: "챌린지 시작 후 요리를 인증할 수 있어요",
  /** 배너 서브 메시지 */
  bannerSub: "곧 시작해요!",
  /** 하단 버튼 대체 텍스트 */
  button: (startDate: string) => {
    const date = new Date(startDate);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}월 ${day}일 시작 예정`;
  },
};

// ============================================
// 배너 메시지
// ============================================

export const BANNER_MESSAGES = {
  /** 진행 중: "1/3 완료" */
  inProgress: (count: number, total: number) => `${count}/${total} 완료`,
  /** 완료 */
  completed: "챌린지 완료! 🎉",
  /** 시작 전: "D-3 곧 시작!" */
  beforeStart: (dday: string) => `${dday} 곧 시작!`,
};
