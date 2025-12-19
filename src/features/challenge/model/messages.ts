// 진행 상황별 메시지
export const PROGRESS_MESSAGES: Record<number, string> = {
  0: "첫 요리를 시작해보세요!",
  1: "좋아요! 두 번만 더 하면 성공!",
  2: "거의 다 왔어요! 한 번만 더!",
  3: "축하합니다! 챌린지 완료!",
};

// 완료 시 추가 메시지
export const COMPLETION_SUB_MESSAGE = "수고하셨어요! 🎉";

// 배너 메시지
export const BANNER_MESSAGES = {
  inProgress: (count: number, total: number) => `${count}/${total} 완료`,
  completed: "축하합니다! 챌린지 완료!",
};
