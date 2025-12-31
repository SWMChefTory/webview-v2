import {
  fetchPopularSummary,
  // PopularSummaryRecipe,
  // PopularSummaryRecipePagenatedResponse,
} from "@/src/entities/popular-recipe/api/api";
import { QueryClient, useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { VideoType } from "../type/videoType";
// import type { InfiniteData } from '@tanstack/react-query';

export const POPULAR_RECIPE_QUERY_KEY = "popularRecipe";

export function useFecthPopularRecipe(videoType: VideoType) {
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

//TODO : 레시피 생성시 캐시 전부 stale 처리해서 낙관적 업데이트 필요 없어짐, 그러나 후에 캐시 최적화 예정
// function convert(
//   prev: InfiniteData<PopularSummaryRecipePagenatedResponse> | undefined,
//   recipeId: string
// ): InfiniteData<PopularSummaryRecipePagenatedResponse> | undefined {
//   if (!prev) return undefined;
//   return {
//     pages: [
//       ...prev.pages.map((page) => ({
//         ...page,
//         data: page.data.map((r) => r.recipeId === recipeId ? { ...r, isViewed: true } : r),
//       })),
//     ],
//     pageParams: prev.pageParams,
//   };
// }

// export async function patchIsViewedOptimistically(
//   qc: QueryClient,
//   recipeId: string,
//   isViewed: boolean,
//   videoType: VideoType
// ) {
//   await qc.cancelQueries({ queryKey: [POPULAR_RECIPE_QUERY_KEY] });
//   // 목록 스냅샷들 (모든 "recipes" 쿼리)
//   const prev = qc.getQueryData<InfiniteData<PopularSummaryRecipePagenatedResponse>>([
//     POPULAR_RECIPE_QUERY_KEY,
//     videoType,
//   ]);

//   // 목록들 전부 패치
//   qc.setQueryData<InfiniteData<PopularSummaryRecipePagenatedResponse>>(
//     [POPULAR_RECIPE_QUERY_KEY, videoType],
//     (prev) => convert(prev, recipeId)
//   );

//   // 롤백용 컨텍스트 반환
//   return { prevList: prev };
// }

// export function rollbackIsViewed(
//   qc: QueryClient,
//   ctx: { prevList: InfiniteData<PopularSummaryRecipePagenatedResponse> | undefined },
//   videoType: VideoType
// ) {
//   qc.setQueryData<InfiniteData<PopularSummaryRecipePagenatedResponse>>(
//     [POPULAR_RECIPE_QUERY_KEY, videoType],
//     ctx.prevList ?? {
//       pages: [],
//       pageParams: [],
//     }
//   );
// }
