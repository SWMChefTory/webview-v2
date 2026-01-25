import React from "react";
import { useTranslation } from "next-i18next";
import { RecipeCreateToast } from "@/src/entities/user-recipe/ui/toast";
import { Viewport } from "@radix-ui/react-toast";
import { useFetchPopularRecipe } from "@/src/entities/popular-recipe/model/usePopularRecipe";
import { VideoType } from "@/src/entities/popular-recipe/type/videoType";
import { useInfiniteScroll } from "@/src/shared/hooks";
import type { PopularSummaryRecipe } from "@/src/entities/popular-recipe/api/api";

export type PopularRecipeVariant = "mobile" | "tablet" | "desktop";

export interface PopularRecipePageProps {
  title: string;
  renderToast: (viewportClassName: string) => React.ReactNode;
}

export interface PopularRecipeContentProps {
  recipes: PopularSummaryRecipe[];
  isFetchingNextPage: boolean;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
  renderToast: (viewportClassName: string) => React.ReactNode;
}

export function usePopularRecipeController(
  _variant: PopularRecipeVariant
): PopularRecipePageProps {
  const { t } = useTranslation("popular-recipe");

  return {
    title: t("popularRecipes"),
    renderToast: (viewportClassName: string) => (
      <RecipeCreateToast>
        <Viewport className={viewportClassName} />
      </RecipeCreateToast>
    ),
  };
}

export function usePopularRecipeContent(
  variant: PopularRecipeVariant
): Omit<PopularRecipeContentProps, "renderToast"> {
  const {
    data: recipes,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useFetchPopularRecipe(VideoType.NORMAL);

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
