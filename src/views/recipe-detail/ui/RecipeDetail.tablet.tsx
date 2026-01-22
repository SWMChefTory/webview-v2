import { Skeleton } from "@/components/ui/skeleton";
import { useFetchRecipe } from "@/src/entities/recipe/model/useRecipe";
import { useSafeArea } from "@/src/shared/safearea/useSafaArea";
import Header, { BackButton } from "@/src/shared/ui/header/header";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { IngredientPurchaseModal } from "./IngredientPurchaseModal";
import { MeasurementOverlay } from "./MeasurementOverlay";
import { TimerButton } from "./timerButton";
import { useLangcode } from "@/src/shared/translation/useLangCode";
import { useRecipeDetailTranslation } from "@/src/views/recipe-detail/hooks/useRecipeDetailTranslation";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";

export const RecipeDetailPageSkeletonTablet = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-[1200px] lg:max-w-[1400px] xl:max-w-[1600px] mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Skeleton className="w-full aspect-video rounded-xl lg:col-span-7 xl:col-span-8" />
        <div className="space-y-4 lg:col-span-5 xl:col-span-4">
          <Skeleton className="w-2/3 h-8" />
          <Skeleton className="w-1/2 h-6" />
          <div className="space-y-3 mt-6">
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-12" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const RecipeDetailPageReadyTablet = ({ id }: { id: string }) => {
  const { data } = useFetchRecipe(id);
  const router = useRouter();

  const videoInfo = data?.videoInfo ?? {};
  const recipeSummary = data?.detailMeta ?? {};
  const ingredients = data?.ingredients ?? [];
  const steps = data?.steps ?? [];
  const tags = data?.tags ?? [];
  const briefings = data?.briefings ?? [];

  const playerRef = useRef<YT.Player | null>(null);
  const pageStartTime = useRef(Date.now());
  const tabSwitchCount = useRef(0);
  const currentTab = useRef<"summary" | "recipe" | "ingredients">("summary");
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
      has_video: !!videoInfo?.id,
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

  useSafeArea({
    top: { color: "#F9FAFB", isExists: true },
    bottom: { color: "#F9FAFB", isExists: true },
    left: { color: "#F9FAFB", isExists: true },
    right: { color: "#F9FAFB", isExists: true },
  });

  const handleTimeClick = (sec: number) => {
    const t = Math.max(0, sec - 1.5);
    const p = playerRef.current;
    if (!p) return;
    try {
      p.seekTo(t, true);
      if (typeof p.playVideo === "function") p.playVideo();
    } catch {}
  };

  const handleTabClick = (tabName: "summary" | "recipe" | "ingredients") => {
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

  const handleStepClick = (
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

  const handleTimerClick = () => {
    track(AMPLITUDE_EVENT.RECIPE_DETAIL_FEATURE_CLICK, {
      recipe_id: id,
      feature_type: "timer",
      current_tab: currentTab.current,
    });
  };

  const handleMeasurementClick = () => {
    track(AMPLITUDE_EVENT.RECIPE_DETAIL_FEATURE_CLICK, {
      recipe_id: id,
      feature_type: "measurement",
      current_tab: currentTab.current,
    });
  };

  const handleCookingStart = (selectedIngredientCount: number) => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-[1200px] lg:max-w-[1400px] xl:max-w-[1600px] mx-auto">
          <Header
            leftContent={
              <div className="z-1">
                <BackButton onClick={() => router.back()} />
              </div>
            }
            centerContent={
              <div
                className="text-xl font-semibold text-center overflow-hidden text-ellipsis whitespace-nowrap max-w-[600px]"
                title={videoInfo?.videoTitle}
              >
                {videoInfo?.videoTitle}
              </div>
            }
            rightContent={
              <TimerButton
                recipeId={id}
                recipeName={videoInfo?.videoTitle}
                onTimerClick={handleTimerClick}
              />
            }
          />
        </div>
      </div>

      <div className="max-w-[1200px] lg:max-w-[1400px] xl:max-w-[1600px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <div className="sticky top-24">
              <VideoPlayer
                videoId={videoInfo?.id}
                title={videoInfo?.videoTitle}
                onPlayerReady={(p) => (playerRef.current = p)}
              />
            </div>
          </div>

          <div className="lg:col-span-5 xl:col-span-4">
            <RecipeContentTablet
              steps={steps}
              ingredients={ingredients}
              onTimeClick={handleTimeClick}
              handleRouteToStep={() => router.push(`/recipe/${id}/step`)}
              recipe_summary={recipeSummary}
              tags={tags}
              briefings={briefings}
              recipeId={id}
              onTabClick={handleTabClick}
              onStepClick={handleStepClick}
              onMeasurementClick={handleMeasurementClick}
              onCookingStart={handleCookingStart}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ReactYouTube = dynamic(() => import("react-youtube"), { ssr: false });

const VideoPlayer = ({
  videoId,
  title,
  onPlayerReady,
}: {
  videoId?: string;
  title?: string;
  onPlayerReady?: (p: YT.Player) => void;
}) => {
  const ytRef = useRef<YT.Player | null>(null);

  const opts = useMemo(
    () => ({
      width: "100%",
      height: "100%",
      playerVars: { autoplay: 0 },
    }),
    []
  );

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
      {videoId ? (
        <ReactYouTube
          videoId={videoId}
          opts={opts}
          onReady={(e) => {
            ytRef.current = e.target;
            onPlayerReady?.(e.target);
          }}
          iframeClassName="absolute top-0 left-0 w-full h-full border-0"
          title={`${title ?? ""} 동영상`}
        />
      ) : (
        <div className="w-full h-full bg-gray-100" />
      )}
    </div>
  );
};

type Ingredient = { name: string; amount?: number; unit?: string };
type StepDetail = { text: string; start: number };
type RecipeStep = {
  id: string;
  stepOrder: number;
  subtitle: string;
  details: StepDetail[];
};
type RecipeTag = { name: string };
type RecipeBriefing = { content: string };
type RecipeMeta = {
  description?: string;
  servings?: number;
  cookTime?: number;
};

const RecipeContentTablet = ({
  steps,
  ingredients,
  onTimeClick,
  handleRouteToStep,
  recipe_summary,
  tags = [],
  briefings = [],
  recipeId,
  onTabClick,
  onStepClick,
  onMeasurementClick,
  onCookingStart,
}: {
  steps: RecipeStep[];
  ingredients: Ingredient[];
  onTimeClick: (time: number) => void;
  handleRouteToStep: () => void;
  recipe_summary: RecipeMeta;
  tags?: RecipeTag[];
  briefings?: RecipeBriefing[];
  recipeId: string;
  onTabClick?: (tabName: "summary" | "recipe" | "ingredients") => void;
  onStepClick?: (stepOrder: number, stepTitle: string, videoTime: number, detailIndex: number) => void;
  onMeasurementClick?: () => void;
  onCookingStart?: (selectedIngredientCount: number) => void;
}) => {
  const [activeTab, setActiveTab] = useState<"summary" | "recipe" | "ingredients">("summary");
  const [expanded, setExpanded] = useState<Set<number>>(new Set(steps.map((_, idx) => idx)));
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [measurementOpen, setMeasurementOpen] = useState(false);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);

  const lang = useLangcode();
  const { t } = useRecipeDetailTranslation();

  const formatTime = (min: number) => {
    const h = Math.floor(min / 60);
    const m = min % 60;

    if (lang === 'ko') {
      if (h > 0) {
        const r5 = m > 0 ? Math.ceil(m / 5) * 5 : 0;
        return r5
          ? t('summary.timeHourMinute', { hours: h, minutes: r5 })
          : t('summary.timeHour', { hours: h });
      }
      const rounded = Math.max(5, Math.ceil(min / 5) * 5);
      return t('summary.timeMinute', { minutes: rounded });
    } else {
      if (h > 0) {
        return m > 0
          ? t('summary.timeHourMinute', { hours: h, minutes: m })
          : t('summary.timeHour', { hours: h });
      }
      return t('summary.timeMinute', { minutes: min });
    }
  };

  const cookTime = recipe_summary?.cookTime ?? 0;
  const description = recipe_summary?.description ?? "";
  const servings = Math.max(0, Number(recipe_summary?.servings ?? 0));
  const allSel = selected.size === ingredients.length;

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {(["summary", "recipe", "ingredients"] as const).map((tab) => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                className={`flex-1 py-4 text-lg font-semibold transition-colors relative ${
                  active ? "text-neutral-900" : "text-gray-400 hover:text-gray-600"
                }`}
                onClick={() => {
                  setActiveTab(tab);
                  if (tab === "recipe") {
                    setExpanded(new Set(steps.map((_, idx) => idx)));
                  }
                  onTabClick?.(tab);
                }}
              >
                {t(`tabs.${tab}`)}
                {active && (
                  <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-orange-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        <div className="p-6 max-h-[calc(100vh-300px)] overflow-y-auto">
          {activeTab === "summary" && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 p-4 rounded-xl border border-orange-200 bg-orange-50">
                <svg className="w-5 h-5 text-orange-500 shrink-0" viewBox="0 0 24 24" fill="none">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} stroke="currentColor" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-gray-600">{t("summary.aiWarning")}</span>
              </div>

              {(!!description || cookTime > 0 || servings > 0 || (tags?.length ?? 0) > 0) && (
                <section className="p-5 rounded-xl border border-gray-200 bg-gray-50/50">
                  {!!description && (
                    <p className="text-base leading-7 text-neutral-900">{description}</p>
                  )}

                  {(cookTime > 0 || servings > 0) && (
                    <div className="flex flex-wrap gap-3 mt-4">
                      {cookTime > 0 && (
                        <span className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-700 shadow-sm">
                          ⏱ {formatTime(cookTime)}
                        </span>
                      )}
                      {servings > 0 && (
                        <span className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-700 shadow-sm">
                          {t("summary.servings", { count: servings })}
                        </span>
                      )}
                    </div>
                  )}

                  {(tags?.length ?? 0) > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {tags!.map((t, i) => {
                        const name = t?.name ?? "";
                        if (!name) return null;
                        return (
                          <span key={`${name}-${i}`} className="inline-flex items-center px-3 py-1.5 rounded-full bg-orange-50 text-sm font-medium text-orange-600">
                            #{name}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </section>
              )}

              {Array.isArray(briefings) && briefings.length > 0 && (
                <section className="p-5 rounded-xl border border-gray-200 bg-gray-50/50">
                  <h4 className="text-lg font-bold text-neutral-900 mb-4">{t("summary.reviews")}</h4>
                  <p className="text-sm text-gray-500 mb-4 flex gap-2 items-center">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} stroke="currentColor" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t("summary.reviewSource")}
                  </p>
                  <ul className="flex flex-col gap-3">
                    {briefings.map((b, i) => {
                      const text = b?.content ?? "";
                      if (!text) return null;
                      return (
                        <li key={`${i}-${text.slice(0, 12)}`} className="flex gap-3 items-start">
                          <span className="w-2 h-2 mt-2 rounded-full bg-orange-500 shrink-0" />
                          <span className="text-base leading-7 text-neutral-900">{text}</span>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}
            </div>
          )}

          {activeTab === "recipe" && (
            <div className="flex flex-col gap-6">
              {steps.map((step, idx) => (
                <div key={step.id} className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                  <div
                    className="flex items-center gap-4 cursor-pointer select-none"
                    onClick={() =>
                      setExpanded((prev) => {
                        const next = new Set(prev);
                        next.has(idx) ? next.delete(idx) : next.add(idx);
                        return next;
                      })
                    }
                  >
                    <div className="w-10 h-10 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-lg">
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-neutral-900">{step.subtitle}</h3>
                    </div>
                    <svg
                      className={`w-6 h-6 transition-transform ${expanded.has(idx) ? "rotate-180" : ""}`}
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path d="M6 9L12 15L18 9" stroke="#111111" strokeWidth="2" />
                    </svg>
                  </div>

                  {expanded.has(idx) && (
                    <div className="flex flex-col gap-3 mt-4 pl-14">
                      {step.details.map((d, di) => (
                        <button
                          key={di}
                          className="w-full text-left bg-white border border-gray-200 rounded-lg px-4 py-3 hover:bg-orange-50 hover:border-orange-200 transition-all flex items-start justify-between gap-4 group"
                          onClick={() => {
                            onTimeClick(d.start);
                            onStepClick?.(step.stepOrder, step.subtitle, d.start, di);
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <span className="w-6 h-6 text-sm font-bold rounded-full bg-gray-100 group-hover:bg-orange-100 grid place-items-center shrink-0">
                              {di + 1}
                            </span>
                            <p className="text-sm leading-6 text-neutral-900">{d.text}</p>
                          </div>
                          <svg className="w-5 h-5 text-gray-400 group-hover:text-orange-500 shrink-0" viewBox="0 0 24 24" fill="none">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === "ingredients" && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="font-bold text-xl">
                  {selected.size > 0 ? (
                    <span className="text-neutral-900">
                      {t("ingredients.prepared", { count: selected.size, total: ingredients.length })}
                    </span>
                  ) : (
                    <span className="text-neutral-900">
                      {t("ingredients.all", { count: ingredients.length })}
                    </span>
                  )}
                </div>
                {lang === "ko" && (
                  <button
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors"
                    onClick={() => {
                      setMeasurementOpen(true);
                      onMeasurementClick?.();
                    }}
                  >
                    <span>{t("ingredients.measure")}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </button>
                )}
              </div>

              {lang === "ko" && (
                <div
                  className="relative overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-r from-orange-50 to-white cursor-pointer hover:shadow-md transition-all"
                  onClick={() => setPurchaseModalOpen(true)}
                >
                  <div className="flex items-center justify-between px-5 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                        <div className="text-2xl">🛒</div>
                      </div>
                      <span className="text-lg font-semibold text-neutral-900">{t("ingredients.purchase")}</span>
                    </div>
                    <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 lg:grid-cols-4 gap-3">
                {ingredients.map((ing, i) => {
                  const isSel = selected.has(i);
                  return (
                    <button
                      key={i}
                      className={`aspect-square w-full border-2 rounded-xl px-3 py-3 flex flex-col items-center justify-center gap-2 transition-all hover:shadow-md ${
                        isSel
                          ? "border-orange-500 bg-orange-50 ring-2 ring-orange-200"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                      onClick={() =>
                        setSelected((prev) => {
                          const next = new Set(prev);
                          next.has(i) ? next.delete(i) : next.add(i);
                          return next;
                        })
                      }
                    >
                      <span className={`text-center font-bold text-base leading-5 ${isSel ? "text-orange-600" : "text-neutral-900"}`}>
                        {ing.name}
                      </span>
                      {(ing.amount ?? 0) > 0 ? (
                        <span className="text-sm text-gray-600">
                          {ing.amount}{ing.unit ?? ""}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">{t("ingredients.videoRef")}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 bg-gray-50/50 p-4">
          {activeTab === "ingredients" && selected.size > 0 ? (
            <div className="flex gap-3">
              <button
                className={`flex-1 px-6 py-3.5 rounded-xl font-bold text-base border-2 transition-all ${
                  allSel
                    ? "bg-orange-500 text-white border-orange-500 hover:bg-orange-600"
                    : "bg-white text-orange-500 border-orange-500 hover:bg-orange-50"
                }`}
                onClick={() =>
                  setSelected((prev) =>
                    prev.size === ingredients.length
                      ? new Set()
                      : new Set(ingredients.map((_, idx) => idx))
                  )
                }
              >
                {allSel ? t("ingredients.deselectAll") : t("ingredients.selectAll")}
              </button>
              <button
                className={`flex-1 px-6 py-3.5 rounded-xl font-bold text-base transition-all ${
                  allSel
                    ? "bg-orange-500 text-white hover:bg-orange-600"
                    : "bg-gray-300 text-white cursor-not-allowed"
                }`}
                onClick={() => {
                  if (!allSel) return;
                  setSelected(new Set());
                  setActiveTab("recipe");
                }}
                disabled={!allSel}
              >
                {t("ingredients.ready")}
              </button>
            </div>
          ) : (
            <button
              className="w-full px-6 py-3.5 rounded-xl font-bold text-base bg-orange-500 text-white hover:bg-orange-600 active:scale-[0.99] transition-all"
              onClick={() => {
                if (onCookingStart) {
                  onCookingStart(selected.size);
                } else {
                  handleRouteToStep();
                }
              }}
            >
              {t("ingredients.start")}
            </button>
          )}
        </div>
      </div>

      <MeasurementOverlay open={measurementOpen} onOpenChange={setMeasurementOpen} />
      <IngredientPurchaseModal
        open={purchaseModalOpen}
        onOpenChange={setPurchaseModalOpen}
        ingredients={ingredients}
        recipeId={recipeId}
      />
    </>
  );
};
