import { useEffect, useRef, useCallback } from "react";
import { useSearchResultsTranslation } from "../hooks/useSearchResultsTranslation";
import {
  useFetchRecipesSearched,
  Recipe,
} from "@/src/entities/recipe-searched/useRecipeSearched";
import { useInfiniteScroll } from "@/src/shared/hooks";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";

export type SearchResultsVariant = "mobile" | "tablet" | "desktop";

export interface SearchResultsTranslations {
  emptyTitle: string;
  emptySubtitle: string;
  headerSuffix: string;
  headerTotalCount: (count: number) => string;
  cardBadge: string;
  cardServing: (count: number) => string;
  cardMinute: (count: number) => string;
}

export interface SearchResultsControllerProps {
  searchResults: Recipe[];
  totalElements: number;
  keyword: string;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  isFetchingNextPage: boolean;
  translations: SearchResultsTranslations;
  onRecipeClick: (recipe: Recipe, position: number) => void;
}

export function useSearchResultsController(keyword: string): SearchResultsControllerProps {
  const { t } = useSearchResultsTranslation();

  const {
    data: searchResults,
    totalElements,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useFetchRecipesSearched({ query: keyword });

  const { loadMoreRef } = useInfiniteScroll(
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    { rootMargin: "50px" }
  );

  const hasTrackedView = useRef(false);
  useEffect(() => {
    if (!hasTrackedView.current && searchResults.length > 0) {
      track(AMPLITUDE_EVENT.SEARCH_RESULTS_VIEW, {
        keyword,
        result_count: totalElements,
      });
      hasTrackedView.current = true;
    }
  }, [keyword, searchResults.length, totalElements]);

  const onRecipeClick = useCallback(
    (recipe: Recipe, position: number) => {
      track(AMPLITUDE_EVENT.SEARCH_RESULT_CLICK, {
        keyword,
        position,
        recipe_id: recipe.recipeId,
        is_registered: recipe.isViewed,
        video_type: recipe.videoInfo.videoType || "NORMAL",
      });
    },
    [keyword]
  );

  const translations: SearchResultsTranslations = {
    emptyTitle: t("empty.title"),
    emptySubtitle: t("empty.subtitle"),
    headerSuffix: t("header.suffix"),
    headerTotalCount: (count: number) => t("header.totalCount", { count }),
    cardBadge: t("card.badge"),
    cardServing: (count: number) => t("card.serving", { count }),
    cardMinute: (count: number) => t("card.minute", { count }),
  };

  return {
    searchResults,
    totalElements,
    keyword,
    loadMoreRef,
    isFetchingNextPage,
    translations,
    onRecipeClick,
  };
}
