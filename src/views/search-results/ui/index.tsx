import { ThumbnailSkeleton, ThumbnailReady } from "./thumbnail";
import TextSkeleton from "@/src/shared/ui/skeleton/text";
import {
  useFetchRecipesSearched,
  Recipe,
} from "@/src/entities/recipe-searched/useRecipeSearched";
import { useCreateRecipe } from "@/src/entities/user-recipe/model/useUserRecipe";
import { FaRegClock } from "react-icons/fa";
import { BsPeople } from "react-icons/bs";
import React, { useEffect, useRef, useState } from "react";
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
import { Trans } from "next-i18next";
import { useSearchResultsTranslation } from "../hooks/useSearchResultsTranslation";

import { RecipeCardWrapper } from "@/src/widgets/recipe-create-dialog/recipeCardWrapper";

export function SearchResultsSkeleton() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-b from-white to-gray-50/20">
      <div className="px-4 md:px-6 py-6">
        <TextSkeleton fontSize="text-2xl" />
      </div>
      <div className="px-4 md:px-6 pb-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5">
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
    isFetchingNextPage,
  } = useFetchRecipesSearched({ query: keyword });

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const hasTrackedView = useRef(false);
  const { t } = useSearchResultsTranslation();

  // 검색 결과 조회 이벤트 (1회만)
  useEffect(() => {
    if (!hasTrackedView.current && searchResults.length > 0) {
      track(AMPLITUDE_EVENT.SEARCH_RESULTS_VIEW, {
        keyword,
        result_count: totalElements,
      });
      hasTrackedView.current = true;
    }
  }, [keyword, searchResults.length, totalElements]);

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
        rootMargin: "50px",
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
          <h3 className="font-bold text-xl text-gray-900">
            {t("empty.title")}
          </h3>
          <p className="text-s text-gray-600">{t("empty.subtitle")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-b from-white to-gray-50/20">
      {/* 검색 결과 헤더 */}
      <div className="px-4 md:px-6 py-6">
        <div className="flex items-baseline gap-2">
          <h1 className="text-2xl font-bold text-gray-900 truncate">
            {keyword}
          </h1>
          <span className="text-lg font-medium text-gray-600 shrink-0">
            {t("header.suffix")}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {t("header.totalCount", { count: totalElements })}
        </p>
      </div>

      {/* 검색 결과 그리드 */}
      <div className="px-4 md:px-6 pb-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5">
          {searchResults.map((recipe, index) => (
            <SearchedRecipeCard
              key={recipe.recipeId}
              recipeTitle={recipe.recipeTitle}
              servings={recipe.detailMeta.servings}
              cookingTime={recipe.detailMeta.cookingTime}
              tags={recipe.tags}
              description={recipe.detailMeta.description}
              thumbnail={
                <RecipeThumbnail
                  recipeId={recipe.recipeId}
                  recipeTitle={recipe.recipeTitle}
                  recipeCreditCost={recipe.creditCost}
                  recipeIsViewed={recipe.isViewed}
                  recipeVideoType={
                    recipe.videoInfo.videoType == "SHORTS"
                      ? VideoType.SHORTS
                      : VideoType.NORMAL
                  }
                  recipeVideoUrl={recipe.videoUrl}
                  keyword={keyword}
                  position={index + 1}
                  recipeVideoThumbnailUrl={recipe.videoInfo.videoThumbnailUrl}
                />
              }
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

const RecipeThumbnail = ({
  recipeId,
  recipeTitle,
  recipeCreditCost,
  recipeIsViewed,
  recipeVideoType,
  recipeVideoUrl,
  recipeVideoThumbnailUrl,
  keyword,
  position,
}: {
  recipeId: string;
  recipeTitle: string;
  recipeCreditCost: number;
  recipeIsViewed: boolean;
  recipeVideoType: VideoType;
  recipeVideoUrl: string;
  recipeVideoThumbnailUrl: string;
  keyword: string;
  position: number;
}) => {
  const { t } = useSearchResultsTranslation();
  return (
    <RecipeCardWrapper
      recipeId={recipeId}
      recipeTitle={recipeTitle}
      recipeCreditCost={recipeCreditCost}
      recipeIsViewed={recipeIsViewed}
      recipeVideoType={recipeVideoType}
      recipeVideoUrl={recipeVideoUrl}
      trigger={
        <div
          onClick={() => {
            track(AMPLITUDE_EVENT.SEARCH_RESULT_CLICK, {
              keyword,
              position,
              recipe_id: recipeId,
              is_registered: recipeIsViewed,
              video_type: recipeVideoType || "NORMAL",
            });
          }}
          className="relative overflow-hidden rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-200"
        >
          <ThumbnailReady imgUrl={recipeVideoThumbnailUrl} />
          {recipeIsViewed && (
            <div className="absolute top-2 left-2 bg-stone-600/50 px-2 py-1 rounded-full text-xs text-white z-10">
              {t("card.badge")}
            </div>
          )}
        </div>
      }
      entryPoint="search_result"
    />
  );
};

const SearchedRecipeCard = ({
  recipeTitle,
  thumbnail,
  servings,
  cookingTime,
  tags,
  description,
}: {
  recipeTitle: string;
  thumbnail: React.ReactNode;
  servings: number;
  cookingTime: number;
  tags: { name: string }[];
  description: string;
}) => {
  const { t } = useSearchResultsTranslation();

  return (
    <article className="w-full group cursor-pointer">
      <div className="mt-3 space-y-2.5">
        <h3 className="text-base font-bold text-gray-900 truncate group-hover:text-orange-600 transition-colors">
          {recipeTitle}
        </h3>
        {thumbnail}
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <BsPeople size={14} className="shrink-0" />
            <span className="font-medium">
              {t("card.serving", { count: servings })}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <FaRegClock size={14} className="shrink-0" />
            <span className="font-medium">
              {t("card.minute", { count: cookingTime })}
            </span>
          </div>
        </div>

        <div className="flex gap-2 overflow-hidden">
          <div className="flex gap-2 line-clamp-1">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs font-semibold text-orange-600 whitespace-nowrap"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed min-h-[2.75rem]">
          {description}
        </p>
      </div>
    </article>
  );
};

const RecipeSearchedCardReady = ({
  searchResults,
  keyword,
  position,
}: {
  searchResults: Recipe;
  keyword: string;
  position: number;
}) => {
  const router = useRouter();
  const { detailMeta, tags } = searchResults;
  const { create } = useCreateRecipe();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useSearchResultsTranslation();

  const handleCardClick = async () => {
    // 검색 결과 클릭 이벤트
    track(AMPLITUDE_EVENT.SEARCH_RESULT_CLICK, {
      keyword,
      position,
      recipe_id: searchResults.recipeId,
      is_registered: searchResults.isViewed,
      video_type: searchResults.videoInfo.videoType || VideoType.NORMAL,
    });

    if (!searchResults.isViewed) {
      track(AMPLITUDE_EVENT.RECIPE_CREATE_START_CARD, {
        entry_point: "search_result",
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
              {t("card.badge")}
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
                  <span className="font-medium">
                    {t("card.serving", { count: detailMeta.servings })}
                  </span>
                </div>
              )}
              {detailMeta?.cookingTime && (
                <div className="flex items-center gap-1.5">
                  <FaRegClock size={14} className="shrink-0" />
                  <span className="font-medium">
                    {t("card.minute", { count: detailMeta.cookingTime })}
                  </span>
                </div>
              )}
            </div>
          )}

          {tags && tags.length > 0 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs font-semibold text-orange-600 whitespace-nowrap"
                >
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
          <DialogTitle className="text-xl font-bold">
            {t("dialog.title")}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className="text-lg text-gray-400">
            <Trans
              i18nKey="search-results:dialog.description"
              values={{ name: searchResults.recipeTitle }}
              components={{ bold: <span className="text-black font-bold" /> }}
            />
          </div>
        </DialogDescription>
        <DialogFooter className="flex flex-row justify-center gap-2">
          <DialogClose asChild>
            <Button variant="outline" className="flex-1">
              {t("dialog.cancel")}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              onClick={async () => {
                track(AMPLITUDE_EVENT.RECIPE_CREATE_SUBMIT_CARD, {
                  entry_point: "search_result",
                  video_type: searchResults.videoInfo.videoType || "NORMAL",
                });
                await create({
                  youtubeUrl: `https://www.youtube.com/watch?v=${searchResults.videoInfo.videoId}`,
                  recipeId: searchResults.recipeId,
                  videoType: searchResults.videoInfo.videoType as
                    | VideoType
                    | undefined,
                  recipeTitle: searchResults.recipeTitle,
                  _source: "search_result",
                  _creationMethod: "card",
                });
                router.replace(`/recipe/${searchResults.recipeId}/detail`);
                setIsOpen(false);
              }}
              className="flex-1"
            >
              {t("dialog.confirm")}
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
