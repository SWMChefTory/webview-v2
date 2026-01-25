import { useMediaQuery } from "@/src/shared/hooks/useMediaQuery";
import { MEDIA_QUERIES } from "@/src/shared/constants/breakpoints";
import { HorizontalScrollAreaDesktop } from "./horizontalScrollArea.desktop";
import { HorizontalScrollAreaTablet } from "./horizontalScrollArea.tablet";

/**
 * Horizontal Scroll Area Router
 * 
 * Routes between:
 * - Desktop: Grid layout
 * - Tablet: Horizontal scroll layout
 * 
 * Note: Mobile uses a different component/pattern usually, or this can be extended for mobile too if needed.
 */
export function HorizontalScrollArea(props: {
  children: React.ReactNode;
  moreLink?: string;
  gap?: string;
}) {
  const isDesktop = useMediaQuery(MEDIA_QUERIES.desktop);
  
  return isDesktop 
    ? <HorizontalScrollAreaDesktop {...props} />
    : <HorizontalScrollAreaTablet {...props} />;
}
