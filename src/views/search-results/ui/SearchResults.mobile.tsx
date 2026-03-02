import TextSkeleton from "@/src/shared/ui/skeleton/text";
import { useSearchResultsController } from "./SearchResults.controller";
import { EmptyState } from "./SearchResults.common";
import {
  ShortsRecipeListMobile,
  NormalRecipeListMobile,
  ShortsHorizontalListSkeleton,
  NormalVerticalListSkeleton,
} from "@/src/widgets/recipe-cards-section";
import { YoutubeSearchBanner } from "@/src/widgets/youtube-search-banner";

export function SearchResultsSkeletonMobile() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-b from-white to-gray-50/20">
      <div className="px-4 py-6">
        <TextSkeleton fontSize="text-2xl" />
      </div>
      <div className="px-4 pb-28">
        <ShortsHorizontalListSkeleton />
        <NormalVerticalListSkeleton />
      </div>
    </div>
  );
}

export function SearchResultsContentMobile({ keyword }: { keyword: string }) {
  const {
    searchResults,
    loadMoreRef,
    isFetchingNextPage,
    translations,
    onRecipeClick,
  } = useSearchResultsController(keyword);

  if (searchResults.length === 0) {
    return (
      <EmptyState
        variant="mobile"
        translations={translations}
        keyword={keyword}
      />
    );
  }

  const shortsRecipes = searchResults.filter(
    (r) => r.videoInfo.videoType === "SHORTS",
  );
  const normalRecipes = searchResults.filter(
    (r) => r.videoInfo.videoType === "NORMAL",
  );

  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-b from-white to-gray-50/20">
      <div className="px-4 pt-6 pb-3">
        <div className="flex items-baseline gap-2">
          <h1 className="text-2xl font-bold text-gray-900 truncate">
            {keyword}
          </h1>
          <span className="text-lg font-medium text-gray-600 shrink-0">
            {translations.headerSuffix}
          </span>
        </div>
      </div>

      <div className="px-4 mb-4">
        <YoutubeSearchBanner keyword={keyword} source="search_result" />
      </div>

      <div className="px-4 pb-28">
        <ShortsRecipeListMobile
          recipes={shortsRecipes}
          onRecipeClick={(recipe) => {
            const index = searchResults.findIndex(
              (r) => r.recipeId === recipe.recipeId,
            );
            onRecipeClick(recipe, index);
          }}
          cardServing={translations.cardServing}
          cardMinute={translations.cardMinute}
        />
        <NormalRecipeListMobile
          recipes={normalRecipes}
          loadMoreRef={loadMoreRef}
          isFetchingNextPage={isFetchingNextPage}
          onRecipeClick={(recipe) => {
            const index = searchResults.findIndex(
              (r) => r.recipeId === recipe.recipeId,
            );
            onRecipeClick(recipe, index);
          }}
          cardBadge={translations.cardBadge}
          cardServing={translations.cardServing}
          cardMinute={translations.cardMinute}
        />
      </div>
    </div>
  );
}
