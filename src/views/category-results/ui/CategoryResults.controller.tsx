import {
  useFetchCuisineRecipes,
  CuisineRecipe,
} from "@/src/entities/cuisine-recipe/model/useCuisineRecipe";
import {
  useFetchRecommendRecipes,
  RecommendRecipe,
} from "@/src/entities/recommend-recipe/model/useRecommendRecipe";
import {
  CategoryType,
  isRecommendType,
  RecommendType,
  CuisineType,
} from "@/src/entities/category/type/cuisineType";
import { useCategoryTranslation } from "@/src/entities/category/hooks/useCategoryTranslation";
import { useCategoryResultsTranslation } from "@/src/entities/category-results/hooks/useCategoryResultsTranslation";
import { VideoType } from "@/src/entities/popular-recipe/type/videoType";
import { RecipeCardEntryPoint } from "@/src/widgets/recipe-create-dialog/recipeCardWrapper";
import { useInfiniteScroll } from "@/src/shared/hooks";

export type CategoryResultsVariant = "mobile" | "tablet" | "desktop";

export interface CategoryResultsControllerProps {
  recipes: CuisineRecipe[] | RecommendRecipe[];
  totalElements: number;
  categoryName: string;
  isFetchingNextPage: boolean;
  isRecommendType: boolean;
  loadMoreRef: React.RefObject<HTMLDivElement>;
  t: (key: string, options?: Record<string, unknown>) => string;
  getVideoType: (recipe: CuisineRecipe | RecommendRecipe) => VideoType;
  getEntryPoint: () => RecipeCardEntryPoint;
  getVideoUrl: (recipe: CuisineRecipe | RecommendRecipe) => string;
}

export function useCategoryResultsController(
  categoryType: CategoryType,
  _variant: CategoryResultsVariant
): CategoryResultsControllerProps {
  const { t } = useCategoryResultsTranslation();
  const { t: categoryT } = useCategoryTranslation();

  const isRecommend = isRecommendType(categoryType);

  const cuisineQuery = useFetchCuisineRecipes({
    cuisineType: isRecommend ? ("KOREAN" as CuisineType) : (categoryType as CuisineType),
  });

  const recommendQuery = useFetchRecommendRecipes({
    recommendType: isRecommend ? (categoryType as RecommendType) : ("QUICK" as RecommendType),
  });

  const query = isRecommend ? recommendQuery : cuisineQuery;
  const {
    data: recipes,
    totalElements,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = query;

  const categoryName = isRecommend
    ? categoryT(`recommend.${categoryType}`)
    : categoryT(`cuisine.${categoryType}`);

  const { loadMoreRef } = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage, { rootMargin: "50px" });

  const getVideoType = (recipe: CuisineRecipe | RecommendRecipe): VideoType => {
    return recipe.videoInfo.videoType === "SHORTS"
      ? VideoType.SHORTS
      : VideoType.NORMAL;
  };

  const getEntryPoint = (): RecipeCardEntryPoint => {
    return isRecommend ? "category_recommend" : "category_cuisine";
  };

  const getVideoUrl = (recipe: CuisineRecipe | RecommendRecipe): string => {
    return `https://www.youtube.com/watch?v=${recipe.videoInfo.videoId}`;
  };

  return {
    recipes,
    totalElements,
    categoryName,
    isFetchingNextPage,
    isRecommendType: isRecommend,
    loadMoreRef: loadMoreRef as React.RefObject<HTMLDivElement>,
    t,
    getVideoType,
    getEntryPoint,
    getVideoUrl,
  };
}
