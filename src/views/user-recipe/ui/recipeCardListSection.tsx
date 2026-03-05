import {
  ALL_RECIPES,
  useFetchAllRecipes,
  useFetchCategoryRecipes,
} from "@/src/entities/user-recipe/model/useUserRecipe";
import { useFetchCategories } from "@/src/entities/category/model/useCategory";

import {
  RecipeDetailsCardReady,
  RecipeDetailsCardSkeleton,
} from "@/src/views/user-recipe/ui/recipeCard";
import { useUserRecipeTranslation } from "../hooks/useUserRecipeTranslation";
import { type UserRecipe } from "@/src/entities/user-recipe/model/api/schema";
import type { RecipeTrackingReturn } from "@/src/shared/tracking";

type TrackingProps = {
  observeRef: RecipeTrackingReturn['observeRef'];
  trackClick: RecipeTrackingReturn['trackClick'];
};

export const RecipeListSectionReady = ({
  selectedCategoryId,
  isTablet = false,
  isDesktop = false,
  observeRef,
  trackClick,
}: {
  selectedCategoryId: string | typeof ALL_RECIPES;
  isTablet?: boolean;
  isDesktop?: boolean;
} & TrackingProps) => {
  const { data: categories } = useFetchCategories();

  if (selectedCategoryId === ALL_RECIPES) {
    return (
      <RecipeAllListSectionReady isTablet={isTablet} isDesktop={isDesktop} observeRef={observeRef} trackClick={trackClick} />
    );
  }

  const selectedCategory = categories.find(
    (category) => category.id === selectedCategoryId,
  );

  if (!selectedCategory) {
    throw new Error("Selected category not found");
  }

  return (
    <RecipeCategoryListSectionReady
      categoryId={selectedCategory.id}
      categoryName={selectedCategory.name}
      isTablet={isTablet}
      isDesktop={isDesktop}
      observeRef={observeRef}
      trackClick={trackClick}
    />
  );
};

const RecipeAllListSectionReady = ({
  isTablet,
  isDesktop,
  observeRef,
  trackClick,
}: {
  isTablet: boolean;
  isDesktop: boolean;
} & TrackingProps) => {
  const {
    entities: recipes,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useFetchAllRecipes();

  return (
    <RecipeListSectionTemplate
      recipes={recipes}
      isCategory={false}
      isTablet={isTablet}
      isDesktop={isDesktop}
      onScrollEnd={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      isFetchingNextPage={isFetchingNextPage}
      selectedCategoryId={ALL_RECIPES}
      observeRef={observeRef}
      trackClick={trackClick}
    />
  );
};

const RecipeCategoryListSectionReady = ({
  categoryId,
  categoryName,
  isTablet,
  isDesktop,
  observeRef,
  trackClick,
}: {
  categoryId: string;
  categoryName: string;
  isTablet: boolean;
  isDesktop: boolean;
} & TrackingProps) => {
  const {
    entities: recipes,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useFetchCategoryRecipes({ id: categoryId, name: categoryName });

  return (
    <RecipeListSectionTemplate
      recipes={recipes}
      isCategory={true}
      categoryName={categoryName}
      isTablet={isTablet}
      isDesktop={isDesktop}
      onScrollEnd={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      isFetchingNextPage={isFetchingNextPage}
      selectedCategoryId={categoryId}
      observeRef={observeRef}
      trackClick={trackClick}
    />
  );
};

const RecipeListSectionTemplate = ({
  recipes,
  isCategory,
  categoryName,
  isTablet,
  isDesktop,
  onScrollEnd,
  isFetchingNextPage,
  selectedCategoryId,
  observeRef,
  trackClick,
}: {
  recipes: UserRecipe[];
  isCategory: boolean;
  categoryName?: string;
  isTablet: boolean;
  isDesktop: boolean;
  onScrollEnd: () => void;
  isFetchingNextPage: boolean;
  selectedCategoryId: string | typeof ALL_RECIPES;
} & TrackingProps) => {
  const { t } = useUserRecipeTranslation();

  return (
    <div
      onScroll={(event: React.UIEvent<HTMLDivElement>) => {
        const target = event.currentTarget;
        if (
          target.scrollTop + target.clientHeight >=
          target.scrollHeight - 10
        ) {
          onScrollEnd();
        }
      }}
      className={`flex-1 flex flex-col w-full overflow-y-scroll overflow-x-hidden ${
        isDesktop ? "px-1 py-4" : isTablet ? "px-6" : "px-2"
      }`}
    >
      {recipes.length !== 0 ? (
        <div
          className={
            isDesktop
              ? "grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
              : "flex flex-col w-full gap-2 lg:gap-4 xl:gap-6"
          }
        >
          {recipes.map((recipe, index) => (
            <div key={recipe.recipeId} ref={(el) => observeRef(el, recipe.recipeId, index)}>
              <RecipeDetailsCardReady
                userRecipe={recipe}
                selectedCategoryId={
                  selectedCategoryId === ALL_RECIPES
                    ? undefined
                    : selectedCategoryId
                }
                isDesktop={isDesktop}
                onTrackClick={() => trackClick(recipe.recipeId, index)}
              />
            </div>
          ))}
          {isFetchingNextPage && (
            <RecipeDetailsCardSkeleton isDesktop={isDesktop} />
          )}
        </div>
      ) : (
        <div className="flex flex-col w-full h-full items-center justify-center px-4">
          <div className="pr-4">
            <div className="w-40 h-40 mb-4">
              <img
                src="/empty_state.png"
                alt="empty inbox"
                className="block w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center w-full text-lg text-center">
            <div className="flex items-center justify-center whitespace-nowrap w-[80%]">
              {!isCategory ? (
                t("empty.noRecipe")
              ) : (
                <span className="shrink-0">
                  {t("empty.noRecipeInCategory", {
                    categoryName: categoryName ?? "",
                  })}
                </span>
              )}
            </div>
            <div className="h-2" />
            <p className="text-base text-gray-600">{t("empty.suggestion")}</p>
          </div>
          <div className="pb-12" />
        </div>
      )}
    </div>
  );
};

export const RecipeListSectionSkeleton = ({
  isTablet = false,
  isDesktop = false,
}: {
  isTablet?: boolean;
  isDesktop?: boolean;
}) => {
  return (
    <div
      className={`flex-1 flex flex-col w-full overflow-y-scroll ${
        isDesktop ? "px-1 py-4" : isTablet ? "px-6" : "px-2"
      }`}
    >
      <div
        className={
          isDesktop
            ? "grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            : "flex flex-col w-full gap-2 lg:gap-4 xl:gap-6"
        }
      >
        {Array.from({ length: isDesktop ? 8 : 3 }).map((_, i) => (
          <RecipeDetailsCardSkeleton
            key={`skeleton-${i}`}
            isDesktop={isDesktop}
          />
        ))}
      </div>
    </div>
  );
};
