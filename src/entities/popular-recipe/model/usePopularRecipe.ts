import { fetchPopularSummary } from "@/src/entities/popular-recipe/api/api";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { VideoType } from "../type/videoType";

export const POPULAR_RECIPE_QUERY_KEY = "popularRecipe";

export function useFetchPopularRecipe(videoType: VideoType) {
  return useSuspenseInfiniteQuery({
    queryKey: [POPULAR_RECIPE_QUERY_KEY, videoType],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      fetchPopularSummary({ page: pageParam, videoType }),
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.currentPage + 1 : undefined,
    initialPageParam: 0,
    select: (data) =>
      data.pages.flatMap((page) =>
        page.data.map((recipe) => recipe)
      ),
  });
}
