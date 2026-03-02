import { useSuspenseQuery } from "@tanstack/react-query";
import {
  fetchRecipe,
} from "./api/api";

export const RECIPE_QUERY_KEY = "recipes";

//조회를 수행하는 레시피 호출
export const useFetchRecipe = (id: string) => {
  const { data } = useSuspenseQuery({
    queryKey: [RECIPE_QUERY_KEY, id],
    queryFn: () => fetchRecipe(id),
  });
  return { data };
};

export type { ViewStatus } from "./api/api";
