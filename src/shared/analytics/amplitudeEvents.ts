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

  /** 핸즈프리 튜토리얼 완료 */
  TUTORIAL_HANDSFREE_COMPLETE = "tutorial_handsfree_complete",

  // ─────────────────────────────────────────────────────────────
  // 레시피 생성 - URL 경로 (직접 입력 / 외부 공유)
  // ─────────────────────────────────────────────────────────────

  /** URL 입력 모달 열림 */
  RECIPE_CREATE_START_URL = "recipe_create_start_url",

  /** 모달에서 "완료" 버튼 클릭 */
  RECIPE_CREATE_SUBMIT_URL = "recipe_create_submit_url",

  /** URL 경로 레시피 생성 성공 */
  RECIPE_CREATE_SUCCESS_URL = "recipe_create_success_url",

  /** URL 경로 레시피 생성 실패 */
  RECIPE_CREATE_FAIL_URL = "recipe_create_fail_url",

  // ─────────────────────────────────────────────────────────────
  // 레시피 상세 페이지 (Recipe Detail)
  // 레시피 상세 정보 조회 및 요리 시작까지의 사용자 여정 추적
  // @see /frontend/docs/2.recipe_detail/amplitude-recipe-detail-implementation.md
  // ─────────────────────────────────────────────────────────────

  /** 레시피 상세 페이지 진입 */
  RECIPE_DETAIL_VIEW = "recipe_detail_view",

  /** 레시피 상세 페이지 이탈 */
  RECIPE_DETAIL_EXIT = "recipe_detail_exit",

  /** 탭 클릭 (요약/레시피/재료) */
  RECIPE_DETAIL_TAB_CLICK = "recipe_detail_tab_click",

  /** 스텝 클릭으로 영상 시간 이동 */
  RECIPE_DETAIL_VIDEO_SEEK = "recipe_detail_video_seek",

  /** 부가 기능 클릭 (타이머/계량법) */
  RECIPE_DETAIL_FEATURE_CLICK = "recipe_detail_feature_click",

  /** 요리 시작 버튼 클릭 */
  RECIPE_DETAIL_COOKING_START = "recipe_detail_cooking_start",

  /** 댓글 더보기 클릭 (mobile 전용) */
  RECIPE_DETAIL_COMMENT_DETAIL_CLICK = "recipe_detail_comment_detail_click",

  /** 재료 더보기 클릭 (mobile 전용) */
  RECIPE_DETAIL_INGREDIENT_DETAIL_CLICK = "recipe_detail_ingredient_detail_click",

  // ─────────────────────────────────────────────────────────────
  // 쿠팡 (Coupang)
  // 쿠팡 파트너스 모달에서의 사용자 행동 추적 (매출 직결)
  // @see /frontend/docs/3.coupang/amplitude-coupang-implementation.md
  // ─────────────────────────────────────────────────────────────

  /** 재료 구매 모달 열림 */
  COUPANG_PURCHASE_OPEN = "coupang_purchase_open",

  /** 쿠팡 상품 클릭 (쿠팡앱 이동) */
  COUPANG_ITEM_CLICK = "coupang_item_click",

  /** 재료 구매 모달 닫힘 (집계 이벤트) */
  COUPANG_PURCHASE_CLOSE = "coupang_purchase_close",

  // ─────────────────────────────────────────────────────────────
  // 설정/계정 (Settings/Account)
  // 회원탈퇴 흐름 추적
  // @see /frontend/docs/15.settings/amplitude-settings-implementation.md
  // ─────────────────────────────────────────────────────────────

  /** 회원탈퇴 페이지 진입 */
  WITHDRAWAL_START = "withdrawal_start",

  /** 계정 삭제 완료 */
  ACCOUNT_DELETE = "account_delete",

  // ─────────────────────────────────────────────────────────────
  // 검색 (Search)
  // 검색 기능 사용 흐름 추적
  // @see /frontend/docs/8.search/amplitude-search-implementation.md
  // ─────────────────────────────────────────────────────────────

  /** 검색 실행 (Enter, 자동완성, 최근검색어, 인기검색어 클릭) */
  SEARCH_EXECUTED = "search_executed",

  /** 검색 결과 페이지 조회 */
  SEARCH_RESULTS_VIEW = "search_results_view",

  /** 검색 결과에서 레시피 카드 클릭 */
  SEARCH_RESULT_CLICK = "search_result_click",

  /** 검색창 트렌딩 레시피 카드 클릭 */
  SEARCH_TREND_RECIPE_CLICK = "search_trend_recipe_click",
  /** 유튜브 검색 배너 클릭 */
  YOUTUBE_SEARCH_CLICK = "youtube_search_click",

  // ─────────────────────────────────────────────────────────────
  // 요리 모드 (Cooking Mode / Hands-free Mode)
  // 요리 모드에서의 사용자 행동 추적 (음성/터치 명령, 세션 분석)
  // @see /frontend/docs/4.cooking_mode/amplitude-cooking-mode-events.md
  // ─────────────────────────────────────────────────────────────

  /** 요리 모드 진입 */
  COOKING_MODE_START = "cooking_mode_start",

  /** 요리 모드 명령 실행 (음성/터치) */
  COOKING_MODE_COMMAND = "cooking_mode_command",

  /** 요리 모드 종료 (세션 집계) */
  COOKING_MODE_END = "cooking_mode_end",

  // ─────────────────────────────────────────────────────────────
  // 온보딩 (Onboarding)
  // 앱 설치 후 처음 기능을 안내하는 3단계 튜토리얼
  // ─────────────────────────────────────────────────────────────

  /** 온보딩 시작 */
  ONBOARDING_START = "onboarding_start",

  /** 온보딩 단계 변경 (step_from: 1, step_to: 2) */
  ONBOARDING_STEP_CHANGE = "onboarding_step_change",

  /** 온보딩 단계 완료 (step: 1, step_count: 3) */
  ONBOARDING_STEP_COMPLETE = "onboarding_step_complete",

  /** 온보딩 건너뛰기 ("나중에 다시 보기" 클릭) */
  ONBOARDING_SKIP = "onboarding_skip",

  /** 온보딩 완료 (Step 3 "시작하기" 클릭) */
  ONBOARDING_COMPLETE = "onboarding_complete",

  /** YouTube Step - 화살표 클릭 */
  ONBOARDING_YOUTUBE_CLICK = "onboarding_youtube_click",

  /** Hands-free Step - 마이크 버튼 클릭 */
  ONBOARDING_HANDSFREE_CLICK = "onboarding_handsfree_click",

  // ─────────────────────────────────────────────────────────────
  // 챌린지 (Challenge)
  // 집밥 챌린지 참여 및 인증 흐름 추적
  // ─────────────────────────────────────────────────────────────

  /** 홈 배너 클릭 → 챌린지 페이지 진입 */
  CHALLENGE_BANNER_CLICK = "challenge_banner_click",

  /** 인증하기 버튼 클릭 (카카오 오픈채팅 이동) */
  CHALLENGE_VERIFY_CLICK = "challenge_verify_click",

  /** 챌린지 안내보기 클릭 */
  CHALLENGE_GUIDE_CLICK = "challenge_guide_click",

  /** 챌린지 레시피 카드 클릭 */
  CHALLENGE_RECIPE_CLICK = "challenge_recipe_click",

  // ─────────────────────────────────────────────────────────────
  // 레시피 등록/북마크 (Recipe Enroll)
  // 북마크 행동 추적 — recipe_enroll_success는 북극성 지표
  // ─────────────────────────────────────────────────────────────

  /** 북마크 버튼 클릭 */
  RECIPE_ENROLL_CLICK = "recipe_enroll_click",

  /** 북마크 성공 ⭐ 북극성 지표 */
  RECIPE_ENROLL_SUCCESS = "recipe_enroll_success",

  /** 북마크 실패 */
  RECIPE_ENROLL_FAIL = "recipe_enroll_fail",

  // ─────────────────────────────────────────────────────────────
  // 카테고리 (Category)
  // 카테고리 결과 페이지 추적
  // ─────────────────────────────────────────────────────────────

  /** 카테고리 결과 페이지 진입 */
  CATEGORY_VIEW = "category_view",

  /** 카테고리 결과에서 레시피 카드 클릭 */
  CATEGORY_RECIPE_CLICK = "category_recipe_click",

  // ─────────────────────────────────────────────────────────────
  // 나의 레시피 (User Recipe)
  // 홈 및 나의 레시피 페이지에서의 사용자 행동 추적
  // @see docs/amplitude/details/user-recipe.md
  // ─────────────────────────────────────────────────────────────

  /** 나의 레시피 카테고리 칩 클릭 (홈/나의 레시피 페이지) */
  USER_CATEGORY_SELECT = "user_category_select",

  /** 나의 레시피 카드 클릭 → 상세 페이지 이동 */
  USER_RECIPE_CLICK = "user_recipe_click",

  /** 카테고리 생성 모달 열기 (+ 버튼 클릭) */
  USER_CATEGORY_CREATE_OPEN = "user_category_create_open",

  /** 카테고리 생성 완료 */
  USER_CATEGORY_CREATE_SUCCESS = "user_category_create_success",

  /** 카테고리 삭제 다이얼로그 열기 (길게 누르기) */
  USER_CATEGORY_DELETE_OPEN = "user_category_delete_open",

  /** 카테고리 삭제 완료 */
  USER_CATEGORY_DELETE_SUCCESS = "user_category_delete_success",

  /** 카테고리 이동 다이얼로그 열기 (레시피 길게 누르기) */
  USER_CATEGORY_MOVE_OPEN = "user_category_move_open",

  /** 레시피 카테고리 이동 완료 */
  USER_CATEGORY_MOVE_SUCCESS = "user_category_move_success",

  // ─────────────────────────────────────────────────────────────
  // 결제 (Recharge)
  // 결제 버튼을 누르는지 추적
  // ─────────────────────────────────────────────────────────────

  RECHARGE_CLICK = "recharge_click",

  // ─────────────────────────────────────────────────────────────
  // 크레딧 충전 (Credit Recharge)
  // 친구 초대 크레딧 충전 흐름 추적
  // ─────────────────────────────────────────────────────────────

  /** 카카오톡 공유 버튼 클릭 */
  RECHARGE_KAKAO_CLICK = "recharge_kakao_click",

  /** 충전 완료 (카카오톡 복귀 후) */
  RECHARGE_COMPLETE = "recharge_complete",

  /** 충전 오류 발생 */
  RECHARGE_ERROR = "recharge_error",
}
