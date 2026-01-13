import { useMediaQuery } from "@/src/shared/hooks/useMediaQuery";
import { MEDIA_QUERIES } from "@/src/shared/constants/breakpoints";
import { SettingsPageMobile } from "./SettingsPage.mobile";
import { SettingsPageTablet } from "./SettingsPage.tablet";

/**
 * Settings 페이지 진입점
 *
 * 디바이스 타입에 따라 최적화된 UI를 렌더링:
 * - Mobile (0 ~ 767px): SettingsPageMobile
 * - Tablet/Desktop (768px ~): SettingsPageTablet
 */
function SettingsPage() {
  const isMobile = useMediaQuery(MEDIA_QUERIES.mobile);

  return isMobile ? <SettingsPageMobile /> : <SettingsPageTablet />;
}

export default SettingsPage;
