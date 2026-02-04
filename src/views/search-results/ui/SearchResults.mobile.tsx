import TextSkeleton from "@/src/shared/ui/skeleton/text";
import { useSearchResultsController } from "./SearchResults.controller";
import {
  RecipeCardSkeleton,
  EmptyState,
} from "./SearchResults.common";
import { RecipeCardsSectionMobile } from "@/src/widgets/recipe-cards-section";
import { VideoType } from "@/src/entities/recommend-recipe/type/videoType";

export function SearchResultsSkeletonMobile() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-b from-white to-gray-50/20">
      <div className="px-4 py-6">
        <TextSkeleton fontSize="text-2xl" />
      </div>
      <div className="px-4 pb-6">
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <RecipeCardSkeleton key={index} variant="mobile" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SearchResultsContentMobile({ keyword }: { keyword: string }) {
  const {
    searchResults,
    totalElements,
    loadMoreRef,
    isFetchingNextPage,
    translations,
    onRecipeClick,
  } = useSearchResultsController(keyword);

  if (searchResults.length === 0) {
    return <EmptyState variant="mobile" translations={translations} />;
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-b from-white to-gray-50/20">
      <div className="px-4 py-6">
        <div className="flex items-baseline gap-2">
          <h1 className="text-2xl font-bold text-gray-900 truncate">{keyword}</h1>
          <span className="text-lg font-medium text-gray-600 shrink-0">
            {translations.headerSuffix}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {translations.headerTotalCount(totalElements)}
        </p>
      </div>

      <div className="px-4 pb-28">
        <RecipeCardsSectionMobile
          recipes={searchResults}
          loadMoreRef={loadMoreRef}
          isFetchingNextPage={isFetchingNextPage}
          entryPoint="search_result"
          getVideoType={(recipe) =>
            recipe.videoInfo.videoType === "SHORTS" ? VideoType.SHORTS : VideoType.NORMAL
          }
          getVideoUrl={(recipe) => recipe.videoUrl}
          cardBadge={translations.cardBadge}
          cardServing={translations.cardServing}
          cardMinute={translations.cardMinute}
          defaultViewMode="grid"
        />
      </div>
    </div>
  );
}
