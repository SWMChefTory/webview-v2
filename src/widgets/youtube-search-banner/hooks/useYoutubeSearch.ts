import { isNativeApp } from "@/src/shared/lib/platform";
import { MODE, request } from "@/src/shared/client/native/client";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";

/**
 * 유튜브 검색 연결 훅
 * - 네이티브 앱: 브릿지를 통해 외부 브라우저에서 유튜브 열기
 * - 웹 브라우저: 새 탭에서 유튜브 열기
 */
export function useYoutubeSearch(keyword: string, source: string) {
  const openYoutubeSearch = () => {
    if (!keyword.trim()) return;

    const encodedKeyword = encodeURIComponent(keyword.trim());
    const youtubeAppUrl = `youtube://results?search_query=${encodedKeyword}`;
    const youtubeWebUrl = `https://www.youtube.com/results?search_query=${encodedKeyword}`;

    track(AMPLITUDE_EVENT.YOUTUBE_SEARCH_CLICK, { keyword, source });

    if (isNativeApp()) {
      request(MODE.UNBLOCKING, "OPEN_EXTERNAL_URL", {
        url: youtubeAppUrl,
        fallbackUrl: youtubeWebUrl,
      });
    } else {
      window.open(youtubeWebUrl, "_blank");
    }
  };

  return {
    openYoutubeSearch,
  };
}
