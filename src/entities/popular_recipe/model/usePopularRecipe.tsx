import {
  fetchPopularSummary,
  PopularSummaryRecipe,
  PopularSummaryRecipeResponse,
} from "@/src/entities/popular_recipe/api/api";
import { QueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { VideoType } from "../type/videoType";

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

export function sortByViewed(recipes: PopularRecipe[]){
  return [...recipes].sort((a, b) => {
    if(a.isViewed && !b.isViewed) return 1;
    if(!a.isViewed && b.isViewed) return -1;
    return 0;
  });
}

export function useFecthPopularRecipe() {
  return useSuspenseQuery({
    queryKey: [POPULAR_RECIPE_QUERY_KEY],
    queryFn: fetchPopularSummary,
    select: (data) =>
      data.recommendRecipes.map((recipe) =>
        PopularRecipe.fromApiResponse(recipe)
      ),
  });
}


function convert(prev : PopularSummaryRecipeResponse|undefined, recipeId: string):PopularSummaryRecipeResponse|undefined{
  if(!prev) return undefined;
  return {
    recommendRecipes: [
      ...prev.recommendRecipes.map((r)=>r.recipeId === recipeId ? { ...r, isViewed : true } : r),
    ]
  };
}

export async function patchIsViewedOptimistically(
  qc: QueryClient,
  recipeId: string,
  isViewed: boolean
) {
  await qc.cancelQueries({ queryKey: [POPULAR_RECIPE_QUERY_KEY] });
  // 목록 스냅샷들 (모든 "recipes" 쿼리)
  const prev = qc.getQueryData<PopularSummaryRecipeResponse>([
    POPULAR_RECIPE_QUERY_KEY,
  ]);

  // 목록들 전부 패치
  qc.setQueryData<PopularSummaryRecipeResponse>(
    [POPULAR_RECIPE_QUERY_KEY],
    (prev) => convert(prev, recipeId)
  );

  // 롤백용 컨텍스트 반환
  return { prevList: prev };
}

export function rollbackIsViewed(
  qc: QueryClient,
  ctx: { prevList: PopularSummaryRecipeResponse | undefined }
) {
  qc.setQueryData<PopularSummaryRecipeResponse>(
    [POPULAR_RECIPE_QUERY_KEY],
    ctx.prevList ?? { recommendRecipes: [] }
  );
}
