import TextSkeleton from "@/src/shared/ui/skeleton/text";
import { useSearchResultsController } from "./SearchResults.controller";
import {
  SearchedRecipeCard,
  RecipeCardSkeleton,
  EmptyState,
} from "./SearchResults.common";

export function SearchResultsSkeletonTablet() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-b from-white to-gray-50/20">
      <div className="max-w-[1024px] mx-auto w-full px-6">
        <div className="py-8">
          <TextSkeleton fontSize="text-3xl" />
        </div>
        <div className="pb-8">
          <div className="grid grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, index) => (
              <RecipeCardSkeleton key={index} variant="tablet" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SearchResultsContentTablet({ keyword }: { keyword: string }) {
  const {
    searchResults,
    totalElements,
    loadMoreRef,
    isFetchingNextPage,
    translations,
    onRecipeClick,
  } = useSearchResultsController(keyword);

  if (searchResults.length === 0) {
    return <EmptyState variant="tablet" translations={translations} />;
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-b from-white to-gray-50/20">
      <div className="max-w-[1024px] mx-auto w-full px-8">
        <div className="py-10">
          <div className="flex items-baseline gap-4">
            <h1 className="text-4xl font-bold text-gray-900 truncate tracking-tight">{keyword}</h1>
            <span className="text-2xl font-medium text-gray-500 shrink-0">
              {translations.headerSuffix}
            </span>
          </div>
          <p className="text-lg text-gray-500 mt-4 font-medium">
            {translations.headerTotalCount(totalElements)}
          </p>
        </div>

        <div className="pb-12">
          <div className="grid grid-cols-3 gap-8">
            {searchResults.map((recipe, index) => (
              <SearchedRecipeCard
                key={recipe.recipeId}
                recipe={recipe}
                position={index + 1}
                variant="tablet"
                translations={translations}
                onRecipeClick={onRecipeClick}
              />
            ))}
            {isFetchingNextPage && (
              <>
                <RecipeCardSkeleton variant="tablet" />
                <RecipeCardSkeleton variant="tablet" />
                <RecipeCardSkeleton variant="tablet" />
              </>
            )}
          </div>
          <div ref={loadMoreRef} className="h-24" />
        </div>
      </div>
    </div>
  );
}
