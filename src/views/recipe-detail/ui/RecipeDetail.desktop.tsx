import { Skeleton } from "@/components/ui/skeleton";
import Header, { BackButton } from "@/src/shared/ui/header/header";
import dynamic from "next/dynamic";
import { useMemo, useRef, useState } from "react";
import { IngredientPurchaseModal } from "./IngredientPurchaseModal";
import { MeasurementOverlay } from "./MeasurementOverlay";
import { TimerButton } from "./timerButton";
import {
  useRecipeDetailController,
  type TabName,
  type Ingredient,
  type RecipeStep,
  type RecipeTag,
  type RecipeBriefing,
  type RecipeMeta,
} from "./RecipeDetail.controller";

export const RecipeDetailPageSkeletonDesktop = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-[1600px] mx-auto px-8 py-10">
      <div className="grid grid-cols-12 gap-10">
        <Skeleton className="w-full aspect-video rounded-2xl col-span-8" />
        <div className="space-y-6 col-span-4">
          <Skeleton className="w-2/3 h-10" />
          <Skeleton className="w-1/2 h-7" />
          <div className="space-y-4 mt-8">
            <Skeleton className="w-full h-16" />
            <Skeleton className="w-full h-16" />
            <Skeleton className="w-full h-16" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const RecipeDetailPageReadyDesktop = ({ id }: { id: string }) => {
  const {
    videoInfo,
    recipeSummary,
    ingredients,
    steps,
    tags,
    briefings,
    onBack,
    onCookingStart,
    routeToStep,
    onTimeClick,
    onTabClick,
    onStepClick,
    onTimerClick,
    onMeasurementClick,
    t,
    lang,
    formatTime,
  } = useRecipeDetailController(id, "desktop");

  const playerRef = useRef<YT.Player | null>(null);

  const handleTimeClick = (sec: number) => {
    onTimeClick(sec, playerRef);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-8">
          <Header
            leftContent={
              <div className="z-1">
                <BackButton onClick={onBack} />
              </div>
            }
            centerContent={
              <div
                className="text-xl font-bold text-center overflow-hidden text-ellipsis whitespace-nowrap max-w-[800px]"
                title={videoInfo?.videoTitle}
              >
                {videoInfo?.videoTitle}
              </div>
            }
            rightContent={
              <TimerButton
                recipeId={id}
                recipeName={videoInfo?.videoTitle ?? ""}
                onTimerClick={onTimerClick}
              />
            }
          />
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-8 py-12 lg:py-16">
        <div className="grid grid-cols-12 gap-10 lg:gap-14">
          <div className="col-span-8 space-y-8">
            <div className="sticky top-28 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5">
              <VideoPlayer
                videoId={videoInfo?.id}
                title={videoInfo?.videoTitle}
                onPlayerReady={(p) => (playerRef.current = p)}
              />
            </div>
          </div>

          <div className="col-span-4">
            <RecipeContentDesktop
              steps={steps}
              ingredients={ingredients}
              onTimeClick={handleTimeClick}
              handleRouteToStep={routeToStep}
              recipe_summary={recipeSummary}
              tags={tags}
              briefings={briefings}
              recipeId={id}
              onTabClick={onTabClick}
              onStepClick={onStepClick}
              onMeasurementClick={onMeasurementClick}
              onCookingStart={onCookingStart}
              t={t}
              lang={lang}
              formatTime={formatTime}
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
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden">
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

const RecipeContentDesktop = ({
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
  t,
  lang,
  formatTime,
}: {
  steps: RecipeStep[];
  ingredients: Ingredient[];
  onTimeClick: (time: number) => void;
  handleRouteToStep: () => void;
  recipe_summary: RecipeMeta;
  tags?: RecipeTag[];
  briefings?: RecipeBriefing[];
  recipeId: string;
  onTabClick?: (tabName: TabName) => void;
  onStepClick?: (stepOrder: number, stepTitle: string, videoTime: number, detailIndex: number) => void;
  onMeasurementClick?: () => void;
  onCookingStart?: (selectedIngredientCount: number) => void;
  t: (key: string, options?: Record<string, unknown>) => string;
  lang: string;
  formatTime: (min: number) => string;
}) => {
  const [activeTab, setActiveTab] = useState<TabName>("summary");
  const [expanded, setExpanded] = useState<Set<number>>(new Set(steps.map((_, idx) => idx)));
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [measurementOpen, setMeasurementOpen] = useState(false);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);

  const cookTime = recipe_summary?.cookTime ?? 0;
  const description = recipe_summary?.description ?? "";
  const servings = Math.max(0, Number(recipe_summary?.servings ?? 0));
  const allSel = selected.size === ingredients.length;

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {(["summary", "recipe", "ingredients"] as const).map((tab) => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                className={`flex-1 py-5 text-lg font-bold transition-all relative ${
                  active ? "text-neutral-900 bg-gray-50/50" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50/30"
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
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
                )}
              </button>
            );
          })}
        </div>

        <div className="p-8 max-h-[calc(100vh-320px)] min-h-[400px] overflow-y-auto custom-scrollbar">
          {activeTab === "summary" && (
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-4 p-5 rounded-xl border border-orange-200 bg-orange-50/50">
                <svg className="w-6 h-6 text-orange-500 shrink-0" viewBox="0 0 24 24" fill="none">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} stroke="currentColor" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-base text-gray-700 font-medium">{t("summary.aiWarning")}</span>
              </div>

              {(!!description || cookTime > 0 || servings > 0 || (tags?.length ?? 0) > 0) && (
                <section className="p-6 rounded-2xl border border-gray-200 bg-gray-50/30 hover:border-gray-300 transition-colors">
                  {!!description && (
                    <p className="text-lg leading-8 text-neutral-900">{description}</p>
                  )}

                  {(cookTime > 0 || servings > 0) && (
                    <div className="flex flex-wrap gap-4 mt-6">
                      {cookTime > 0 && (
                        <span className="inline-flex items-center px-5 py-2.5 rounded-full bg-white border border-gray-200 text-base font-semibold text-gray-700 shadow-sm hover:shadow transition-shadow cursor-default">
                          ⏱ {formatTime(cookTime)}
                        </span>
                      )}
                      {servings > 0 && (
                        <span className="inline-flex items-center px-5 py-2.5 rounded-full bg-white border border-gray-200 text-base font-semibold text-gray-700 shadow-sm hover:shadow transition-shadow cursor-default">
                          {t("summary.servings", { count: servings })}
                        </span>
                      )}
                    </div>
                  )}

                  {(tags?.length ?? 0) > 0 && (
                    <div className="flex flex-wrap gap-3 mt-6">
                      {tags!.map((tag, i) => {
                        const name = tag?.name ?? "";
                        if (!name) return null;
                        return (
                          <span key={`${name}-${i}`} className="inline-flex items-center px-4 py-2 rounded-full bg-orange-50 text-base font-semibold text-orange-600 hover:bg-orange-100 transition-colors cursor-pointer">
                            #{name}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </section>
              )}

              {Array.isArray(briefings) && briefings.length > 0 && (
                <section className="p-6 rounded-2xl border border-gray-200 bg-gray-50/30 hover:border-gray-300 transition-colors">
                  <h4 className="text-xl font-bold text-neutral-900 mb-5">{t("summary.reviews")}</h4>
                  <p className="text-sm text-gray-500 mb-5 flex gap-2 items-center">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} stroke="currentColor" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t("summary.reviewSource")}
                  </p>
                  <ul className="flex flex-col gap-4">
                    {briefings.map((b, i) => {
                      const text = b?.content ?? "";
                      if (!text) return null;
                      return (
                        <li key={`${i}-${text.slice(0, 12)}`} className="flex gap-4 items-start">
                          <span className="w-2.5 h-2.5 mt-2.5 rounded-full bg-orange-500 shrink-0 shadow-sm" />
                          <span className="text-lg leading-8 text-neutral-900">{text}</span>
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
                <div key={step.id} className="bg-gray-50/30 rounded-2xl p-5 border border-gray-200 hover:border-gray-300 transition-colors">
                  <div
                    className="flex items-center gap-5 cursor-pointer select-none group"
                    onClick={() =>
                      setExpanded((prev) => {
                        const next = new Set(prev);
                        next.has(idx) ? next.delete(idx) : next.add(idx);
                        return next;
                      })
                    }
                  >
                    <div className="w-12 h-12 rounded-xl bg-orange-500 text-white font-bold flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition-transform">
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-neutral-900 group-hover:text-orange-600 transition-colors">{step.subtitle}</h3>
                    </div>
                    <svg
                      className={`w-7 h-7 transition-transform duration-300 text-gray-400 group-hover:text-orange-500 ${expanded.has(idx) ? "rotate-180" : ""}`}
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>

                  {expanded.has(idx) && (
                    <div className="flex flex-col gap-4 mt-5 pl-16">
                      {step.details.map((d, di) => (
                        <button
                          key={di}
                          className="w-full text-left bg-white border border-gray-200 rounded-xl px-5 py-4 hover:bg-orange-50/50 hover:border-orange-200 transition-all flex items-start justify-between gap-5 group/btn shadow-sm hover:shadow-md"
                          onClick={() => {
                            onTimeClick(d.start);
                            onStepClick?.(step.stepOrder, step.subtitle, d.start, di);
                          }}
                        >
                          <div className="flex items-start gap-4">
                            <span className="w-7 h-7 text-sm font-bold rounded-full bg-gray-100 group-hover/btn:bg-orange-100 group-hover/btn:text-orange-700 grid place-items-center shrink-0 transition-colors">
                              {di + 1}
                            </span>
                            <p className="text-base leading-7 text-neutral-900">{d.text}</p>
                          </div>
                          <svg className="w-6 h-6 text-gray-300 group-hover/btn:text-orange-500 shrink-0 transition-colors" viewBox="0 0 24 24" fill="none">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
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
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-2xl">
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
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-base font-medium transition-colors"
                    onClick={() => {
                      setMeasurementOpen(true);
                      onMeasurementClick?.();
                    }}
                  >
                    <span>{t("ingredients.measure")}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}
              </div>

              {lang === "ko" && (
                <div
                  className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-r from-orange-50 to-white cursor-pointer hover:shadow-lg transition-all group"
                  onClick={() => setPurchaseModalOpen(true)}
                >
                  <div className="flex items-center justify-between px-6 py-5">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                        <div className="text-3xl">🛒</div>
                      </div>
                      <span className="text-xl font-bold text-neutral-900 group-hover:text-orange-700 transition-colors">{t("ingredients.purchase")}</span>
                    </div>
                    <svg className="w-7 h-7 text-gray-400 group-hover:text-orange-500 transition-colors" viewBox="0 0 24 24" fill="none">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                {ingredients.map((ing, i) => {
                  const isSel = selected.has(i);
                  return (
                    <button
                      key={i}
                      className={`aspect-square w-full border-2 rounded-2xl px-4 py-4 flex flex-col items-center justify-center gap-3 transition-all hover:shadow-lg hover:-translate-y-1 ${
                        isSel
                          ? "border-orange-500 bg-orange-50 ring-2 ring-orange-200/50"
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
                      <span className={`text-center font-bold text-lg leading-6 ${isSel ? "text-orange-600" : "text-neutral-900"}`}>
                        {ing.name}
                      </span>
                      {(ing.amount ?? 0) > 0 ? (
                        <span className="text-base text-gray-600 bg-gray-100/50 px-3 py-1 rounded-full">
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

        <div className="border-t border-gray-100 bg-gray-50/50 p-6">
          {activeTab === "ingredients" && selected.size > 0 ? (
            <div className="flex gap-4">
              <button
                className={`flex-1 px-8 py-4 rounded-xl font-bold text-lg border-2 transition-all ${
                  allSel
                    ? "bg-orange-500 text-white border-orange-500 hover:bg-orange-600 hover:shadow-lg"
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
                className={`flex-1 px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                  allSel
                    ? "bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg hover:-translate-y-0.5"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
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
              className="w-full px-8 py-5 rounded-2xl font-bold text-xl bg-orange-500 text-white hover:bg-orange-600 hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 shadow-lg shadow-orange-500/20"
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
