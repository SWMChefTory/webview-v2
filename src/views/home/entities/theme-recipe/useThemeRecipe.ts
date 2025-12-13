import {useSuspenseQuery} from "@tanstack/react-query";
import { fetchTrendingRecipes, fetchChefRecommendRecipes } from "@/src/views/home/entities/theme-recipe/api";

const TRENDING_RECIPES_QUERY_KEY = "trending-recipes";
const CHEF_RECOMMEND_RECIPES_QUERY_KEY = "chef-recommend-recipes";

export const useFetchTrendingRecipes = () => {
  const { data } = useSuspenseQuery({
    queryKey: [TRENDING_RECIPES_QUERY_KEY],
    queryFn: fetchTrendingRecipes,
  });
  return {data};
};
export const useFetchChefRecommendRecipes = () => {
  const { data } = useSuspenseQuery({
    queryKey: [CHEF_RECOMMEND_RECIPES_QUERY_KEY],
    queryFn: fetchChefRecommendRecipes,
  });
  return {data};
};