import {
  useSearchHistories,
  useDeleteSearchHistory,
  useDeleteAllSearchHistories,
} from "../entities/search-history/model/model";

export const RecentSearchSection = ({
  onSearchSelect,
}: {
  onSearchSelect?: (keyword: string) => void;
}) => {
  const { searchHistories } = useSearchHistories();
  const deleteSearchHistoryMutation = useDeleteSearchHistory();
  const deleteAllSearchHistoriesMutation = useDeleteAllSearchHistories();

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">최근 검색어</h2>
        {searchHistories.histories.length > 0 && (
          <button
            className="text-xs font-medium text-gray-500"
            onClick={() => deleteAllSearchHistoriesMutation.mutate()}
            disabled={deleteAllSearchHistoriesMutation.isPending}
          >
            {deleteAllSearchHistoriesMutation.isPending ? "삭제 중..." : "전체 삭제"}
          </button>
        )}
      </div>

      {searchHistories.histories.length > 0 ? (
        <div className="-mx-4 min-h-[52px]">
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
                onClick={() => onSearchSelect?.(search)}
              >
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  {search.length > 10 ? `${search.slice(0, 10)}...` : search}
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
        <div className="min-h-[52px] flex items-center justify-center">
          <p className="text-sm text-gray-500 text-center">
            최근 검색어가 없습니다
          </p>
        </div>
      )}
    </section>
  );
};

