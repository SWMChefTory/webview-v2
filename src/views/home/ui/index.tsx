import { useMediaQuery } from "@/src/shared/hooks/useMediaQuery";
import { MEDIA_QUERIES } from "@/src/shared/constants/breakpoints";
import { HomePageMobile } from "./HomePage.mobile";
import { HomePageTablet } from "./HomePage.tablet";

/**
 * Home 페이지 진입점
 *
 * 디바이스 타입에 따라 최적화된 UI를 렌더링:
 * - Mobile (0 ~ 767px): HomePageMobile
 * - Tablet/Desktop (768px ~): HomePageTablet
 */
function HomePage() {
  const isMobile = useMediaQuery(MEDIA_QUERIES.mobile);

  return isMobile ? <HomePageMobile /> : <HomePageTablet />;
}

export default HomePage;
