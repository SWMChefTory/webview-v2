import { useEffect, useState } from "react";

/**
 * 미디어 쿼리를 감지하는 React Hook
 *
 * @param query - 미디어 쿼리 문자열 (예: "(max-width: 767px)")
 * @returns 미디어 쿼리 매칭 여부 (true/false)
 *
 * @example
 * const isMobile = useMediaQuery("(max-width: 767px)");
 * const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
 */
export function useMediaQuery(query: string): boolean {
  // SSR 환경에서는 항상 false 반환
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // SSR 환경 체크
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(query);

    // 초기 상태 설정
    setMatches(mediaQuery.matches);

    // 미디어 쿼리 변경 감지 핸들러
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // 이벤트 리스너 등록 (Safari 구버전 호환)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler);
    } else {
      // @ts-ignore - deprecated but needed for Safari < 14
      mediaQuery.addListener(handler);
    }

    // 클린업
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handler);
      } else {
        // @ts-ignore - deprecated but needed for Safari < 14
        mediaQuery.removeListener(handler);
      }
    };
  }, [query]);

  return matches;
}
