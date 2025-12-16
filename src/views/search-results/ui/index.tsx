import { ThumbnailSkeleton, ThumbnailReady } from "./thumbnail";
import TextSkeleton from "@/src/shared/ui/skeleton/text";
import {
  useFetchRecipesSearched,
  Recipe,
} from "@/src/entities/recipe-searched/useRecipeSearched";
import { useCreateRecipe } from "@/src/entities/user-recipe/model/useUserRecipe";
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
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { VideoType } from "@/src/entities/popular-recipe/type/videoType";
import { useLangcode, Lang } from "@/src/shared/translation/useLangCode";

// 다국어 메시지 포매터
const formatSearchResultMessages = (lang: Lang) => {
  switch (lang) {
    case "en":
      return {
        empty: {
          title: "No recipes found for your search",
          subtitle: "Try a different keyword",
        },
        header: {
          suffix: "Search Results",
          totalCount: (count: number) => `Total ${count} recipes`,
        },
        card: {
          badge: "Already Registered",
          serving: (count: number) => `${count} serving${count !== 1 ? 's' : ''}`,
          minute: (count: number) => `${count} min`,
        },
        dialog: {
          title: "Create Recipe",
          description: (name: string) => (
            <>
              Do you want to create a recipe for <span className="text-black font-bold">{name}</span>?
            </>
          ),
          cancel: "Cancel",
          confirm: "Create",
        }
      };
    default:
      return {
        empty: {
          title: "검색어에 해당하는 레시피가 없어요",
          subtitle: "다른 검색어로 시도해보세요",
        },
        header: {
          suffix: "에 대한 검색결과",
          totalCount: (count: number) => `총 ${count}개의 레시피`,
        },
        card: {
          badge: "이미 등록했어요",
          serving: (count: number) => `${count}인분`,
          minute: (count: number) => `${count}분`,
        },
        dialog: {
          title: "레시피 생성",
          description: (name: string) => (
            <>
              <span className="text-black font-bold">{name}</span> 레시피를 생성하시겠어요?
            </>
          ),
          cancel: "취소",
          confirm: "생성",
        }
      };
  }
};

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
  
  // 1. 언어 설정 가져오기
  const lang = useLangcode();
  const messages = formatSearchResultMessages(lang);

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
        <div className="flex flex-col w-full h-full items-center pt-54 px-4">
          <div className="w-44 h-44 mb-8">
            <img
                src={"/empty_state.png"}
                alt="empty inbox"
                className="block w-full h-full object-contain"
            />
          </div>
          <div className="text-center space-y-3">
            <h3 className="font-bold text-xl text-gray-900">{messages.empty.title}</h3>
            <p className="text-s text-gray-600">{messages.empty.subtitle}</p>
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
          <span className="text-lg font-medium text-gray-600 shrink-0">{messages.header.suffix}</span>
        </div>
        <p className="text-sm text-gray-500 mt-2">{messages.header.totalCount(totalElements)}</p>
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
  
  // 언어 설정 가져오기
  const lang = useLangcode();
  const messages = formatSearchResultMessages(lang);

  const handleCardClick = async () => {
    if (!searchResults.isViewed) {
      track(AMPLITUDE_EVENT.RECIPE_CREATE_START_CARD, {
        source: "search_result",
        video_type: searchResults.videoInfo.videoType || "NORMAL",
        recipe_id: searchResults.recipeId,
      });
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
              {messages.card.badge}
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
                  <span className="font-medium">{messages.card.serving(detailMeta.servings)}</span>
                </div>
              )}
              {detailMeta?.cookingTime && (
                <div className="flex items-center gap-1.5">
                  <FaRegClock size={14} className="shrink-0" />
                  <span className="font-medium">{messages.card.minute(detailMeta.cookingTime)}</span>
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
          <DialogTitle className="text-xl font-bold">{messages.dialog.title}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className="text-lg text-gray-400">
            {messages.dialog.description(searchResults.recipeTitle)}
          </div>
        </DialogDescription>
        <DialogFooter className="flex flex-row justify-center gap-2">
          <DialogClose asChild>
            <Button variant="outline" className="flex-1">
              {messages.dialog.cancel}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              onClick={async () => {
                track(AMPLITUDE_EVENT.RECIPE_CREATE_SUBMIT_CARD, {
                  source: "search_result",
                  video_type: searchResults.videoInfo.videoType || "NORMAL",
                });
                await create({
                  youtubeUrl: `https://www.youtube.com/watch?v=${searchResults.videoInfo.videoId}`,
                  recipeId: searchResults.recipeId,
                  videoType: searchResults.videoInfo.videoType as VideoType | undefined,
                  recipeTitle: searchResults.recipeTitle,
                  _source: "search_result",
                  _creationMethod: "card",
                });
                router.replace(`/recipe/${searchResults.recipeId}/detail`);
                setIsOpen(false);
              }}
              className="flex-1"
            >
              {messages.dialog.confirm}
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