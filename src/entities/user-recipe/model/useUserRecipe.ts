import {
  fetchCategorizedRecipesSummary,
  fetchAllRecipesSummary,
  fetchRecipeProgress,
  updateCategory,
} from "@/src/entities/user-recipe/model/api/api";
import {
  RecipeStatus,
  RecipeProgressDetail,
} from "@/src/entities/user-recipe/model/api/enum";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { RecipeCreateStatusResponse } from "@/src/entities/user-recipe/model/api/api";

import { useMutation } from "@tanstack/react-query";
import { createRecipe } from "@/src/entities/user-recipe/model/api/api";
import { useEffect, useRef, useState } from "react";
import { CATEGORY_QUERY_KEY } from "../../category/model/useCategory";


import { BALANCE_QUERY_KEY } from "../../balance/model/useFetchBalance";
import { CUISINE_RECIPE_QUERY_KEY } from "../../cuisine-recipe/model/useCuisineRecipe";
import { RECIPE_SEARCH_QUERY_KEY } from "../../recipe-searched/model/useRecipeSearched";
import { RECOMMEND_RECIPE_QUERY_KEY } from "../../recommend-recipe/model/useRecommendRecipe";
import { useCursorPaginationQuery } from "@/src/shared/hooks/usePaginationQuery";
import { useRecipeEnrollModalStore } from "@/src/widgets/recipe-creating-modal/recipeErollModalStore";
import { RECIPE_QUERY_KEY } from "../../recipe";

// export const QUERY_KEY = "categoryRecipes";

export const ALL_RECIPES = "allRecipes";

export const useFetchAllRecipes = () => {
  const result = useCursorPaginationQuery({
    queryKey: [ALL_RECIPES],
    queryFn: async ({ pageParam }) =>
      fetchAllRecipesSummary({ cursor: pageParam }),
  });
  return result;
};

export const useFetchCategoryRecipes = (category: {
  name: string;
  id: string;
}) => {
  const result = useCursorPaginationQuery({
    queryKey: [ALL_RECIPES, category.id],
    queryFn: ({ pageParam }) =>
      fetchCategorizedRecipesSummary({
        categoryId: category.id,
        categoryName: category.name,
        cursor: pageParam,
      }),
  });
  return result;
};


const isValidYouTubeUrl = (url: string): boolean => {
  const youtubePatterns = [
    /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
    /^https?:\/\/youtu\.be\/[\w-]+/,
    /^https?:\/\/(m\.)?youtube\.com\/watch\?v=[\w-]+/,
    /^https?:\/\/youtube\.com\/watch\?v=[\w-]+/,
    /^https?:\/\/(www\.)?youtube\.com\/shorts\/[\w-]+/,
    /^https?:\/\/(m\.)?youtube\.com\/shorts\/[\w-]+/,
  ];

  return youtubePatterns.some((pattern) => pattern.test(url.trim()));
};

