/** 레시피 카드가 노출되는 위치 */
export type SurfaceType =
  // 홈 화면 섹션
  | 'HOME_MY_RECIPES'
  | 'HOME_POPULAR_RECIPES'
  | 'HOME_POPULAR_SHORTS'
  // 전체 페이지
  | 'USER_RECIPES'
  | 'POPULAR_RECIPES'
  | 'SEARCH_TRENDING'
  | 'SEARCH_RESULTS'
  | 'CATEGORY_RESULTS';

/** Impression 배치 전송 페이로드 */
export interface ImpressionPayload {
  requestId: string;
  surfaceType: SurfaceType;
  impressions: ImpressionItem[];
}

export interface ImpressionItem {
  recipeId: string;
  position: number; // 0-based index
  timestamp: number;
}

/** Click 단건 전송 페이로드 */
export interface ClickPayload {
  requestId: string;
  surfaceType: SurfaceType;
  recipeId: string;
  position: number; // 0-based index
  timestamp: number;
}

/** useRecipeTracking 반환 타입 */
export interface RecipeTrackingReturn {
  requestId: string;
  observeRef: (node: HTMLElement | null, recipeId: string, position: number) => void;
  trackClick: (recipeId: string, position: number) => void;
}

/** useRecipeTracking 옵션 */
export interface RecipeTrackingOptions {
  resetKey?: string | number; // 변경 시 requestId 갱신 (카테고리 전환, 검색어 변경 등)
  debounceMs?: number;        // 기본값 1000
  threshold?: number;         // 기본값 0.5
}
