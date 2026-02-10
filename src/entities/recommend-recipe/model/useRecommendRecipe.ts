import { fetchRecommendRecipes } from "@/src/entities/recommend-recipe/model/api/api";
import { RecommendType, VideoTypeQuery } from "@/src/entities/recommend-recipe/model/api/schema/enum";
import { useCursorPaginationQuery } from "@/src/shared/hooks/usePaginationQuery";

export const RECOMMEND_RECIPE_QUERY_KEY = "recommendRecipeQueryKey";

export const useFetchRecommendRecipes = ({
  videoType = VideoTypeQuery.ALL,
  recommendType,
}: {
  videoType?: VideoTypeQuery;
  recommendType: RecommendType;
}) => {
  const data = useCursorPaginationQuery({
    queryKey: [RECOMMEND_RECIPE_QUERY_KEY, recommendType, videoType],
    queryFn: ({ pageParam }: { pageParam?: string | null | undefined }) =>
      fetchRecommendRecipes({ cursor: pageParam, videoType, recommendType }),
  });

  return data;
};
