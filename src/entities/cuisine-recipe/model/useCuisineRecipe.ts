import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { fetchCuisineRecipes } from "@/src/entities/cuisine-recipe/api/api";
import { CuisineType } from "@/src/entities/category/type/cuisineType";
export type { CuisineRecipe } from "@/src/entities/cuisine-recipe/api/api";

export const CUISINE_RECIPE_QUERY_KEY = "CuisineRecipeQueryKey";

export function useFetchCuisineRecipes({ cuisineType }: { cuisineType: CuisineType }) {
  const { data: queryData, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: [CUISINE_RECIPE_QUERY_KEY, cuisineType],
      queryFn: ({ pageParam = 0 }: { pageParam: number }) => {
        return fetchCuisineRecipes({ cuisineType, page: pageParam });
      },
      getNextPageParam: (lastPage) => {
        return lastPage.hasNext ? lastPage.currentPage + 1 : undefined;
      },
      initialPageParam: 0,
      staleTime: 5 * 60 * 1000,
    });
  
  const data = queryData.pages.flatMap((page) => page.data);
  const totalElements = queryData.pages[0]?.totalElements ?? 0;
    
  return { data, totalElements, hasNextPage, fetchNextPage, isFetchingNextPage };
}

