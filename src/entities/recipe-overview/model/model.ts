import { fetchRecipeOverview } from "./api/api";
import { useSuspenseQuery } from "@tanstack/react-query";

export const RECIPE_OVERVIEW_QUERY_KEY = "RECIPE_OVERVIEW_KEY";

export const useFetchRecipeOverview = (id: string) => {
  const { data } = useSuspenseQuery({
    queryKey: [RECIPE_OVERVIEW_QUERY_KEY, id],
    queryFn: () => fetchRecipeOverview(id),
    staleTime: Infinity,
  });
  return { data };
};
