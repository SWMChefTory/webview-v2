import { useMediaQuery } from "@/src/shared/hooks/useMediaQuery";
import { MEDIA_QUERIES } from "@/src/shared/constants/breakpoints";
import { PopularShortsRecipesMobile } from "./popularShortsRecipes.mobile";
import { PopularShortsRecipesTablet } from "./popularShortsRecipes.tablet";

/**
 * PopularShortsRecipes 섹션 진입점
 *
 * 디바이스 타입에 따라 최적화된 UI를 렌더링:
 * - Mobile (0 ~ 767px): HorizontalScrollArea (가로 스크롤)
 * - Tablet/Desktop (768px ~): Grid 5열 레이아웃
 */
export function PopularShortsRecipes() {
  const isMobile = useMediaQuery(MEDIA_QUERIES.mobile);

  return isMobile ? (
    <PopularShortsRecipesMobile />
  ) : (
    <PopularShortsRecipesTablet />
  );
}
