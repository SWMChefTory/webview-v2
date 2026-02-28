/**
 * 유튜브 검색 연결 훅
 * - 유튜브 앱 딥링크 시도
 * - 실패 시 웹 URL 폴백
 */
export function useYoutubeSearch(keyword: string) {
  const openYoutubeSearch = () => {
    if (!keyword.trim()) return;

    const encodedKeyword = encodeURIComponent(keyword.trim());

    // 유튜브 앱 딥링크 (모바일)
    const youtubeAppUrl = `vnd.youtube://search?query=${encodedKeyword}`;

    // 유튜브 웹 URL (폴백)
    const youtubeWebUrl = `https://www.youtube.com/results?search_query=${encodedKeyword}`;

    // 딥링크 시도
    window.location.href = youtubeAppUrl;

    // 500ms 후 웹으로 폴백 (앱이 없으면 딥링크 실패)
    setTimeout(() => {
      window.open(youtubeWebUrl, '_blank');
    }, 500);
  };

  return {
    openYoutubeSearch,
  };
}
