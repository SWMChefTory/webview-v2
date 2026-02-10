import { useSuspenseQuery } from "@tanstack/react-query";
import {
  fetchRecipe,
} from "./api/api";

export const RECIPE_QUERY_KEY = "recipes";

//유저가 소유한 레시피 정보 조회
export const useFetchRecipe = (id: string) => {
  const { data } = useSuspenseQuery({
    queryKey: [RECIPE_QUERY_KEY, id],
    queryFn: () => fetchRecipe(id),
  });
  return { data };
};

export type {ViewStatus} from "./api/api";
