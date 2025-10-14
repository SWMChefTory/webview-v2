import { ALL_RECIPES } from "@/src/entities/user_recipe/model/useUserRecipe";
import { useFetchUserRecipes } from "@/src/entities/user_recipe/model/useUserRecipe";
import {
  RecipeDetailsCardReady,
  RecipeDetailsCardSkeleton,
} from "./recipeCard";
import { useFetchCategories } from "@/src/entities/category/model/useCategory";

export const RecipeListSectionReady = ({
  selectedCategoryId,
}: {
  selectedCategoryId: string | typeof ALL_RECIPES;
}) => {
  const { data: categories } = useFetchCategories();
  const { recipes } = useFetchUserRecipes({
    categoryId: selectedCategoryId,
    categoryName: categories?.find(
      (category) => category.id === selectedCategoryId
    )?.name,
  });

  return (
    <div className="flex-1 flex flex-col w-full rounded-t-[20] bg-white border-t border-t-stone-600 overflow-y-scroll">
      <div className="flex flex-col w-full bg-white pt-6 rounded-t-[20] gap-4 ">
        {recipes.map((recipe) => (
          <RecipeDetailsCardReady key={recipe.recipeId} userRecipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export const RecipeListSectionSkeleton = () => {
  return (
    <div className="flex-1 flex flex-col w-full rounded-t-[20] bg-white border-t border-t-stone-600 overflow-y-scroll">
      <div className="flex flex-col w-full bg-white pt-6 rounded-t-[20] gap-4 ">
        {Array.from({ length: 3 }).map((_, i) => (
          <RecipeDetailsCardSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    </div>
  );
};
