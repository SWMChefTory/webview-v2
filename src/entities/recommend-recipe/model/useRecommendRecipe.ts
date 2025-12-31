import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { fetchRecommendRecipes } from "@/src/entities/recommend-recipe/api/api";
import { RecommendType } from "@/src/entities/category/type/cuisineType";
export type { RecommendRecipe } from "@/src/entities/recommend-recipe/api/api";

export const RECOMMEND_RECIPE_QUERY_KEY = "RecommendRecipeQueryKey";

export function useFetchRecommendRecipes({ recommendType }: { recommendType: RecommendType }) {
  const { data: queryData, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: [RECOMMEND_RECIPE_QUERY_KEY, recommendType],
      queryFn: ({ pageParam = 0 }: { pageParam: number }) => {
        return fetchRecommendRecipes({ recommendType, page: pageParam });
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

