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
import { RecipeCreateDialog } from "@/src/widgets/recipe-search-view";

export function SearchResultsSkeleton() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      <div className="px-4 py-4">
        <TextSkeleton fontSize="text-xl" />
      </div>
      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-3">
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
        <div className="w-24 h-24 mb-6 opacity-60">
          <img src="/empty_state.png" alt="검색 결과 없음" className="w-full h-full object-contain" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="font-bold text-lg text-gray-900">검색 결과가 없어요</h3>
          <p className="text-sm text-gray-600">다른 검색어를 시도해보세요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-baseline gap-2">
          <h1 className="text-xl font-bold text-gray-900 truncate">{keyword}</h1>
          <span className="text-base font-medium text-gray-600 shrink-0">검색결과</span>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
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
        <div ref={loadMoreRef} className="h-10" />
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

  const handleCardClick = () => {
    setIsOpen(true);
  };

  const handleConfirm = async () => {
    await create({ youtubeUrl: `https://www.youtube.com/watch?v=${searchResults.videoInfo.videoId}` });
    router.push(`/recipe/${searchResults.recipeId}/detail`);
    setIsOpen(false);
  };

  return (
    <>
      <article 
        className="w-full cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="relative overflow-hidden rounded-lg">
          <ThumbnailReady imgUrl={searchResults.videoInfo.videoThumbnailUrl} />
        </div>

        <div className="mt-2 space-y-1.5">
          <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight">
            {searchResults.recipeTitle}
          </h3>

          <div className="flex items-center gap-2 text-xs text-gray-600">
            {detailMeta?.servings && (
              <div className="flex items-center gap-1">
                <BsPeople size={12} className="shrink-0" />
                <span>{detailMeta.servings}인분</span>
              </div>
            )}
            {detailMeta?.cookingTime && (
              <div className="flex items-center gap-1">
                <FaRegClock size={12} className="shrink-0" />
                <span>{detailMeta.cookingTime}분</span>
              </div>
            )}
          </div>

          {tags && tags.length > 0 && (
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
              {tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="text-xs font-semibold text-orange-600 whitespace-nowrap">
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          {detailMeta?.description && (
            <p className="text-xs text-gray-600 line-clamp-2 leading-snug">
              {detailMeta.description}
            </p>
          )}
        </div>
      </article>
      <RecipeCreateDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        recipeTitle={searchResults.recipeTitle}
        onConfirm={handleConfirm}
      />
    </>
  );
};

const RecipeSearchedCardSkeleton = () => {
  return (
    <div className="w-full">
      <div className="rounded-lg overflow-hidden">
        <ThumbnailSkeleton />
      </div>
      <div className="mt-2 space-y-1.5">
        <div className="space-y-1">
          <TextSkeleton fontSize="text-sm" />
          <TextSkeleton fontSize="text-sm" />
        </div>
        <TextSkeleton fontSize="text-xs" />
        <TextSkeleton fontSize="text-xs" />
        <div className="space-y-1">
          <TextSkeleton fontSize="text-xs" />
          <TextSkeleton fontSize="text-xs" />
        </div>
      </div>
    </div>
  );
};

