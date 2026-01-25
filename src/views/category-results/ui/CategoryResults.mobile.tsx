import TextSkeleton from "@/src/shared/ui/skeleton/text";
import { CategoryType } from "@/src/entities/category/type/cuisineType";
import { RecipeCardWrapper } from "@/src/widgets/recipe-create-dialog/recipeCardWrapper";
import {
  useCategoryResultsController,
} from "./CategoryResults.controller";
import {
  RecipeCardReady,
  RecipeCardSkeleton,
  EmptyState,
} from "./CategoryResults.common";

export function CategoryResultsSkeletonMobile() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-b from-white to-gray-50/20">
      <div className="px-4 py-6">
        <TextSkeleton fontSize="text-2xl" />
      </div>
      <div className="px-4 pb-6">
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <RecipeCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function CategoryResultsContentMobile({
  categoryType,
}: {
  categoryType: CategoryType;
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
  } = useCategoryResultsController(categoryType, "mobile");

  if (recipes.length === 0) {
    return <EmptyState t={t} />;
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-b from-white to-gray-50/20">
      <div className="px-4 py-6">
        <div className="flex items-baseline gap-2">
          <h1 className="font-bold text-gray-900 truncate text-2xl">
            {categoryName}
          </h1>
          <span className="font-medium text-gray-600 shrink-0 text-lg">
            {t("header.suffix")}
          </span>
        </div>
        <p className="text-gray-500 mt-2 text-sm">
          {t("header.totalCount", { count: totalElements })}
        </p>
      </div>

      <div className="px-4 pb-6">
        <div className="grid grid-cols-2 gap-4">
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
              trigger={
                <RecipeCardReady
                  recipeTitle={recipe.recipeTitle}
                  videoThumbnailUrl={recipe.videoInfo.videoThumbnailUrl}
                  isViewed={recipe.isViewed ?? false}
                  servings={recipe.detailMeta?.servings ?? 0}
                  cookingTime={recipe.detailMeta?.cookingTime ?? 0}
                  tags={recipe.tags ?? []}
                  description={recipe.detailMeta?.description ?? ""}
                  isTablet={false}
                />
              }
            />
          ))}

          {isFetchingNextPage && (
            <>
              <RecipeCardSkeleton />
              <RecipeCardSkeleton />
            </>
          )}
        </div>
        <div ref={loadMoreRef} className="h-20" />
      </div>
    </div>
  );
}
