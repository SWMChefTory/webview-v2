/**
 * Amplitude 이벤트 이름 상수
 *
 * 모든 Amplitude 이벤트는 이 enum을 통해 관리됩니다.
 * const enum을 사용하여 컴파일 시 인라인되어 번들 크기에 영향을 주지 않습니다.
 *
 * @see amplitude.ts - track() 함수와 함께 사용
 * @see /frontend/docs/amplitude-tutorial-events-summary.md - 이벤트 정의서
 */
export const enum AMPLITUDE_EVENT {
  // ─────────────────────────────────────────────────────────────
  // 공유 튜토리얼 (Share Tutorial)
  // 레시피 생성 방법을 안내하는 모달
  // ─────────────────────────────────────────────────────────────

  /** 공유 튜토리얼 모달 표시 */
  TUTORIAL_SHARE_VIEW = "tutorial_share_view",

  /** "생성하러 가기" 버튼 클릭 - 유튜브 앱으로 이동 */
  TUTORIAL_SHARE_YOUTUBE_CLICK = "tutorial_share_youtube_click",

  /** "직접 입력하기" 버튼 클릭 - 직접 입력 화면으로 이동 */
  TUTORIAL_SHARE_DIRECT_CLICK = "tutorial_share_direct_click",

  /** "다시 보지 않기" 클릭 - 튜토리얼 비활성화 */
  TUTORIAL_SHARE_DISMISS = "tutorial_share_dismiss",

  // ─────────────────────────────────────────────────────────────
  // 핸즈프리 튜토리얼 (Hands-free Tutorial)
  // 음성 명령으로 요리하는 방법을 안내하는 단계별 튜토리얼
  // ─────────────────────────────────────────────────────────────

  /** 핸즈프리 시작 모달 표시 ("음성으로 요리해볼까요?") */
  TUTORIAL_HANDSFREE_VIEW = "tutorial_handsfree_view",

  /** 핸즈프리 튜토리얼 건너뛰기 ("괜찮아요" 버튼 클릭) */
  TUTORIAL_HANDSFREE_SKIP = "tutorial_handsfree_skip",

  /** 핸즈프리 튜토리얼 시작 ("볼게요" 버튼 클릭) */
  TUTORIAL_HANDSFREE_STEP_START = "tutorial_handsfree_step_start",

  /** 핸즈프리 튜토리얼 종료 (완료 또는 중도 이탈) */
  TUTORIAL_HANDSFREE_STEP_END = "tutorial_handsfree_step_end",
}
