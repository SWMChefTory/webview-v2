import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { fetchRecipesSearched } from "@/src/entities/recipe-searched/api/api";
export type { Recipe } from "@/src/entities/recipe-searched/api/api";


export const RECIPE_SEARCH_QUERY_KEY = "RecipeSearchQueryKey";

export function useFetchRecipesSearched({ query }: { query: string }) {
  const { data: queryData, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: [RECIPE_SEARCH_QUERY_KEY, query],
      queryFn: ({ pageParam = 0 }: { pageParam: number }) => {
        return fetchRecipesSearched({ query: query, page: pageParam });
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
