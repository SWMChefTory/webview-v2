import { ThumbnailSkeleton, ThumbnailReady } from "./thumbnail";
import TextSkeleton from "@/src/shared/ui/skeleton/text";
import {
  useFetchRecipesSearched,
  Recipe,
} from "@/src/entities/recipe-searched/useRecipeSearched";
import { useCreateRecipe } from "@/src/entities/user_recipe/model/useUserRecipe";
import { FaRegClock } from "react-icons/fa";
import { BsPeople } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
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

export function SearchResultsSkeleton() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-b from-white to-gray-50/20">
      <div className="px-4 py-6">
        <TextSkeleton fontSize="text-2xl" />
      </div>
      <div className="px-4 pb-6">
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <RecipeSearchedCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SearchResultsContent({ keyword }: { keyword: string }) {
  const {
    data: searchResults,
    totalElements,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useFetchRecipesSearched({ query: keyword });
  
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMore = loadMoreRef.current;
    
    if (!loadMore) return;

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

    observer.observe(loadMore);

    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  if (searchResults.length === 0) {
    return (
      <div className="flex flex-col w-full h-full items-center justify-center py-16 px-4">
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
      <div className="px-4 py-6">
        <div className="flex items-baseline gap-2">
          <h1 className="text-2xl font-bold text-gray-900 truncate">{keyword}</h1>
          <span className="text-lg font-medium text-gray-600 shrink-0">에 대한 검색결과</span>
        </div>
        <p className="text-sm text-gray-500 mt-2">총 {totalElements}개의 레시피</p>
      </div>

      {/* 검색 결과 그리드 */}
      <div className="px-4 pb-6">
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
        <div ref={loadMoreRef} className="h-20" />
      </div>
    </div>
  );
}

const RecipeSearchedCardReady = ({
  searchResults,
}: {
  searchResults: Recipe;
}) => {
  const router = useRouter();
  const { detailMeta, tags } = searchResults;
  const { create } = useCreateRecipe();
  const [isOpen, setIsOpen] = useState(false);

  const handleCardClick = async () => {
    if (!searchResults.isViewed) {
      setIsOpen(true);
    } else {
      router.replace(`/recipe/${searchResults.recipeId}/detail`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <article 
        className="w-full group cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="relative overflow-hidden rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-200">
          <ThumbnailReady imgUrl={searchResults.videoInfo.videoThumbnailUrl} />
          {searchResults.isViewed && (
            <div className="absolute top-2 left-2 bg-stone-600/50 px-2 py-1 rounded-full text-xs text-white z-10">
              이미 등록했어요
            </div>
          )}
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">레시피 생성</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className="text-lg text-gray-400">
            <span className="text-black font-bold">{searchResults.recipeTitle}</span>{" "}
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
                await create({ youtubeUrl: `https://www.youtube.com/watch?v=${searchResults.videoInfo.videoId}` });
                router.replace(`/recipe/${searchResults.recipeId}/detail`);
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
