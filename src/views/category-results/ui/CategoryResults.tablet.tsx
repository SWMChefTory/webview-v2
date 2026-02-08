import TextSkeleton from "@/src/shared/ui/skeleton/text";
import { RecipeCardWrapper } from "@/src/widgets/recipe-creating-modal/recipeCardWrapper";
import { useCategoryResultsController } from "./CategoryResults.controller";
import {
  RecipeCardReady,
  RecipeCardSkeleton,
  EmptyState,
} from "./CategoryResults.common";

export function CategoryResultsSkeletonTablet() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-b from-white to-gray-50/20">
      <div className="max-w-[1024px] mx-auto w-full px-6 py-8">
        <TextSkeleton fontSize="text-3xl" />
      </div>
      <div className="max-w-[1024px] mx-auto w-full px-6 pb-8">
        <div className="grid grid-cols-3 gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <RecipeCardSkeleton key={index} isTablet />
          ))}
        </div>
      </div>
    </div>
  );
}

export function CategoryResultsContentTablet({
  categoryType,
  videoType,
}: {
  categoryType: string;
  videoType?: string;
}) {
  const {
    recipes,
    totalElements,
    categoryName,
    isFetchingNextPage,
    loadMoreRef,
    t,
    getVideoType,
    getEntryPoint,
    getVideoUrl,
  } = useCategoryResultsController(categoryType, "tablet", videoType);

  if (recipes.length === 0) {
    return <EmptyState t={t} />;
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-b from-white to-gray-50/20">
      <div className="max-w-[1024px] mx-auto w-full px-8 py-10">
        <div className="flex items-baseline gap-4">
          <h1 className="font-bold text-gray-900 truncate text-4xl tracking-tight">
            {categoryName}
          </h1>
          <span className="font-medium text-gray-500 shrink-0 text-2xl">
            {t("header.suffix")}
          </span>
        </div>
        <p className="text-gray-500 mt-4 text-lg font-medium">
          {t("header.totalCount", { count: totalElements })}
        </p>
      </div>

      <div className="max-w-[1024px] mx-auto w-full px-8 pb-12">
        <div className="grid grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            <RecipeCardWrapper
              key={recipe.recipeId}
              recipeCreditCost={recipe.creditCost}
              recipeId={recipe.recipeId}
              recipeTitle={recipe.recipeTitle}
              recipeIsViewed={recipe.isViewed ?? false}
              recipeVideoType={getVideoType(recipe)}
              entryPoint={getEntryPoint()}
              recipeVideoUrl={getVideoUrl(recipe)}
              videoId={recipe.videoInfo.videoId}
              description={recipe.detailMeta?.description}
              servings={recipe.detailMeta?.servings}
              cookingTime={recipe.detailMeta?.cookingTime}
              trigger={
                <RecipeCardReady
                  recipeTitle={recipe.recipeTitle}
                  videoThumbnailUrl={recipe.videoInfo.videoThumbnailUrl}
                  isViewed={recipe.isViewed ?? false}
                  servings={recipe.detailMeta?.servings ?? 0}
                  cookingTime={recipe.detailMeta?.cookingTime ?? 0}
                  tags={recipe.tags ?? []}
                  description={recipe.detailMeta?.description ?? ""}
                  isTablet
                />
              }
            />
          ))}

          {isFetchingNextPage && (
            <>
              <RecipeCardSkeleton isTablet />
              <RecipeCardSkeleton isTablet />
              <RecipeCardSkeleton isTablet />
            </>
          )}
        </div>
        <div ref={loadMoreRef} className="h-24" />
      </div>
    </div>
  );
}
