export type { Recipe } from "@/src/entities/recipe-searched/model/api/api";
import { fetchRecipesSearched } from "@/src/entities/recipe-searched/model/api/api";
import { useCursorPaginationQuery } from "@/src/shared/hooks/usePaginationQuery";

export const RECIPE_SEARCH_QUERY_KEY = "RecipeSearchQueryKey";

export const useFetchRecipesSearched = ({
  query,
}: {
  query: string;
}) => {
  const data = useCursorPaginationQuery({
    queryKey: [RECIPE_SEARCH_QUERY_KEY, query],
    queryFn: ({pageParam})=> fetchRecipesSearched({ query, cursor: pageParam })
  });

  return data;
};
