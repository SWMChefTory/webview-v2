import { useQuery } from "@tanstack/react-query";
import {
  fetchRecipe,
  VideoInfoResponse,
  IngredientResponse,
  RecipeStepDetailResponse,
  RecipeStepResponse,
  RecipeTagResponse,
  RecipeBriefingResponse,
  ViewStatusResponse,
  RecipeDetailMetaResponse,
  RecipeResponse,
} from "../api/api";

class VideoInfo {
  id!: string;
  thumbnailUrl!: string;
  seconds!: number;
  lastPlaySeconds!: number;

  private constructor(data: unknown) {
    Object.assign(this, data);
    Object.freeze(this);
  }

  static create(data: VideoInfoResponse) {
    return new VideoInfo({
      id: data.videoId,
      thumbnailUrl: data.videoThumbnailUrl,
      seconds: data.videoSeconds,
      lastPlaySeconds: data.videoSeconds,
    });
  }
}

class Ingredient {
  name!: string;
  amount?: number;
  unit?: string;

  private constructor(data: unknown) {
    Object.assign(this, data);
    Object.freeze(this);
  }

  static create(data: IngredientResponse) {
    return new Ingredient({
      name: data.name,
      amount: data.amount,
      unit: data.unit,
    });
  }
}

class RecipeStepDetail {
  text!: string;
  start!: number;

  private constructor(data: unknown) {
    Object.assign(this, data);
    Object.freeze(this);
  }

  static create(data: RecipeStepDetailResponse) {
    return new RecipeStepDetail({
      text: data.text,
      start: data.start,
    });
  }
}

class RecipeStep {
  id!: string;
  stepOrder!: number;
  subtitle!: string;
  startTime!: number;
  details!: RecipeStepDetail[];

  private constructor(data: unknown) {
    Object.assign(this, data);
    Object.freeze(this);
  }

  static create(data: RecipeStepResponse) {
    return new RecipeStep({
      id: data.id,
      stepOrder: data.stepOrder,
      subTitle: data.subtitle,
      startTime: data.startTime,
      details: data.details.map(RecipeStepDetail.create),
    });
  }
}

class RecipeTag {
  name!: string;

  private constructor(data: unknown) {
    Object.assign(this, data);
    Object.freeze(this);
  }

  static create(data: RecipeTagResponse) {
    return new RecipeTag({
      name: data.name,
    });
  }
}

class RecipeBriefing {
  content!: string;

  private constructor(data: unknown) {
    Object.assign(this, data);
    Object.freeze(this);
  }

  static create(data: RecipeBriefingResponse) {
    return new RecipeBriefing({
      content: data.content,
    });
  }
}

class ViewStatus {
  id!: string;
  viewedAt!: string;
  lastPlaySeconds!: number;
  createdAt!: string;

  private constructor(data: unknown) {
    Object.assign(this, data);
    Object.freeze(this);
  }

  static create(data: ViewStatusResponse) {
    return new ViewStatus({
      id: data.id,
      viewedAt: data.viewedAt,
      lastPlaySeconds: data.lastPlaySeconds,
      createdAt: data.createdAt,
    });
  }
}

class RecipeDetailMeta {
  id!: string;
  description!: string;
  servings!: number;
  cookTime!: number;

  private constructor(data: unknown) {
    Object.assign(this, data);
    Object.freeze(this);
  }

  static create(data: RecipeDetailMetaResponse) {
    return new RecipeDetailMeta({
      description: data.description,
      servings: data.servings,
      cookTime: data.cookingTime,
    });
  }
}

class Recipe {
  videoInfo!: VideoInfo;
  viewStatus!: ViewStatus;
  detailMeta?: RecipeDetailMeta;
  ingredients?: Ingredient[];
  steps?: RecipeStep[];
  tags?: RecipeTag[];
  briefings?: RecipeBriefing[];

  private constructor(data: unknown) {
    Object.assign(this, data);
    Object.freeze(this);
  }

  static create(data: RecipeResponse) {
    return new Recipe({
      status: data.recipeStatus,
      videoInfo: VideoInfo.create(data.videoInfo),
      viewStatus: ViewStatus.create(data.viewStatus),
      detailMeta: data.recipeDetailMeta
        ? RecipeDetailMeta.create(data.recipeDetailMeta)
        : undefined,
      ingredients: data.recipeIngredient
        ? data.recipeIngredient.map(Ingredient.create)
        : undefined,
      steps: data.recipeSteps
        ? data.recipeSteps.map(RecipeStep.create)
        : undefined,
      tags: data.recipeTags
        ? data.recipeTags.map(RecipeTag.create)
        : undefined,
      briefings: data.recipeBriefing
        ? data.recipeBriefing.map(RecipeBriefing.create)
        : undefined,
    });
  }
}

export const useFetchRecipe = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["recipe", id],
    queryFn: () => fetchRecipe(id),
    select: (res)=>{
        return Recipe.create(res);
    },
  });
  return { data, isLoading, error };
};


import { useMutation } from "@tanstack/react-query";
import { createRecipe } from "../api/api";
import { useCallback } from "react";

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

export function useCreateRecipe() {
  const {
    mutate: createMutation,
    data,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: (youtubeUrl: string) => createRecipe(youtubeUrl),
    throwOnError: false,
  });

  const create =  useCallback(
    (youtubeUrl: string) => {
      validateUrl(youtubeUrl);
      const standardUrl = convertToStandardYouTubeUrl(youtubeUrl);
      createMutation(standardUrl);
    },
    [createMutation]
  );

  return {
    recipeId: data ?? null,
    isLoading,
    error,
    create,
    validateUrl,
  };
}