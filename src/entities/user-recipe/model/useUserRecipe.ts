import {
  fetchCategorizedRecipesSummary,
  fetchAllRecipesSummary,
  fetchRecipeProgress,
  updateCategory,
} from "@/src/entities/user-recipe/model/api";
import {
  RecipeStatus,
  RecipeProgressDetail,
} from "@/src/entities/user-recipe/type/type";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { RecipeCreateStatusResponse } from "@/src/entities/user-recipe/model/api";

import { useMutation } from "@tanstack/react-query";
import { createRecipe } from "@/src/entities/user-recipe/model/api";
import { useEffect, useRef, useState } from "react";
import { CATEGORY_QUERY_KEY } from "../../category/model/useCategory";

import { VideoType } from "../../recommend-recipe/type/videoType";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";

import { BALANCE_QUERY_KEY } from "../../balance/model/useFetchBalance";
import { CUISINE_RECIPE_QUERY_KEY } from "../../cuisine-recipe/model/useCuisineRecipe";
import { RECIPE_SEARCH_QUERY_KEY } from "../../recipe-searched/useRecipeSearched";
import { RECOMMEND_RECIPE_QUERY_KEY } from "../../recommend-recipe/model/useRecommendRecipe";
import { useCursorPaginationQuery } from "@/src/shared/hooks/usePaginationQuery";
import { useRecipeEnrollModalStore } from "@/src/widgets/recipe-creating-modal/recipeErollModalStore";

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

// 에러 타입 추출 헬퍼 함수
function getErrorType(error: Error): string {
  const message = error.message.toLowerCase();
  if (message.includes("network") || message.includes("fetch"))
    return "network";
  if (message.includes("timeout")) return "timeout";
  return "server";
}

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

export function useCreateRecipe() {
  const queryClient = useQueryClient();
  const { open } = useRecipeEnrollModalStore();

  const {
    mutateAsync,
    mutate,
    data,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: async ({
      youtubeUrl,
      targetCategoryId = null,
      recipeId: existingRecipeId,
      videoType,
      recipeTitle,
    }: {
      youtubeUrl: string;
      targetCategoryId?: string | null;
      recipeId?: string;
      videoType?: VideoType;
      recipeTitle?: string;
      // Amplitude 추적용 필드 (4단계에서 사용)
      _source?: string;
      _entryPoint?: string;
      _creationMethod?: "card" | "url";
      _hasTargetCategory?: boolean;
      _videoUrl?: string;
      _videoId?: string;
    }) => {
      validateUrl(youtubeUrl);
      const standardUrl = convertToStandardYouTubeUrl(youtubeUrl);
      const recipeId = await createRecipe(standardUrl);
      if (targetCategoryId)
        await updateCategory({ recipeId, targetCategoryId });
      return { recipeId, standardUrl };
    },
    onMutate: async ({
      youtubeUrl,
      recipeId: existingRecipeId,
      videoType,
      recipeTitle,
    }) => {
      if (!existingRecipeId) {
        return null;
      }
      if (!videoType) {
        throw new Error("videoType is required");
      }
    },
    throwOnError: false,
    onSuccess: (data, variables) => {
      if (variables._creationMethod === "card") {
        // 카드 경로 성공
        track(AMPLITUDE_EVENT.RECIPE_CREATE_SUCCESS_CARD, {
          entry_point: variables._source,
          video_type: variables.videoType || "NORMAL",
          recipe_id: data.recipeId,
        });
      } else if (variables._creationMethod === "url") {
        track(AMPLITUDE_EVENT.RECIPE_CREATE_SUCCESS_URL, {
          entry_point: variables._entryPoint,
          recipe_id: data.recipeId,
          has_target_category: variables._hasTargetCategory || false,
          video_url: variables._videoUrl,
          video_id: variables._videoId,
        });
      }

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
    onError: (error, _vars, ctx) => {
      const errorType = getErrorType(error);
      if (_vars._creationMethod === "card") {
        // 카드 경로 실패
        track(AMPLITUDE_EVENT.RECIPE_CREATE_FAIL_CARD, {
          entry_point: _vars._source,
          error_type: errorType,
          error_message: error.message,
        });
      } else if (_vars._creationMethod === "url") {
        // URL 경로 실패
        track(AMPLITUDE_EVENT.RECIPE_CREATE_FAIL_URL, {
          entry_point: _vars._entryPoint,
          error_type: errorType,
          error_message: error.message,
          video_url: _vars._videoUrl,
          video_id: _vars._videoId,
        });
      }
    },
  });
  return {
    recipeId: data ?? null,
    isLoading,
    error,
    create: mutate,
    createAsync: mutateAsync,
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
      recipeProgressDetails: data.recipeProgressStatuses.map(
        (status) => status.progressDetail
      ),
    });
  }
}

const createInProress = (
  realProgress: RecipeProgressStatus,
  isInFakeProgress: boolean
) => {
  const real = realProgress.recipeStatus;

  if (real === RecipeStatus.SUCCESS || real === RecipeStatus.FAILED) {
    return real;
  }

  return isInFakeProgress ? RecipeStatus.IN_PROGRESS : real;
};

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
  const { data: progress, refetch } = useSuspenseQuery({
    queryKey: [QUERY_KEY_RECIPE_PROGRESS, recipeId],
    queryFn: () => fetchRecipeProgress(recipeId),
    staleTime: 5 * 60 * 1000,
    select: (data) => RecipeProgressStatus.create(data),
  });

  const [isInProgressBefore, setIsInProgressBefore] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (progress.recipeStatus === RecipeStatus.IN_PROGRESS) {
      timerRef.current = setInterval(() => {
        refetch();
      }, 1000);
      setIsInProgressBefore(true);
    }
    if (progress.recipeStatus === RecipeStatus.FAILED) {
      clearInterval(timerRef.current);
      setIsInProgressBefore(false);
    }
    if (isInProgressBefore && progress.recipeStatus === RecipeStatus.SUCCESS) {
      clearInterval(timerRef.current);
      setIsInProgressBefore(false);
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
