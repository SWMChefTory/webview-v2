import {
  fetchCategorizedRecipesSummary,
  fetchAllRecipesSummary,
  fetchRecipeProgress,
  updateCategory,
} from "@/src/entities/user_recipe/model/api";
import {
  RecipeStatus,
  RecipeProgressDetail,
} from "@/src/entities/user_recipe/type/type";
import {
  useSuspenseInfiniteQuery,
  useQueryClient,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";

import { RecipeCreateStatusResponse } from "@/src/entities/user_recipe/model/api";

import { useMutation } from "@tanstack/react-query";
import { createRecipe } from "@/src/entities/user_recipe/model/api";
import { useEffect, useRef, useState } from "react";
import { Category, CATEGORY_QUERY_KEY } from "../../category/model/useCategory";
import { PaginatedRecipes } from "@/src/entities/user_recipe/model/api";
import { UserRecipe } from "@/src/entities/user_recipe/model/schema";
import {
  patchIsViewedOptimistically,
  rollbackIsViewed,
} from "../../popular-recipe/model/usePopularRecipe";

import { useFakeRecipeInCreatingStore } from "@/src/entities/user_recipe/model/useFakeRecipeInCreatingStore";
import {
  RecipeCreateToastStatus,
  useRecipeCreateToastAction,
} from "./useToast";
import { VideoType } from "../../popular-recipe/type/videoType";

export const QUERY_KEY = "categoryRecipes";
export const ALL_RECIPE_QUERY_KEY = "uncategorizedRecipes";

export const ALL_RECIPES = "allRecipes";

export function useFetchUserRecipes(category: Category | typeof ALL_RECIPES): {
  recipes: UserRecipe[];
  totalElements: number;
  refetchAll: () => void;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  error: Error | null;
} {
  const queryClient = useQueryClient();
  const {
    data: { recipes, totalElements } = { recipes: [], totalElements: 0 },
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useSuspenseInfiniteQuery({
    queryKey: (() => {
      return category === ALL_RECIPES
        ? [ALL_RECIPE_QUERY_KEY]
        : [QUERY_KEY, category?.id ?? "unknown"];
    })(),
    queryFn: ({ pageParam = 0 }) => {
      switch (category) {
        case ALL_RECIPES:
          return fetchAllRecipesSummary({ page: pageParam });
        default:
          return fetchCategorizedRecipesSummary({
            categoryId: category.id,
            categoryName: category.name,
            page: pageParam,
          });
      }
    },
    getNextPageParam: (lastPage: PaginatedRecipes) => {
      return lastPage.hasNext ? lastPage.currentPage + 1 : undefined;
    },
    select: (data) => {
      if (!data) {
        throw new Error("Data is not valid");
      }
      return {
        recipes: data.pages.flatMap((page) => page.data),
        totalElements: data.pages[0].totalElements,
      };
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
  });

  const refetchAll = () => {
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEY, (category as Category)?.id || ALL_RECIPE_QUERY_KEY],
    });
  };

  const handleFetchNextPage = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return {
    recipes,
    totalElements,
    refetchAll,
    fetchNextPage: handleFetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  };
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

const extractYouTubeVideoId = (url: string): string | null => {
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
        queryKey: [QUERY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [ALL_RECIPE_QUERY_KEY],
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
  const { handleAddFakeCreating } = useFakeRecipeInCreatingStore();
  const { handleOpenToast } = useRecipeCreateToastAction();
  const {
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
      handleOpenToast({
        toastInfo: {
          status: RecipeCreateToastStatus.IN_PROGRESS,
          recipeTitle: recipeTitle || "",
        },
      });
      if (!existingRecipeId) {
        return null;
      }
      if (!videoType) {
        throw new Error("videoType is required");
      }
      handleAddFakeCreating({
        recipeId: existingRecipeId,
        recipeTitle: recipeTitle ?? "",
      });
      return await patchIsViewedOptimistically(
        queryClient,
        existingRecipeId,
        true,
        videoType
      );
    },
    throwOnError: false,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [ALL_RECIPE_QUERY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [CATEGORY_QUERY_KEY],
      });
    },
    onError: (error, _vars, ctx) => {
      handleOpenToast({
        toastInfo: {
          status: RecipeCreateToastStatus.FAILED,
          errorMessage: `url 주소 : ${_vars.youtubeUrl} 레시피 생성에 실패했어요`,
        },
      });
      if (!_vars.videoType) {
        console.log("videoType is not found");
        throw new Error("videoType is required");
      }
      if (ctx?.prevList) {
        rollbackIsViewed(
          queryClient,
          { prevList: ctx.prevList },
          _vars.videoType
        );
      }
    },
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
  const isInCreating = isInFakeProgress
    ? RecipeStatus.IN_PROGRESS
    : realProgress.recipeStatus;
  return isInCreating;
};

export const useFetchRecipeProgress = ({ recipeId }: { recipeId: string }) => {
  const { isInCreating: isInCreatingFake } = useFakeRecipeInCreatingStore();
  const { data: progress } = useSuspenseQuery({
    queryKey: [QUERY_KEY_RECIPE_PROGRESS, recipeId],
    queryFn: () => fetchRecipeProgress(recipeId),
    staleTime: 5 * 60 * 1000,
    select: (data) => RecipeProgressStatus.create(data),
  });

  return {
    recipeStatus: createInProress(progress, isInCreatingFake(recipeId)),
  };
};

export const useFetchRecipeProgressWithToast = (recipeId: string) => {
  const { isInCreating: isInCreatingFake } = useFakeRecipeInCreatingStore();
  const { handleOpenToast } = useRecipeCreateToastAction();
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
        console.log("refetch");
      }, 1000);
      setIsInProgressBefore(true);
    }
    if (progress.recipeStatus === RecipeStatus.FAILED) {
      handleOpenToast({
        toastInfo: {
          status: RecipeCreateToastStatus.FAILED,
          errorMessage: "",
        },
      });
      clearInterval(timerRef.current);
      setIsInProgressBefore(false);
    }
    if (isInProgressBefore && progress.recipeStatus === RecipeStatus.SUCCESS) {
      handleOpenToast({
        toastInfo: {
          status: RecipeCreateToastStatus.SUCCESS,
          recipeId: recipeId,
          recipeTitle: "test",
        },
      });
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
    recipeStatus: createInProress(progress, isInCreatingFake(recipeId)),
  };
};
