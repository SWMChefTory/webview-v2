import { ThumbnailSkeleton, ThumbnailReady } from "./thumbnail";
import TextSkeleton from "@/src/shared/ui/skeleton/text";
import {
  useFetchRecipesSearched,
  Recipe,
} from "@/src/entities/recipe-searched/useRecipeSearched";
import { FaRegClock } from "react-icons/fa";
import { BsPeople } from "react-icons/bs";
import React, { useEffect, useRef } from "react";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { VideoType } from "@/src/entities/popular-recipe/type/videoType";
import { useSearchResultsTranslation } from "../hooks/useSearchResultsTranslation";
import { RecipeCardWrapper } from "@/src/widgets/recipe-create-dialog/recipeCardWrapper";

export function SearchResultsSkeletonTablet() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-b from-white to-gray-50/20">
      <div className="max-w-[1200px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto w-full px-6">
        <div className="py-8">
          <TextSkeleton fontSize="text-3xl" />
        </div>
        <div className="pb-8">
          <div className="grid grid-cols-3 gap-6 2xl:gap-8 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {Array.from({ length: 15 }).map((_, index) => (
              <RecipeSearchedCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SearchResultsContentTablet({ keyword }: { keyword: string }) {
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
      { threshold: 0.1, rootMargin: "50px" }
    );
    observer.observe(loadMore);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  if (searchResults.length === 0) {
    return (
      <div className="flex flex-col w-full h-full items-center justify-center pt-20 px-6">
        <div className="w-56 h-56 mb-10">
          <img src="/empty_state.png" alt="empty inbox" className="block w-full h-full object-contain" />
        </div>
        <div className="text-center space-y-4">
          <h3 className="font-bold text-2xl text-gray-900">{t("empty.title")}</h3>
          <p className="text-base text-gray-600">{t("empty.subtitle")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-b from-white to-gray-50/20">
      <div className="max-w-[1200px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto w-full px-6">
        <div className="py-8">
          <div className="flex items-baseline gap-3">
            <h1 className="text-3xl font-bold text-gray-900 truncate">{keyword}</h1>
            <span className="text-xl font-medium text-gray-600 shrink-0">{t("header.suffix")}</span>
          </div>
          <p className="text-base text-gray-500 mt-3">{t("header.totalCount", { count: totalElements })}</p>
        </div>

        <div className="pb-8">
          <div className="grid grid-cols-3 gap-6 2xl:gap-8 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {searchResults.map((recipe, index) => (
              <SearchedRecipeCard
                key={recipe.recipeId}
                recipe={recipe}
                keyword={keyword}
                position={index + 1}
              />
            ))}
            {isFetchingNextPage && (
              <>
                <RecipeSearchedCardSkeleton />
                <RecipeSearchedCardSkeleton />
                <RecipeSearchedCardSkeleton />
              </>
            )}
          </div>
          <div ref={loadMoreRef} className="h-20" />
        </div>
      </div>
    </div>
  );
}

function SearchedRecipeCard({
  recipe,
  keyword,
  position,
}: {
  recipe: Recipe;
  keyword: string;
  position: number;
}) {
  const { t } = useSearchResultsTranslation();
  const { detailMeta, tags } = recipe;

  return (
    <article className="w-full group cursor-pointer">
      <div className="mt-4 space-y-3">
        <h3 className="text-base font-bold text-gray-900 truncate group-hover:text-orange-600 transition-colors">
          {recipe.recipeTitle}
        </h3>
        <RecipeCardWrapper
          recipeId={recipe.recipeId}
          recipeTitle={recipe.recipeTitle}
          recipeCreditCost={recipe.creditCost}
          recipeIsViewed={recipe.isViewed}
          recipeVideoType={recipe.videoInfo.videoType === "SHORTS" ? VideoType.SHORTS : VideoType.NORMAL}
          recipeVideoUrl={recipe.videoUrl}
          trigger={
            <div
              onClick={() => {
                track(AMPLITUDE_EVENT.SEARCH_RESULT_CLICK, {
                  keyword,
                  position,
                  recipe_id: recipe.recipeId,
                  is_registered: recipe.isViewed,
                  video_type: recipe.videoInfo.videoType || "NORMAL",
                });
              }}
              className="relative overflow-hidden rounded-xl shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
            >
              <ThumbnailReady imgUrl={recipe.videoInfo.videoThumbnailUrl} />
              {recipe.isViewed && (
                <div className="absolute top-2 left-2 bg-stone-600/50 px-2.5 py-1.5 rounded-full text-xs text-white z-10">
                  {t("card.badge")}
                </div>
              )}
            </div>
          }
          entryPoint="search_result"
        />
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <BsPeople size={14} className="shrink-0" />
            <span className="font-medium">{t("card.serving", { count: detailMeta.servings })}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FaRegClock size={14} className="shrink-0" />
            <span className="font-medium">{t("card.minute", { count: detailMeta.cookingTime })}</span>
          </div>
        </div>
        <div className="flex gap-2 overflow-hidden">
          <div className="flex gap-2 line-clamp-1">
            {tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="text-xs font-semibold text-orange-600 whitespace-nowrap">
                #{tag.name}
              </span>
            ))}
          </div>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed min-h-[2.75rem]">
          {detailMeta.description}
        </p>
      </div>
    </article>
  );
}

function RecipeSearchedCardSkeleton() {
  return (
    <div className="w-full">
      <div className="rounded-xl overflow-hidden">
        <ThumbnailSkeleton />
      </div>
      <div className="mt-4 space-y-3">
        <TextSkeleton fontSize="text-base" />
        <div className="flex gap-4">
          <TextSkeleton fontSize="text-sm" />
          <TextSkeleton fontSize="text-sm" />
        </div>
        <TextSkeleton fontSize="text-sm" />
        <TextSkeleton fontSize="text-sm" />
      </div>
    </div>
  );
}
