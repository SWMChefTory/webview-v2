import { ALL_RECIPES } from "@/src/entities/user_recipe/model/useUserRecipe";
import { useFetchUserRecipes } from "@/src/entities/user_recipe/model/useUserRecipe";
import {
  RecipeDetailsCardReady,
  RecipeDetailsCardSkeleton,
} from "@/src/pages/user-recipe/ui/recipeCard";
import { useFetchCategories } from "@/src/entities/category/model/useCategory";

export const RecipeListSectionReady = ({
  selectedCategoryId,
}: {
  selectedCategoryId: string | typeof ALL_RECIPES;
}) => {
  const { data: categories } = useFetchCategories();
  const { recipes, fetchNextPage } = useFetchUserRecipes(
    categories.find((category) => category.id === selectedCategoryId) ||
      ALL_RECIPES
  );

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
      className="flex-1 flex flex-col w-full rounded-t-[20] bg-white border-t border-t-stone-600 overflow-y-scroll"
    >
      {recipes.length !== 0 ? (
        <div className="flex flex-col w-full pt-6 rounded-t-[20] gap-4 ">
          {recipes.map((recipe) => (
            <RecipeDetailsCardReady key={recipe.recipeId} userRecipe={recipe} selectedCategoryId={selectedCategoryId} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="flex flex-col items-center justify-center w-[100] h-[100]">
            <img
              src={"/empty_state.png"}
              alt="empty inbox"
              className="block w-full h-full object-cover object-center"
            />
          </div>
          <div className="h-[20]"/>
          <div className="font-bold">카테고리에 해당하는 레시피가 없어요</div>
          <div className="h-[200]"/>
        </div>
      )}
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
