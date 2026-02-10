export type { CuisineRecipe } from "./api/api";
import { fetchCuisineRecipes } from "./api/api";
import { CuisineType } from "./api/schema/enum";
import { useCursorPaginationQuery } from "@/src/shared/hooks/usePaginationQuery";

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
