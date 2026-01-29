import {
  useFetchAllRecipes,
  useFetchCategoryRecipes,
} from "@/src/entities/user-recipe/model/useUserRecipe";
// import
import {
  RecipeDetailsCardReady,
  RecipeDetailsCardSkeleton,
} from "@/src/views/user-recipe/ui/recipeCard";
import { useUserRecipeTranslation } from "../hooks/useUserRecipeTranslation";
import { useFetchCategories } from "@/src/entities/category/model/useCategory";

export const RecipeAllListSectionReady = () => {
  const {
    entities: recipes,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useFetchAllRecipes();

  return (
    <div
      onScroll={(event: any) => {
        if (
          event.target.scrollTop + event.target.clientHeight >=
          event.target.scrollHeight + 10
          && !isFetchingNextPage && hasNextPage
        ) {
          fetchNextPage();
        }
      }}
      className="flex-1 flex flex-col w-full overflow-y-scroll overflow-x-hidden px-2 md:px-4"
    >
      {recipes.length !== 0 ? (
        <div className="flex flex-col w-full gap-2">
          {recipes.map((recipe) => (
            <RecipeDetailsCardReady key={recipe.recipeId} userRecipe={recipe} />
          ))}
        </div>
      ) : (
        <RecipeListEmpty isCategory={true} />
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

export const RecipeCategoryListSectionReady = ({categoryId}:{categoryId:string}) => {
  const {data:categories} = useFetchCategories();
  const category = categories.find(
    (category) => category.id === categoryId
  );
  const {
    entities: recipes,
    fetchNextPage,
  } = useFetchCategoryRecipes({id:category?.id || "" ,name:category?.name || ""});

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
            <RecipeDetailsCardReady key={recipe.recipeId} userRecipe={recipe} />
          ))}
        </div>
      ) : (
        <RecipeListEmpty isCategory={true} />
      )}
    </div>
  );
};

const RecipeListEmpty = ({
  isCategory,
  categoryName,
}: {
  isCategory: boolean;
  categoryName?: string;
}) => {
  const { t } = useUserRecipeTranslation();
  return (
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
          {!isCategory ? (
            t("empty.noRecipe")
          ) : (
            <>
              <span className="shrink-0">
                {t("empty.noRecipeInCategory", {
                  categoryName,
                })}
              </span>
            </>
          )}
        </div>
        <div className="h-2" />
        <p className="text-base text-gray-600">{t("empty.suggestion")}</p>
      </div>
      <div className="pb-12" />
    </div>
  );
};
