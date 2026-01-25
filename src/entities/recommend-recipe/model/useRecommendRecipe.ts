import {
  fetchRecommendRecipes,
} from "@/src/entities/recommend-recipe/api/api";
import { VideoType } from "../../recommend-recipe/type/videoType";
import { RecommendType } from "../../recommend-recipe/type/recommendType";
import { useCursorPaginationQuery } from "@/src/shared/hooks/usePaginationQuery";

export const POPULAR_RECIPE_QUERY_KEY = "popularRecipe";

export const RECOMMEND_RECIPE_QUERY_KEY = "recommendRecipeQueryKey";

export const useFetchRecommendRecipes = ({
  videoType = VideoType.ALL,
  recommendType,
}: {
  videoType?: VideoType;
  recommendType: RecommendType;
}) => {
  const data = useCursorPaginationQuery({
    queryKey: [POPULAR_RECIPE_QUERY_KEY, recommendType, videoType],
    queryFn: ({ pageParam }: { pageParam?: string | null | undefined }) =>
      fetchRecommendRecipes({ cursor: pageParam, videoType, recommendType }),
  });

  return data;
};