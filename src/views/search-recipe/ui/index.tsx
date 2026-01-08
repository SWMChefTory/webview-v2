import { useEffect, useRef, useState } from "react";
import { useInitialAutoCompleteData } from "../entities/auto-complete/model/model";
import {
  useSearchHistories,
  useDeleteSearchHistory,
  useDeleteAllSearchHistories,
} from "../entities/search-history/model/model";
import { useSearchOverlayTranslation } from "../hooks/useSearchOverlayTranslation";

import { TrendingRecipeSection } from "./trendingRecipeSection";

import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";

export const DefaultContentOverlay = ({
  onSearchSelect,
}: {
  onSearchSelect?: (keyword: string) => void;
}) => {
  const { autoCompleteData } = useInitialAutoCompleteData();
  const { searchHistories } = useSearchHistories();
  const deleteSearchHistoryMutation = useDeleteSearchHistory();
  const deleteAllSearchHistoriesMutation = useDeleteAllSearchHistories();
  const [isExpanded, setIsExpanded] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { t } = useSearchOverlayTranslation();

  useEffect(() => {
    if (
      !isExpanded &&
      scrollContainerRef.current &&
      autoCompleteData.autocompletes.length > 0
    ) {
      const container = scrollContainerRef.current;
      const itemHeight = 60;
      let currentIndex = 0;

      const scrollToNext = () => {
        currentIndex =
          (currentIndex + 1) % autoCompleteData.autocompletes.length;
        container.scrollTo({
          top: currentIndex * itemHeight,
          behavior: "smooth",
        });
      };

      const scrollInterval = setInterval(scrollToNext, 2500);

      return () => clearInterval(scrollInterval);
    }
  }, [isExpanded, autoCompleteData.autocompletes.length]);

  return (
    <div className="flex flex-col w-full h-full overflow-y-scroll">
      {/* 컨테이너 통일: px-4 py-6 */}
      <div className="px-4 md:px-6 py-6 space-y-6">
        {/* 최근 검색어 섹션 */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              {t("recent.title")}
            </h2>
            {searchHistories.histories.length > 0 && (
              <button
                className="text-xs font-medium text-gray-500"
                onClick={() => deleteAllSearchHistoriesMutation.mutate()}
                disabled={deleteAllSearchHistoriesMutation.isPending}
              >
                {deleteAllSearchHistoriesMutation.isPending
                  ? t("recent.deleting")
                  : t("recent.deleteAll")}
              </button>
            )}
          </div>

          {searchHistories.histories.length > 0 ? (
            <div className="-mx-4 min-h-[40px]">
              <div
                className="px-4 py-1 flex gap-2 overflow-x-auto no-scrollbar snap-x snap-mandatory overscroll-x-contain scroll-px-4"
                style={{
                  WebkitOverflowScrolling: "touch",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {searchHistories.histories.map((search, index) => (
                  <div
                    key={index}
                    className="shrink-0 snap-start flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 cursor-pointer"
                    onClick={() => {
                      track(AMPLITUDE_EVENT.SEARCH_EXECUTED, {
                        keyword: search,
                        search_method: "recent",
                      });
                      onSearchSelect?.(search);
                    }}
                  >
                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                      {search.length > 10
                        ? `${search.slice(0, 10)}...`
                        : search}
                    </span>
                    <button
                      className="text-gray-400 text-base leading-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSearchHistoryMutation.mutate(search);
                      }}
                      disabled={deleteSearchHistoryMutation.isPending}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="min-h-[40px] flex items-center justify-center">
              <p className="text-sm text-gray-500 text-center">
                {t("recent.empty")}
              </p>
            </div>
          )}
        </section>

        {/* 인기 검색어 섹션 */}
        <section className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                {t("trendingSearch.title")}
              </h2>
              {!isExpanded && autoCompleteData.autocompletes.length > 0 && (
                <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {t("trendingSearch.count", {
                    num: autoCompleteData.autocompletes.length,
                  })}
                </span>
              )}
            </div>
            <button
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors group"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <span>
                {isExpanded
                  ? t("trendingSearch.collapse")
                  : t("trendingSearch.expand")}
              </span>
              <div
                className={`transform transition-transform duration-200 ${
                  isExpanded ? "rotate-180" : "rotate-0"
                }`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-gray-500 group-hover:text-gray-700"
                >
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </button>
          </div>

          {autoCompleteData.autocompletes.length > 0 ? (
            isExpanded ? (
              <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
                {autoCompleteData.autocompletes.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-orange-50 hover:border-orange-200 border border-transparent cursor-pointer transition-all duration-200 group"
                    onClick={() => {
                      track(AMPLITUDE_EVENT.SEARCH_EXECUTED, {
                        keyword: item.autocomplete,
                        search_method: "popular",
                      });
                      onSearchSelect?.(item.autocomplete);
                    }}
                  >
                    <span className="text-base font-bold text-orange-600 shrink-0 w-6 group-hover:text-orange-700 transition-colors">
                      {index + 1}
                    </span>
                    <span className="text-base font-medium flex-1 text-gray-900 group-hover:text-orange-700 transition-colors line-clamp-2 leading-tight">
                      {item.autocomplete}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div
                ref={scrollContainerRef}
                className="relative overflow-hidden rounded-xl border border-gray-200 bg-white"
                style={{ height: "60px" }}
              >
                {/* 상단 그라데이션 오버레이 */}
                <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none"></div>

                {/* 하단 그라데이션 오버레이 */}
                <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none"></div>

                {/* 스크롤 인디케이터 */}
                {autoCompleteData.autocompletes.length > 1 && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20">
                    <div className="flex flex-col gap-1">
                      {Array.from({
                        length: Math.min(
                          3,
                          autoCompleteData.autocompletes.length
                        ),
                      }).map((_, i) => (
                        <div
                          key={i}
                          className="w-1 h-1 bg-gray-400 rounded-full"
                        ></div>
                      ))}
                    </div>
                  </div>
                )}

                {autoCompleteData.autocompletes.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2.5 px-3 absolute w-full h-[60px] cursor-pointer hover:bg-orange-50 hover:border-orange-200 border border-transparent transition-all duration-200 group rounded-lg"
                    style={{ top: `${index * 60}px` }}
                    onClick={() => {
                      track(AMPLITUDE_EVENT.SEARCH_EXECUTED, {
                        keyword: item.autocomplete,
                        search_method: "popular",
                      });
                      onSearchSelect?.(item.autocomplete);
                    }}
                  >
                    <span className="text-base font-bold text-orange-600 shrink-0 w-6 group-hover:text-orange-700 transition-colors">
                      {index + 1}
                    </span>
                    <span className="text-base font-medium flex-1 text-gray-900 group-hover:text-orange-700 transition-colors line-clamp-2 leading-tight">
                      {item.autocomplete}
                    </span>
                  </div>
                ))}
              </div>
            )
          ) : (
            <p className="text-sm text-gray-500 py-6">
              {t("trendingSearch.empty")}
            </p>
          )}
        </section>
        {/* 트렌드 레시피 섹션 */}
        <TrendingRecipeSection/>
      </div>
    </div>
  );
};

