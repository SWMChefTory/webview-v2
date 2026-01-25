import { fetchCuisineRecipes } from "@/src/entities/cuisine-recipe/api/api";
import { CuisineType } from "@/src/entities/cuisine-recipe/type/cuisineType";
import { useCursorPaginationQuery } from "@/src/shared/hooks/usePaginationQuery";

export type { CuisineRecipe } from "@/src/entities/cuisine-recipe/api/api";

export const CUISINE_RECIPE_QUERY_KEY = "CuisineRecipeQueryKey";

export const useFetchCuisineRecipes = ({
  cuisineType,
}: {
  cuisineType: CuisineType;
}) => {
  const data = useCursorPaginationQuery({
    queryKey: [CUISINE_RECIPE_QUERY_KEY, cuisineType],
    queryFn: ({pageParam})=> fetchCuisineRecipes({ cuisineType, cursor: pageParam })
  });

  return data;
};

