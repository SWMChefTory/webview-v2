import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { fetchTrendingRecipes } from "../api/api";
import { ThemeRecipe } from "@/src/views/home/entities/theme-recipe/type";

const TRENDING_RECIPE_QUERY_KEY = "TrendingRecipeQueryKey";

export function useFetchTrendingRecipes() {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: [TRENDING_RECIPE_QUERY_KEY],
      queryFn: ({ pageParam = 0 }: { pageParam: number }) => {
        return fetchTrendingRecipes({ page: pageParam });
      },
      getNextPageParam: (lastPage) => {
        return lastPage.hasNext ? lastPage.currentPage + 1 : undefined;
      },
      select: (data) => data.pages.flatMap((page) => page.data as ThemeRecipe[]),
      initialPageParam: 0,
      staleTime: 5 * 60 * 1000,
    });

  return { data, hasNextPage, fetchNextPage, isFetchingNextPage };
}

