import { ThumbnailSkeleton, ThumbnailReady } from "./thumbnail";
import TextSkeleton from "@/src/shared/ui/skeleton/text";
import {
  useFetchRecipesSearched,
  Recipe,
} from "@/src/entities/recipe-searched/useRecipeSearched";
import { FaRegClock } from "react-icons/fa";
import { BsPeople } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import { useInitialAutoCompleteData } from "../entities/auto-complete/model/model";
import { 
  useSearchHistories, 
  useDeleteSearchHistory, 
  useDeleteAllSearchHistories 
} from "../entities/search-history/model/model";

export const DefaultContentOverlay = ({ onSearchSelect }: { onSearchSelect?: (keyword: string) => void }) => {
  const { autoCompleteData } = useInitialAutoCompleteData();
  const { searchHistories, isLoading: isHistoriesLoading, error } = useSearchHistories();
  const deleteSearchHistoryMutation = useDeleteSearchHistory();
  const deleteAllSearchHistoriesMutation = useDeleteAllSearchHistories();
  const [isExpanded, setIsExpanded] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);  
  
  useEffect(() => {
    if (!isExpanded && scrollContainerRef.current && autoCompleteData.autocompletes.length > 0) {
      const container = scrollContainerRef.current;
      const itemHeight = 80;
      let currentIndex = 0;
      
      const scrollToNext = () => {
        currentIndex = (currentIndex + 1) % autoCompleteData.autocompletes.length;
        container.scrollTo({
          top: currentIndex * itemHeight,
          behavior: 'smooth'
        });
      };
      
      const scrollInterval = setInterval(scrollToNext, 2500);
      
      return () => clearInterval(scrollInterval);
    }
  }, [isExpanded, autoCompleteData.autocompletes.length]);
  
  return (
    <div className="flex flex-col w-full h-full overflow-y-scroll bg-white/50">
      {/* 컨테이너 통일: px-6 py-8 */}
      <div className="px-6 py-8 space-y-8">
        
        {/* 최근 검색어 섹션 */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">최근 검색어</h2>
            {searchHistories.histories.length > 0 && (
              <button 
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => deleteAllSearchHistoriesMutation.mutate()}
                disabled={deleteAllSearchHistoriesMutation.isPending}
              >
                {deleteAllSearchHistoriesMutation.isPending ? "삭제 중..." : "전체 삭제"}
              </button>
            )}
          </div>
          
          {isHistoriesLoading ? (
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="px-4 py-2 rounded-full bg-gray-200 animate-pulse">
                  <div className="w-16 h-4 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          ) : searchHistories.histories.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {searchHistories.histories.map((search, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border border-gray-300 hover:border-orange-400 hover:bg-orange-50 transition-all cursor-pointer group"
                  onClick={() => onSearchSelect?.(search)}
                >
                  <span className="text-sm font-medium group-hover:text-orange-600 transition-colors">
                    {search}
                  </span>
                  <button 
                    className="text-gray-400 text-lg leading-none hover:text-red-500 transition-colors"
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
          ) : (
            <p className="text-sm text-gray-500 py-6">최근 검색어가 없습니다</p>
          )}
        </section>

        {/* 구분선 */}
        <div className="border-t border-gray-200"></div>

        {/* 인기 검색어 섹션 */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">인기 검색어</h2>
              {!isExpanded && autoCompleteData.autocompletes.length > 0 && (
                <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {autoCompleteData.autocompletes.length}개
                </span>
              )}
            </div>
            <button 
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors group"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <span>{isExpanded ? '접기' : '펼쳐서 보기'}</span>
              <div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-500 group-hover:text-gray-700">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>
          </div>
          
          {autoCompleteData.autocompletes.length > 0 ? (
            isExpanded ? (
              <div className="grid grid-cols-2 gap-3">
                {autoCompleteData.autocompletes.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-orange-50 hover:border-orange-200 border border-transparent cursor-pointer transition-all group"
                    onClick={() => onSearchSelect?.(item.autocomplete)}
                  >
                    <span className="text-base font-bold text-orange-600 shrink-0 w-6 group-hover:text-orange-700">
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
                className="relative overflow-hidden bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm"
                style={{ height: '80px' }}
              >
                {/* 상단 그라데이션 오버레이 */}
                <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none"></div>
                
                {/* 하단 그라데이션 오버레이 */}
                <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none"></div>
                
                {/* 스크롤 인디케이터 */}
                {autoCompleteData.autocompletes.length > 1 && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20">
                    <div className="flex flex-col gap-1">
                      {Array.from({ length: Math.min(3, autoCompleteData.autocompletes.length) }).map((_, i) => (
                        <div key={i} className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      ))}
                    </div>
                  </div>
                )}
                
                {autoCompleteData.autocompletes.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-3 px-4 absolute w-full h-20 cursor-pointer hover:bg-white/90 transition-all duration-200 group"
                    style={{ top: `${index * 80}px` }}
                    onClick={() => onSearchSelect?.(item.autocomplete)}
                  >
                    <span className="text-base font-bold text-gray-600 w-6 group-hover:text-orange-600 transition-colors">
                      {index + 1}
                    </span>
                    <span className="text-base font-medium text-gray-900 group-hover:text-orange-700 transition-colors line-clamp-2 leading-tight">{item.autocomplete}</span>
                  </div>
                ))}
              </div>
            )
          ) : (
            <p className="text-sm text-gray-500 py-6">인기 검색어가 없습니다</p>
          )}
        </section>
      </div>
    </div>
  );
};

