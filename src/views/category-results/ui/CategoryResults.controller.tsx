import {
  useFetchCuisineRecipes,
  CuisineRecipe,
} from "@/src/entities/cuisine-recipe/model/useCuisineRecipe";
import {
  useFetchRecommendRecipes,
} from "@/src/entities/recommend-recipe/model/useRecommendRecipe";
import type { RecommendRecipe } from "@/src/entities/recommend-recipe/api/api";
import { CuisineType, toCuisineType } from "@/src/entities/category/type/cuisineType";
import { RecommendType, toRecommendType } from "@/src/entities/recommend-recipe/type/recommendType";
import { useCategoryTranslation } from "@/src/entities/category/hooks/useCategoryTranslation";
import { useCategoryResultsTranslation } from "@/src/views/category-results/hooks/useCategoryResultsTranslation";
import { VideoType } from "@/src/entities/recommend-recipe/type/videoType";
import { RecipeCardEntryPoint } from "@/src/widgets/recipe-creating-modal/recipeCardWrapper";
import { useInfiniteScroll } from "@/src/shared/hooks";

export type CategoryResultsVariant = "mobile" | "tablet" | "desktop";

export interface CategoryResultsControllerProps {
  recipes: CuisineRecipe[] | RecommendRecipe[];
  totalElements: number;
  categoryName: string;
  isFetchingNextPage: boolean;
  isRecommendType: boolean;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  t: (key: string, options?: Record<string, unknown>) => string;
  getVideoType: (recipe: CuisineRecipe | RecommendRecipe) => VideoType;
  getEntryPoint: () => RecipeCardEntryPoint;
  getVideoUrl: (recipe: CuisineRecipe | RecommendRecipe) => string;
}

export function useCategoryResultsController(
  categoryType: string,
  _variant: CategoryResultsVariant,
  videoTypeParam?: string
): CategoryResultsControllerProps {
  const { t } = useCategoryResultsTranslation();
  const { t: categoryT } = useCategoryTranslation();

  const recommendType = toRecommendType(categoryType);
  const cuisineType = toCuisineType(categoryType);
  const isRecommend = recommendType !== undefined;

  const videoType =
    typeof videoTypeParam === "string" &&
    Object.values(VideoType).includes(videoTypeParam as VideoType)
      ? (videoTypeParam as VideoType)
      : undefined;

  const cuisineQuery = useFetchCuisineRecipes({
    cuisineType: cuisineType ?? CuisineType.KOREAN,
  });

  const recommendQuery = useFetchRecommendRecipes({
    recommendType: recommendType ?? RecommendType.POPULAR,
    ...(videoType ? { videoType } : {}),
  });

  const query = isRecommend ? recommendQuery : cuisineQuery;
  const {
    entities: recipes,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = query;

  const totalElements = recipes.length;

  const categoryName = isRecommend
    ? categoryT(`recommend.${recommendType}`)
    : categoryT(`cuisine.${cuisineType ?? CuisineType.KOREAN}`);

  const { loadMoreRef } = useInfiniteScroll(
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    { rootMargin: "50px" }
  );

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
    loadMoreRef,
    t,
    getVideoType,
    getEntryPoint,
    getVideoUrl,
  };
}
