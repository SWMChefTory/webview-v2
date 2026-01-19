import { useMediaQuery } from "@/src/shared/hooks/useMediaQuery";
import { MEDIA_QUERIES } from "@/src/shared/constants/breakpoints";
import { PopularRecipesMobile } from "./popularRecipes.mobile";
import { PopularRecipesTablet } from "./popularRecipes.tablet";

/**
 * PopularRecipes 섹션 진입점
 *
 * 디바이스 타입에 따라 최적화된 UI를 렌더링:
 * - Mobile (0 ~ 767px): HorizontalScrollArea (가로 스크롤)
 * - Tablet/Desktop (768px ~): Grid 3열 레이아웃
 */
export function PopularRecipes() {
  const isMobile = useMediaQuery(MEDIA_QUERIES.mobile);

  return isMobile ? <PopularRecipesMobile /> : <PopularRecipesTablet />;
}
