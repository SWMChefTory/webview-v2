import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enrollBookmark, cancelBookmark } from "./api/api";
import { ALL_RECIPES } from "./useUserRecipe";
import { CATEGORY_QUERY_KEY } from "../../category/model/useCategory";
import { BALANCE_QUERY_KEY } from "../../balance/model/useFetchBalance";
import { CUISINE_RECIPE_QUERY_KEY } from "../../cuisine-recipe/model/useCuisineRecipe";
import { RECIPE_SEARCH_QUERY_KEY } from "../../recipe-searched/model/useRecipeSearched";
import { RECOMMEND_RECIPE_QUERY_KEY } from "../../recommend-recipe/model/useRecommendRecipe";
import { RECIPE_QUERY_KEY } from "../../recipe/";

export const BOOKMARK_QUERY_KEY = "BOOKMARK_QUERY_KEY";

export function useEnrollBookmark() {
  const queryClient = useQueryClient();

  const {
    mutate,
    mutateAsync,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: async (recipeId: string) => {
      return await enrollBookmark(recipeId);
    },
    onSuccess: () => {
      console.log("enrollBookmark success!!!!!!!!!!!!!", RECIPE_QUERY_KEY);
      queryClient.invalidateQueries({
        queryKey: [RECIPE_QUERY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [ALL_RECIPES],
      });
      queryClient.invalidateQueries({
        queryKey: [CATEGORY_QUERY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [BALANCE_QUERY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [CUISINE_RECIPE_QUERY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [RECIPE_SEARCH_QUERY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [RECOMMEND_RECIPE_QUERY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [BOOKMARK_QUERY_KEY],
      });
    },
  });

  return {
    enrollBookmark: mutate,
    enrollBookmarkAsync: mutateAsync,
    isLoading,
    error,
  };
}

export function useCancelBookmark() {
  const queryClient = useQueryClient();

  const {
    mutate,
    mutateAsync,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: async (recipeId: string) => {
      return cancelBookmark(recipeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ALL_RECIPES],
      });
      queryClient.invalidateQueries({
        queryKey: [CATEGORY_QUERY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [BALANCE_QUERY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [CUISINE_RECIPE_QUERY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [RECIPE_SEARCH_QUERY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [RECOMMEND_RECIPE_QUERY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [BOOKMARK_QUERY_KEY],
      });
    },
  });

  return {
    cancelBookmark: mutate,
    cancelBookmarkAsync: mutateAsync,
    isLoading,
    error,
  };
}
