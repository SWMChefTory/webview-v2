import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { fetchChallengeRecipes } from "../api/challengeApi";

const CHALLENGE_RECIPES_QUERY_KEY = "challengeRecipes";

export function useChallengeRecipes(challengeId: string) {
  const {
    data: queryData,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery({
    queryKey: [CHALLENGE_RECIPES_QUERY_KEY, challengeId],
    queryFn: ({ pageParam = 0 }) => {
      return fetchChallengeRecipes({ challengeId, page: pageParam });
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasNext ? lastPage.currentPage + 1 : undefined;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000, // 5분
  });

  // challengeRecipes 배열 평탄화
  const recipes = queryData.pages.flatMap((page) => page.challengeRecipes);

  // completeRecipes는 첫 페이지에만 있음 (전체 완료 목록)
  const completeRecipes = queryData.pages[0]?.completeRecipes ?? [];

  const totalElements = queryData.pages[0]?.totalElements ?? 0;

  return {
    recipes,
    completeRecipes,
    totalElements,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  };
}
