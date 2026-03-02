import { useEffect, useCallback } from "react";
import { useCategoryResultsController } from "./CategoryResults.controller";
import { EmptyState } from "./CategoryResults.common";
import { ShortsRecipeListMobile, NormalRecipeListMobile, ShortsHorizontalListSkeleton, NormalVerticalListSkeleton } from "@/src/widgets/recipe-cards-section";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import type { RecipeCardsSectionRecipe } from "@/src/widgets/recipe-cards-section/RecipeCardsSection.mobile";

export function CategoryResultsSkeletonMobile() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="px-2 pb-6 pt-4">
        <ShortsHorizontalListSkeleton />
        <NormalVerticalListSkeleton />
      </div>
    </div>
  );
}

export function CategoryResultsContentMobile({
  categoryType,
  videoType,
}: {
  categoryType: string;
  videoType?: string;
}) {
  const {
    recipes,
    categoryName,
    isFetchingNextPage,
    isRecommendType,
    loadMoreRef,
    t,
  } = useCategoryResultsController(categoryType, "mobile", videoType);

  useEffect(() => {
    track(AMPLITUDE_EVENT.CATEGORY_VIEW, {
      category_type: categoryType,
      category_name: categoryName,
      recipe_count: recipes.length,
    });
  }, [categoryType]);

  const onRecipeClick = useCallback(
    (recipe: RecipeCardsSectionRecipe) => {
      track(AMPLITUDE_EVENT.CATEGORY_RECIPE_CLICK, {
        recipe_id: recipe.recipeId,
        recipe_title: recipe.recipeTitle,
        category_type: isRecommendType ? "category_recommend" : "category_cuisine",
      });
    },
    [isRecommendType]
  );

  if (recipes.length === 0) {
    return <EmptyState t={t} />;
  }

  const shortsRecipes = recipes.filter(
    (r) => r.videoInfo.videoType === "SHORTS"
  );
  const normalRecipes = recipes.filter(
    (r) => r.videoInfo.videoType === "NORMAL"
  );

  const cardServing = (count: number) => t("card.serving", { count });
  const cardMinute = (count: number) => t("card.minute", { count });

  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-b from-white to-gray-50/20">
      <div className="px-2 pb-28 pt-4">
        <ShortsRecipeListMobile
          recipes={shortsRecipes}
          onRecipeClick={onRecipeClick}
          cardServing={cardServing}
          cardMinute={cardMinute}
        />
        <NormalRecipeListMobile
          recipes={normalRecipes}
          loadMoreRef={loadMoreRef}
          isFetchingNextPage={isFetchingNextPage}
          onRecipeClick={onRecipeClick}
          cardBadge={t("card.badge")}
          cardServing={cardServing}
          cardMinute={cardMinute}
        />
      </div>
    </div>
  );
}