export function SearchResultsSkelton() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-b from-white to-gray-50/20">
      <div className="px-6 py-8">
        <TextSkeleton fontSize="text-2xl" />
      </div>
      <div className="px-6 pb-8">
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <RecipeSearchedCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SearchResultsReady({ keyword, onSearchSelect }: { keyword: string; onSearchSelect?: (keyword: string) => void }) {
  if (!keyword || keyword.trim() === "") {
    return <DefaultContentOverlay onSearchSelect={onSearchSelect} />;
  }

  const { 
    data: searchResults, 
    hasNextPage, 
    fetchNextPage, 
    isFetchingNextPage 
  } = useFetchRecipesSearched({ query: keyword });
  
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  if (searchResults.length === 0) {
    return (
      <div className="flex flex-col w-full h-full items-center justify-center py-24 px-6">
        <div className="w-32 h-32 mb-8 opacity-60">
          <img src="/empty_state.png" alt="검색 결과 없음" className="w-full h-full object-contain" />
        </div>
        <div className="text-center space-y-3">
          <h3 className="font-bold text-xl text-gray-900">검색어에 해당하는 레시피가 없어요</h3>
          <p className="text-sm text-gray-600">다른 검색어로 시도해보세요</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-b from-white to-gray-50/20">
      {/* 검색 결과 헤더 */}
      <div className="px-6 py-8">
        <div className="flex items-baseline gap-2">
          <h1 className="text-2xl font-bold text-gray-900 truncate">{keyword}</h1>
          <span className="text-lg font-medium text-gray-600 shrink-0">에 대한 검색결과</span>
        </div>
      </div>
      
      {/* 검색 결과 그리드 */}
      <div className="px-6 pb-8">
        <div className="grid grid-cols-2 gap-4">
          {searchResults.map((recipe) => (
            <RecipeSearchedCardReady
              key={recipe.recipeId}
              searchResults={recipe}
            />
          ))}
          {isFetchingNextPage && (
            <>
              <RecipeSearchedCardSkeleton />
              <RecipeSearchedCardSkeleton />
            </>
          )}
        </div>
        <div ref={loadMoreRef} className="h-8" />
      </div>
    </div>
  );
}

const RecipeSearchedCardReady = ({
  searchResults,
}: {
  searchResults: Recipe;
}) => {
  const { detailMeta, tags } = searchResults;
  
  return (
    <article className="w-full group">
      <div className="relative overflow-hidden rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-200">
        <ThumbnailReady imgUrl={searchResults.videoInfo.videoThumbnailUrl} />
      </div>
      
      <div className="mt-3 space-y-2.5">
        <h3 className="text-base font-bold text-gray-900 truncate group-hover:text-orange-600 transition-colors">
          {searchResults.recipeTitle}
        </h3>
        
        {(detailMeta?.servings || detailMeta?.cookingTime) && (
          <div className="flex items-center gap-3 text-sm text-gray-600">
            {detailMeta?.servings && (
              <div className="flex items-center gap-1.5">
                <BsPeople size={14} className="shrink-0" />
                <span className="font-medium">{detailMeta.servings}인분</span>
              </div>
            )}
            {detailMeta?.cookingTime && (
              <div className="flex items-center gap-1.5">
                <FaRegClock size={14} className="shrink-0" />
                <span className="font-medium">{detailMeta.cookingTime}분</span>
              </div>
            )}
          </div>
        )}
        
        {tags && tags.length > 0 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="text-xs font-semibold text-orange-600 whitespace-nowrap">
                #{tag.name}
              </span>
            ))}
          </div>
        )}
        
        {detailMeta?.description && (
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed min-h-[2.75rem]">
            {detailMeta.description}
          </p>
        )}
      </div>
    </article>
  );
};

const RecipeSearchedCardFetchingNextPage = ({
  isFetchingNextPage,
}: {
  isFetchingNextPage: boolean;
}) => {
  return isFetchingNextPage ? (
    <>
      <RecipeSearchedCardSkeleton />
      <RecipeSearchedCardSkeleton />
    </>
  ) : null;
};

const RecipeSearchedCardSkeleton = () => {
  return (
    <div className="w-full">
      <div className="rounded-xl overflow-hidden">
        <ThumbnailSkeleton />
      </div>
      <div className="mt-3 space-y-2.5">
        <TextSkeleton fontSize="text-base" />
        <div className="flex gap-3">
          <TextSkeleton fontSize="text-sm" />
          <TextSkeleton fontSize="text-sm" />
        </div>
        <TextSkeleton fontSize="text-sm" />
        <TextSkeleton fontSize="text-sm" />
      </div>
    </div>
  );
};