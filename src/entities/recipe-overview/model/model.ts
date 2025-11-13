import { fetchRecipeOverview } from "@/src/entities/recipe-overview/api/api";
import { useSuspenseQuery } from "@tanstack/react-query";

const RECIPE_OVERVIEW_KEY = "RECIPE_OVERVIEW_KEY";

export const useFetchRecipeOverview = (id: string) => {
  const { data } = useSuspenseQuery({
    queryKey: [RECIPE_OVERVIEW_KEY, id],
    queryFn: () => fetchRecipeOverview(id),
  });
  return { data };
};
