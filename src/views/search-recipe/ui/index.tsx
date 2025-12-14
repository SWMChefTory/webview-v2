import { useEffect, useRef, useState } from "react";
import { useInitialAutoCompleteData } from "../entities/auto-complete/model/model";
import { 
  useSearchHistories, 
  useDeleteSearchHistory, 
  useDeleteAllSearchHistories 
} from "../entities/search-history/model/model";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import Trend from "@/src/views/home/ui/assets/trend.png";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeRecipe } from "@/src/views/home/entities/theme-recipe/type";
import { useFetchTrendingRecipes } from "../entities/trend-recipe/model/useTrendRecipe";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateRecipe } from "@/src/entities/user_recipe/model/useUserRecipe";
import { useRouter } from "next/router";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";

export const DefaultContentOverlay = ({ onSearchSelect }: { onSearchSelect?: (keyword: string) => void }) => {
  const { autoCompleteData } = useInitialAutoCompleteData();
  const { searchHistories } = useSearchHistories();
  const deleteSearchHistoryMutation = useDeleteSearchHistory();
  const deleteAllSearchHistoriesMutation = useDeleteAllSearchHistories();
  const [isExpanded, setIsExpanded] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);  
  
  useEffect(() => {
    if (!isExpanded && scrollContainerRef.current && autoCompleteData.autocompletes.length > 0) {
      const container = scrollContainerRef.current;
      const itemHeight = 60;
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
    <div className="flex flex-col w-full h-full overflow-y-scroll">
      {/* 컨테이너 통일: px-4 py-6 */}
      <div className="px-4 py-6 space-y-6">
        
        {/* 최근 검색어 섹션 */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">최근 검색어</h2>
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
            <div className="min-h-[40px] flex items-center justify-center">
              <p className="text-sm text-gray-500 text-center">
                최근 검색어가 없습니다
              </p>
            </div>
          )}
        </section>

        {/* 인기 검색어 섹션 */}
        <section className="space-y-2.5">
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
              <div className="grid grid-cols-2 gap-2.5">
                {autoCompleteData.autocompletes.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-orange-50 hover:border-orange-200 border border-transparent cursor-pointer transition-all duration-200 group"
                    onClick={() => onSearchSelect?.(item.autocomplete)}
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
                style={{ height: '60px' }}
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
                    className="flex items-center gap-2.5 px-3 absolute w-full h-[60px] cursor-pointer hover:bg-orange-50 hover:border-orange-200 border border-transparent transition-all duration-200 group rounded-lg"
                    style={{ top: `${index * 60}px` }}
                    onClick={() => onSearchSelect?.(item.autocomplete)}
                  >
                    <span className="text-base font-bold text-orange-600 shrink-0 w-6 group-hover:text-orange-700 transition-colors">
                      {index + 1}
                    </span>
                    <span className="text-base font-medium flex-1 text-gray-900 group-hover:text-orange-700 transition-colors line-clamp-2 leading-tight">{item.autocomplete}</span>
                  </div>
                ))}
              </div>
            )
          ) : (
            <p className="text-sm text-gray-500 py-6">인기 검색어가 없습니다</p>
          )}
        </section>

        {/* 트렌드 레시피 섹션 */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900">급상승 레시피</h2>
            <img src={Trend.src} className="size-5" alt="trend" />
          </div>
          <p className="text-sm text-gray-500">최근 급상승 레시피를 모아봤어요</p>
          <div className="grid grid-cols-2 gap-4">
            <SSRSuspense fallback={<TrendRecipeGridSkeleton />}>
              <TrendRecipeGrid />
            </SSRSuspense>
          </div>
        </section>
      </div>
    </div>
  );
};

const TrendRecipeGrid = () => {
  const { data: recipes, hasNextPage, fetchNextPage, isFetchingNextPage } = useFetchTrendingRecipes();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '200px'
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  if (recipes.length === 0) {
    return (
      <div className="col-span-2">
        <p className="text-sm text-gray-500 py-6">급상승 레시피가 없습니다</p>
      </div>
    );
  }

  return (
    <>
      {recipes.map((recipe) => (
        <TrendRecipeCardWrapper 
          key={recipe.recipeId}
          recipe={recipe}
        />
      ))}
      {isFetchingNextPage && (
        <>
          <TrendRecipeCardSkeleton />
          <TrendRecipeCardSkeleton />
        </>
      )}
      {hasNextPage && !isFetchingNextPage && (
        <div ref={loadMoreRef} className="col-span-2 h-20" />
      )}
    </>
  );
};

const TrendRecipeCardWrapper = ({ recipe }: { recipe: ThemeRecipe }) => {
  const { create } = useCreateRecipe();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleCardClick = () => {
    if (!recipe.isViewed) {
      track(AMPLITUDE_EVENT.RECIPE_CREATE_START_CARD, {
        source: "search_trend",
        video_type: recipe.videoType,
        recipe_id: recipe.recipeId,
      });
      setIsOpen(true);
    } else {
      router.push(`/recipe/${recipe.recipeId}/detail`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div
        onClick={handleCardClick}
        className="flex flex-col w-full group cursor-pointer"
      >
        <div className="relative overflow-hidden rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-200 h-[160px]">
          <img
            src={recipe.videoThumbnailUrl}
            className="block w-full h-full object-cover"
            alt={recipe.recipeTitle}
          />
          {recipe.isViewed && (
            <div className="absolute top-2 left-2 bg-stone-600/50 px-2 py-1 rounded-full text-xs text-white z-10">
              이미 등록했어요
            </div>
          )}
        </div>
        <h3 className="mt-3 text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors">
          {recipe.recipeTitle}
        </h3>
      </div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">레시피 생성</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className="text-lg text-gray-400">
            <span className="text-black font-bold">{recipe.recipeTitle}</span>{" "}
            레시피를 생성하시겠어요?
          </div>
        </DialogDescription>
        <DialogFooter className="flex flex-row justify-center gap-2">
          <DialogClose asChild>
            <Button variant="outline" className="flex-1">
              취소
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              onClick={async () => {
                track(AMPLITUDE_EVENT.RECIPE_CREATE_SUBMIT_CARD, {
                  source: "search_trend",
                  video_type: recipe.videoType,
                });
                await create({
                  youtubeUrl: recipe.videoUrl,
                  recipeId: recipe.recipeId,
                  videoType: recipe.videoType,
                  recipeTitle: recipe.recipeTitle,
                  _startTime: Date.now(),
                  _source: "search_trend",
                  _creationMethod: "card",
                });
                router.push(`/recipe/${recipe.recipeId}/detail`);
                setIsOpen(false);
              }}
              className="flex-1"
            >
              생성
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const TrendRecipeGridSkeleton = () => {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <TrendRecipeCardSkeleton key={index} />
      ))}
    </>
  );
};

const TrendRecipeCardSkeleton = () => {
  return (
    <div className="flex flex-col w-full">
      <Skeleton className="w-full h-[160px] rounded-xl" />
      <div className="mt-3 space-y-2">
        <Skeleton className="w-full h-4 rounded" />
        <Skeleton className="w-3/4 h-4 rounded" />
      </div>
    </div>
  );
};
