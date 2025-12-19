import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { fetchChallengeRecipes } from "../api/challengeApi";

const CHALLENGE_RECIPES_QUERY_KEY = "challengeRecipes";

export function useChallengeRecipes() {
  const {
    data: queryData,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery({
    queryKey: [CHALLENGE_RECIPES_QUERY_KEY],
    queryFn: ({ pageParam = 0 }: { pageParam: number }) => {
      return fetchChallengeRecipes({ page: pageParam });
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasNext ? lastPage.currentPage + 1 : undefined;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000, // 5분
  });

  const data = queryData.pages.flatMap((page) => page.data);
  const totalElements = queryData.pages[0]?.totalElements ?? 0;

  return {
    data,
    totalElements,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  };
}
