import TextSkeleton from "@/src/shared/ui/skeleton/text";
import { useSearchResultsController } from "./SearchResults.controller";
import {
  SearchedRecipeCard,
  RecipeCardSkeleton,
  EmptyState,
} from "./SearchResults.common";

export function SearchResultsSkeletonDesktop() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-b from-white to-gray-50/20">
      <div className="max-w-[1600px] mx-auto w-full px-8">
        <div className="py-10">
          <TextSkeleton fontSize="text-4xl" />
        </div>
        <div className="pb-10">
          <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
            {Array.from({ length: 15 }).map((_, index) => (
              <RecipeCardSkeleton key={index} variant="desktop" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SearchResultsContentDesktop({ keyword }: { keyword: string }) {
  const {
    searchResults,
    loadMoreRef,
    isFetchingNextPage,
    translations,
    onRecipeClick,
  } = useSearchResultsController(keyword);

  if (searchResults.length === 0) {
    return <EmptyState variant="desktop" translations={translations} />;
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-[1600px] mx-auto w-full px-8">
        <div className="py-12 lg:py-16">
          <div className="flex items-baseline gap-4">
            <h1 className="text-5xl font-bold text-gray-900 truncate tracking-tight">{keyword}</h1>
            <span className="text-3xl font-medium text-gray-500 shrink-0">
              {translations.headerSuffix}
            </span>
          </div>
        </div>

        <div className="pb-16">
          <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 lg:gap-8">
            {searchResults.map((recipe, index) => (
              <div key={recipe.recipeId} className="transition-transform duration-300 hover:scale-[1.02] hover:z-10 origin-bottom">
                <SearchedRecipeCard
                  recipe={recipe}
                  position={index + 1}
                  variant="desktop"
                  translations={translations}
                  onRecipeClick={onRecipeClick}
                />
              </div>
            ))}
            {isFetchingNextPage && (
              <>
                <RecipeCardSkeleton variant="desktop" />
                <RecipeCardSkeleton variant="desktop" />
                <RecipeCardSkeleton variant="desktop" />
                <RecipeCardSkeleton variant="desktop" />
                <RecipeCardSkeleton variant="desktop" />
              </>
            )}
          </div>
          <div ref={loadMoreRef} className="h-20" />
        </div>
      </div>
    </div>
  );
}
