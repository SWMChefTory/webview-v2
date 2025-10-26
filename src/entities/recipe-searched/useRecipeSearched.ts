import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { fetchRecipesSearched } from "@/src/entities/recipe-searched/api/api";
export type { Recipe } from "@/src/entities/recipe-searched/api/api";


const RECIPE_SEARCH_QUERY_KEY = "RecipeSearchQueryKey";

export function useFetchRecipesSearched({ query }: { query: string }) {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: [RECIPE_SEARCH_QUERY_KEY, query],
      queryFn: ({ pageParam = 0 }: { pageParam: number }) => {
        return fetchRecipesSearched({ query: query, page: pageParam });
      },
      getNextPageParam: (lastPage) => {
        return lastPage.hasNext ? lastPage.currentPage + 1 : undefined;
      },
      select: (data) => data.pages.flatMap((page) => page.data),
      initialPageParam: 0,
      staleTime: 5 * 60 * 1000,
    });
    
  return { data, hasNextPage, fetchNextPage, isFetchingNextPage };
}
