import React from "react";
import { useTranslation } from "next-i18next";
import { useFetchRecommendRecipes } from "@/src/entities/recommend-recipe/model/useRecommendRecipe";
import { RecommendType } from "@/src/entities/recommend-recipe";
import { VideoType } from "@/src/entities/recommend-recipe";
import { useInfiniteScroll } from "@/src/shared/hooks";
import type { RecommendRecipe } from "@/src/entities/recommend-recipe";

export type PopularRecipeVariant = "mobile" | "tablet" | "desktop";

export interface PopularRecipePageProps {
  title: string;
}

export interface PopularRecipeContentProps {
  recipes: RecommendRecipe[];
  isFetchingNextPage: boolean;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
}

export function usePopularRecipeController(
  _variant: PopularRecipeVariant
): PopularRecipePageProps {
  const { t } = useTranslation("popular-recipe");

  return {
    title: t("popularRecipes"),
  };
}

export function usePopularRecipeContent(
  variant: PopularRecipeVariant
): Omit<PopularRecipeContentProps, "renderToast"> {
  const {
    entities: recipes,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useFetchRecommendRecipes({
    recommendType: RecommendType.POPULAR,
    videoType: VideoType.NORMAL,
  });

  const { loadMoreRef } = useInfiniteScroll(
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    { rootMargin: "50px" }
  );

  const onScroll = variant === "mobile" 
    ? (event: React.UIEvent<HTMLDivElement>) => {
        const target = event.target as HTMLDivElement;
        if (target.scrollTop + target.clientHeight >= target.scrollHeight - 10) {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }
      }
    : undefined;

  return {
    recipes,
    isFetchingNextPage,
    loadMoreRef,
    onScroll,
  };
}
