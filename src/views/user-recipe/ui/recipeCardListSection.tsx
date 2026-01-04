import { ALL_RECIPES } from "@/src/entities/user-recipe/model/useUserRecipe";
import { useFetchUserRecipes } from "@/src/entities/user-recipe/model/useUserRecipe";
import {
  RecipeDetailsCardReady,
  RecipeDetailsCardSkeleton,
} from "@/src/views/user-recipe/ui/recipeCard";
import { useFetchCategories } from "@/src/entities/category/model/useCategory";
import { useUserRecipeTranslation } from "../hooks/useUserRecipeTranslation";

export const RecipeListSectionReady = ({
  selectedCategoryId,
}: {
  selectedCategoryId: string | typeof ALL_RECIPES;
}) => {
  const { data: categories } = useFetchCategories();
  const selectedCategory =
    selectedCategoryId === ALL_RECIPES
      ? ALL_RECIPES
      : categories.find((category) => category.id === selectedCategoryId);
  const { recipes, fetchNextPage } = useFetchUserRecipes(
    selectedCategory || ALL_RECIPES
  );
  const { t } = useUserRecipeTranslation();

  return (
    <div
      onScroll={(event: any) => {
        if (
          event.target.scrollTop + event.target.clientHeight >=
          event.target.scrollHeight + 10
        ) {
          fetchNextPage();
        }
      }}
      className="flex-1 flex flex-col w-full overflow-y-scroll overflow-x-hidden px-2 md:px-4"
    >
      {recipes.length !== 0 ? (
        <div className="flex flex-col w-full gap-2">
          {recipes.map((recipe) => (
            <RecipeDetailsCardReady
              key={recipe.recipeId}
              userRecipe={recipe}
              selectedCategoryId={selectedCategoryId}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col w-full h-full items-center justify-center px-4">
          <div className="pr-4">
            <div className="w-40 h-40 mb-4">
              <img
                src={"/empty_state.png"}
                alt="empty inbox"
                className="block w-full h-fullobject-contain"
              />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center w-full text-lg text-center">
            <div className="flex items-center justify-center whitespace-nowrap w-[80%]">
              {selectedCategory === ALL_RECIPES ? (
                t("empty.noRecipe")
              ) : (
                <>
                  <span className="shrink-0">
                  {t("empty.noRecipeInCategory", { categoryName: selectedCategory?.name || "" })}
                  </span>
                </>
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

export const RecipeListSectionSkeleton = () => {
  return (
    <div className="flex-1 flex flex-col w-full overflow-y-scroll px-2 md:px-4">
      <div className="flex flex-col w-full gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <RecipeDetailsCardSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    </div>
  );
};
