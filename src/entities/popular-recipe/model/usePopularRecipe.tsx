import {
  fetchPopularSummary,
  PopularSummaryRecipe,
  PopularSummaryRecipePagenatedResponse,
} from "@/src/entities/popular-recipe/api/api";
import { QueryClient, useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { VideoType } from "../type/videoType";
import type { InfiniteData } from '@tanstack/react-query';

export class PopularRecipe {
  recipeId!: string;
  recipeTitle!: string;
  videoThumbnailUrl!: string;
  videoId!: string;
  videoUrl!: string;
  count!: number;
  isViewed!: boolean;
  videoType!: VideoType;

  constructor(data: unknown) {
    Object.assign(this, data);
    Object.freeze(this);
  }

  static fromApiResponse(data: PopularSummaryRecipe): PopularRecipe {
    return new PopularRecipe(data);
  }
}

const POPULAR_RECIPE_QUERY_KEY = "popularRecipe";

export function sortByViewed(recipes: PopularRecipe[]) {
  return [...recipes].sort((a, b) => {
    if (a.isViewed && !b.isViewed) return 1;
    if (!a.isViewed && b.isViewed) return -1;
    return 0;
  });
}

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
        page.data.map((recipe) => PopularRecipe.fromApiResponse(recipe))
      ),
  });
}

function convert(
  prev: InfiniteData<PopularSummaryRecipePagenatedResponse> | undefined,
  recipeId: string
): InfiniteData<PopularSummaryRecipePagenatedResponse> | undefined {
  if (!prev) return undefined;
  return {
    pages: [
      ...prev.pages.map((page) => ({
        ...page,
        data: page.data.map((r) => r.recipeId === recipeId ? { ...r, isViewed: true } : r),
      })),
    ],
    pageParams: prev.pageParams,
  };
}

export async function patchIsViewedOptimistically(
  qc: QueryClient,
  recipeId: string,
  isViewed: boolean,
  videoType: VideoType
) {
  await qc.cancelQueries({ queryKey: [POPULAR_RECIPE_QUERY_KEY] });
  // 목록 스냅샷들 (모든 "recipes" 쿼리)
  const prev = qc.getQueryData<InfiniteData<PopularSummaryRecipePagenatedResponse>>([
    POPULAR_RECIPE_QUERY_KEY,
    videoType,
  ]);

  // 목록들 전부 패치
  qc.setQueryData<InfiniteData<PopularSummaryRecipePagenatedResponse>>(
    [POPULAR_RECIPE_QUERY_KEY, videoType],
    (prev) => convert(prev, recipeId)
  );

  // 롤백용 컨텍스트 반환
  return { prevList: prev };
}

export function rollbackIsViewed(
  qc: QueryClient,
  ctx: { prevList: InfiniteData<PopularSummaryRecipePagenatedResponse> | undefined },
  videoType: VideoType
) {
  qc.setQueryData<InfiniteData<PopularSummaryRecipePagenatedResponse>>(
    [POPULAR_RECIPE_QUERY_KEY, videoType],
    ctx.prevList ?? {
      pages: [],
      pageParams: [],
    }
  );
}
