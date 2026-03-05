import { useEffect } from "react";
import TextSkeleton from "@/src/shared/ui/skeleton/text";
import { useRouter } from "next/router";
import { navigateToRecipeDetail } from "@/src/shared/navigation/navigateToRecipeDetail";
import { useCategoryResultsController } from "./CategoryResults.controller";
import {
  RecipeCardReady,
  RecipeCardSkeleton,
  EmptyState,
} from "./CategoryResults.common";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { useRecipeTracking } from "@/src/shared/tracking";

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
  const router = useRouter();
  const {
    recipes,
    totalElements,
    categoryName,
    isFetchingNextPage,
    isRecommendType,
    loadMoreRef,
    t,
  } = useCategoryResultsController(categoryType, "tablet", videoType);
  const { observeRef, trackClick } = useRecipeTracking('CATEGORY_RESULTS', {
    resetKey: categoryType,
  });

  useEffect(() => {
    track(AMPLITUDE_EVENT.CATEGORY_VIEW, {
      category_type: categoryType,
      category_name: categoryName,
      recipe_count: recipes.length,
    });
  }, [categoryType]);

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
          {recipes.map((recipe, index) => (
            <div
              key={recipe.recipeId}
              className="cursor-pointer"
              ref={(el) => observeRef(el, recipe.recipeId, index)}
              onClick={() => {
                trackClick(recipe.recipeId, index);
                track(AMPLITUDE_EVENT.CATEGORY_RECIPE_CLICK, {
                  recipe_id: recipe.recipeId,
                  recipe_title: recipe.recipeTitle,
                  category_type: isRecommendType ? "category_recommend" : "category_cuisine",
                });
                navigateToRecipeDetail(router, {
                  recipeId: recipe.recipeId,
                  recipeTitle: recipe.recipeTitle,
                  videoId: recipe.videoInfo.videoId,
                  description: recipe.detailMeta?.description,
                  servings: recipe.detailMeta?.servings,
                  cookingTime: recipe.detailMeta?.cookingTime,
                });
              }}
            >
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
            </div>
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
