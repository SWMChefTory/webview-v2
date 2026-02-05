import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useFetchRecipe } from "@/src/entities/recipe/model/useRecipe";
import { useSafeArea } from "@/src/shared/safearea/useSafaArea";
import { useLangcode } from "@/src/shared/translation/useLangCode";
import { useRecipeDetailTranslation } from "@/src/views/recipe-detail/hooks/useRecipeDetailTranslation";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { type ViewStatus } from "@/src/entities/recipe";

export type RecipeDetailVariant = "mobile" | "tablet" | "desktop";
export type TabName = "summary" | "recipe" | "ingredients";

export type Ingredient = { name: string; amount?: number; unit?: string };
export type StepDetail = { text: string; start: number };
export type RecipeStep = {
  id: string;
  stepOrder: number;
  subtitle: string;
  details: StepDetail[];
};
export type RecipeTag = { name: string };
export type RecipeBriefing = { content: string };
export type RecipeMeta = {
  description?: string;
  servings?: number;
  cookingTime?: number;
};

export interface RecipeDetailControllerProps {
  videoInfo: { videoId?: string; videoTitle?: string };
  recipeSummary: RecipeMeta;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  tags: RecipeTag[];
  briefings: RecipeBriefing[];
  viewStatus: ViewStatus | null;
  onBack: () => void;
  onCookingStart: (selectedIngredientCount: number) => void;
  routeToStep: () => void;
  onTimeClick: (sec: number, playerRef: React.RefObject<YT.Player | null>) => void;
  onTabClick: (tabName: TabName) => void;
  onStepClick: (stepOrder: number, stepTitle: string, videoTime: number, detailIndex: number) => void;
  onTimerClick: () => void;
  onMeasurementClick: () => void;
  t: (key: string, options?: Record<string, unknown>) => string;
  lang: string;
  formatTime: (min: number) => string;
}

export function useRecipeDetailController(
  id: string,
  variant: RecipeDetailVariant
): RecipeDetailControllerProps {
  const { data } = useFetchRecipe(id);
  const router = useRouter();
  const lang = useLangcode();
  const { t } = useRecipeDetailTranslation();

  const safeAreaColor = variant === "mobile" ? "#FFFFFF" : "#F9FAFB";
  useSafeArea({
    top: { color: safeAreaColor, isExists: true },
    bottom: { color: safeAreaColor, isExists: true },
    left: { color: safeAreaColor, isExists: true },
    right: { color: safeAreaColor, isExists: true },
  });
  const videoInfo = data?.videoInfo ?? {};
  const recipeSummary = data?.recipeDetailMeta ?? {};
  const ingredients = data?.recipeIngredient ?? [];
  const steps = data?.recipeSteps ?? [];
  const tags = data?.recipeTags ?? [];
  const briefings = data?.recipeBriefings ?? [];
  const viewStatus = data.viewStatus === undefined ? null : data.viewStatus;

  const pageStartTime = useRef(Date.now());
  const tabSwitchCount = useRef(0);
  const currentTab = useRef<TabName>("summary");
  const reachedCookingStart = useRef(false);

  useEffect(() => {
    const key = `recipe_${id}_last_view`;
    const lastView = sessionStorage.getItem(key);
    let isFirstView = true;

    if (lastView) {
      const elapsed = Date.now() - Number(lastView);
      const ONE_HOUR = 60 * 60 * 1000;
      isFirstView = elapsed > ONE_HOUR;
    }

    sessionStorage.setItem(key, Date.now().toString());

    const totalDetails = steps.reduce(
      (sum, step) => sum + (step.details?.length ?? 0),
      0
    );

    track(AMPLITUDE_EVENT.RECIPE_DETAIL_VIEW, {
      recipe_id: id,
      recipe_title: videoInfo?.videoTitle || "",
      is_first_view: isFirstView,
      total_steps: steps.length,
      total_details: totalDetails,
      total_ingredients: ingredients.length,
      has_video: !!videoInfo?.videoId,
    });

    return () => {
      track(AMPLITUDE_EVENT.RECIPE_DETAIL_EXIT, {
        recipe_id: id,
        stay_duration: Math.round((Date.now() - pageStartTime.current) / 1000),
        tab_switch_count: tabSwitchCount.current,
        final_tab: currentTab.current,
        reached_cooking_start: reachedCookingStart.current,
      });
    };
  }, []);

  const formatTime = (min: number): string => {
    const h = Math.floor(min / 60);
    const m = min % 60;

    if (lang === "ko") {
      if (h > 0) {
        const r5 = m > 0 ? Math.ceil(m / 5) * 5 : 0;
        return r5
          ? t("summary.timeHourMinute", { hours: h, minutes: r5 })
          : t("summary.timeHour", { hours: h });
      }
      const rounded = Math.max(5, Math.ceil(min / 5) * 5);
      return t("summary.timeMinute", { minutes: rounded });
    } else {
      if (h > 0) {
        return m > 0
          ? t("summary.timeHourMinute", { hours: h, minutes: m })
          : t("summary.timeHour", { hours: h });
      }
      return t("summary.timeMinute", { minutes: min });
    }
  };

  const onTimeClick = (sec: number, playerRef: React.RefObject<YT.Player | null>) => {
    const time = Math.max(0, sec - 1.5);
    const player = playerRef.current;
    if (!player) return;
    try {
      player.seekTo(time, true);
      if (typeof player.playVideo === "function") player.playVideo();
    } catch {}
  };

  const onTabClick = (tabName: TabName) => {
    if (currentTab.current !== tabName) {
      tabSwitchCount.current++;
    }
    currentTab.current = tabName;

    track(AMPLITUDE_EVENT.RECIPE_DETAIL_TAB_CLICK, {
      recipe_id: id,
      tab_name: tabName,
      time_since_view: Math.round((Date.now() - pageStartTime.current) / 1000),
    });
  };

  const onStepClick = (
    stepOrder: number,
    stepTitle: string,
    videoTime: number,
    detailIndex: number
  ) => {
    track(AMPLITUDE_EVENT.RECIPE_DETAIL_VIDEO_SEEK, {
      recipe_id: id,
      step_order: stepOrder,
      step_title: stepTitle,
      video_time: videoTime,
      detail_index: detailIndex,
    });
  };

  const onTimerClick = () => {
    track(AMPLITUDE_EVENT.RECIPE_DETAIL_FEATURE_CLICK, {
      recipe_id: id,
      feature_type: "timer",
      current_tab: currentTab.current,
    });
  };

  const onMeasurementClick = () => {
    track(AMPLITUDE_EVENT.RECIPE_DETAIL_FEATURE_CLICK, {
      recipe_id: id,
      feature_type: "measurement",
      current_tab: currentTab.current,
    });
  };

  const onCookingStart = (selectedIngredientCount: number) => {
    if (reachedCookingStart.current) return;
    reachedCookingStart.current = true;

    track(AMPLITUDE_EVENT.RECIPE_DETAIL_COOKING_START, {
      recipe_id: id,
      time_to_start: Math.round((Date.now() - pageStartTime.current) / 1000),
      tab_switch_count: tabSwitchCount.current,
      ingredient_prepared_count: selectedIngredientCount,
    });

    router.push(`/recipe/${id}/step`);
  };

  return {
    videoInfo,
    recipeSummary,
    ingredients,
    steps,
    tags,
    briefings,
    viewStatus,
    onBack: () => router.back(),
    onCookingStart,
    routeToStep: () => router.push(`/recipe/${id}/step`),
    onTimeClick,
    onTabClick,
    onStepClick,
    onTimerClick,
    onMeasurementClick,
    t,
    lang,
    formatTime,
  };
}
