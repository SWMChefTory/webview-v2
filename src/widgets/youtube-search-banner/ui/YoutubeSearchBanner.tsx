import { memo } from "react";
import { ChevronRight } from "lucide-react";
import { useYoutubeSearch } from "../hooks/useYoutubeSearch";
import { useYoutubeSearchBannerTranslation } from "../hooks/useYoutubeSearchBannerTranslation";

interface YoutubeSearchBannerProps {
  keyword: string;
  source?: string;
}

export const YoutubeSearchBanner = memo(function YoutubeSearchBanner({
  keyword,
  source = "search_result",
}: YoutubeSearchBannerProps) {
  const { openYoutubeSearch } = useYoutubeSearch(keyword, source);
  const translations = useYoutubeSearchBannerTranslation();

  if (!keyword.trim()) return null;

  return (
    <button
      type="button"
      onClick={openYoutubeSearch}
      className="w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 active:bg-gray-100 border border-gray-200 rounded-xl transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-2 min-w-0">
        {/* 유튜브 아이콘 */}
        <div className="shrink-0 w-5 h-5 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
            <path
              d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"
              fill="#FF0000"
            />
            <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#fff" />
          </svg>
        </div>

        {/* 텍스트 */}
        <span className="text-sm text-gray-600 truncate">
          {translations.title(keyword)}
        </span>
      </div>

      {/* 화살표 아이콘 */}
      <ChevronRight className="shrink-0 w-5 h-5 text-gray-400" />
    </button>
  );
});