export const extractYouTubeVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
    /youtube\.com\/shorts\/([^"&?\/\s]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

const validateUrl = (url: string) => {
  const trimmedUrl = url.trim();

  if (!trimmedUrl) {
    return new Error("영상 링크를 입력해주세요");
  }

  if (!isValidYouTubeUrl(trimmedUrl)) {
    return new Error("올바른 유튜브 링크를 입력해주세요");
  }
};

const convertToStandardYouTubeUrl = (url: string): string => {
  const trimmedUrl = url.trim();
  const videoId = extractYouTubeVideoId(trimmedUrl);

  if (!videoId) {
    return url;
  }
  return `https://www.youtube.com/watch?v=${videoId}`;
};

export function useUpdateCategoryOfRecipe() {
  const queryClient = useQueryClient();
  const {
    mutate,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: async ({
      recipeId,
      targetCategoryId,
    }: {
      recipeId: string;
      targetCategoryId: string;
    }) => {
      return updateCategory({ recipeId, targetCategoryId });
    },
    onSuccess: (data) => {

      queryClient.invalidateQueries({
        queryKey: [ALL_RECIPES],
      });
      queryClient.invalidateQueries({
        queryKey: [CATEGORY_QUERY_KEY],
      });
    },
  });
  return {
    updateCategory: mutate,
    isLoading,
    error,
  };
}

export type CreateRecipeResult = { recipeId: string; standardUrl: string };
export type CreateRecipeVariables = {
  youtubeUrl: string;
  targetCategoryId?: string | null;
};

export function useCreateRecipe() {
  const queryClient = useQueryClient();
  const { open } = useRecipeEnrollModalStore();

  const {
    mutate,
    data,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: async ({
      youtubeUrl,
      targetCategoryId = null,
    }: CreateRecipeVariables) => {
      validateUrl(youtubeUrl);
      const standardUrl = convertToStandardYouTubeUrl(youtubeUrl);
      const recipeId = await createRecipe(standardUrl);
      if (targetCategoryId)
        await updateCategory({ recipeId, targetCategoryId });
      return { recipeId, standardUrl };
    },
    throwOnError: false,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [ALL_RECIPES],
        type: "all",
      });
      queryClient.invalidateQueries({
        queryKey: [CATEGORY_QUERY_KEY],
        type: "all",
      });
      queryClient.invalidateQueries({
        queryKey: [BALANCE_QUERY_KEY],
        type: "all",
      });
      queryClient.invalidateQueries({
        queryKey: [CUISINE_RECIPE_QUERY_KEY],
        type: "all",
      });
      queryClient.invalidateQueries({
        queryKey: [RECIPE_SEARCH_QUERY_KEY],
        type: "all",
      });
      queryClient.invalidateQueries({
        queryKey: [RECOMMEND_RECIPE_QUERY_KEY],
        type: "all",
      });
      open(data.recipeId);
    },
    onError: () => { },
  });
  return {
    recipeId: data ?? null,
    isLoading,
    error,
    create: mutate,
    validateUrl,
  };
}

export const QUERY_KEY_RECIPE_PROGRESS = "recipeProgress";

class RecipeProgressStatus {
  recipeStatus!: RecipeStatus;
  recipeProgressDetails!: RecipeProgressDetail[];

  private constructor(data: unknown) {
    Object.assign(this, data);
    Object.freeze(this);
  }

  public static create(data: RecipeCreateStatusResponse) {
    return new RecipeProgressStatus({
      recipeStatus: data.recipeStatus,
    });
  }
}

export const useFetchRecipeProgress = ({ recipeId }: { recipeId: string }) => {
  const { data: progress } = useSuspenseQuery({
    queryKey: [QUERY_KEY_RECIPE_PROGRESS, recipeId],
    queryFn: () => fetchRecipeProgress(recipeId),
    staleTime: 5 * 60 * 1000,
    select: (data) => RecipeProgressStatus.create(data),
  });

  return {
    recipeStatus: progress.recipeStatus,
  };
};

export const useFetchRecipeProgressWithRefetch = (recipeId: string) => {
  const queryClient = useQueryClient();
  const { data: progress, refetch } = useSuspenseQuery({
    queryKey: [QUERY_KEY_RECIPE_PROGRESS, recipeId],
    queryFn: () => fetchRecipeProgress(recipeId),
    staleTime: 5 * 60 * 1000,
    select: (data) => RecipeProgressStatus.create(data),
  });

  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (progress.recipeStatus === RecipeStatus.IN_PROGRESS) {
      timerRef.current = setInterval(() => {
        refetch();
      }, 1000);
    }
    if (progress.recipeStatus === RecipeStatus.FAILED) {
      clearInterval(timerRef.current);
    }
    if (progress.recipeStatus === RecipeStatus.BANNED || progress.recipeStatus === RecipeStatus.BLOCKED) {
      clearInterval(timerRef.current);
    }
    if (progress.recipeStatus === RecipeStatus.SUCCESS) {
      clearInterval(timerRef.current);
      queryClient.invalidateQueries({
        queryKey: [RECIPE_QUERY_KEY, recipeId],
      });
      queryClient.invalidateQueries({
        queryKey: [ALL_RECIPES],
      });
      queryClient.invalidateQueries({
        queryKey: [CATEGORY_QUERY_KEY],
      });
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [progress.recipeStatus, recipeId]);

  return {
    recipeStatus: progress.recipeStatus,
  };
};
