import { Skeleton } from "@/components/ui/skeleton";
import Header, { BackButton } from "@/src/shared/ui/header/header";
import dynamic from "next/dynamic";
import { useMemo, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Image from "next/image";
import { SectionFallback } from "../index";
import { useFetchBalance } from "@/src/entities/balance";
import { useEnrollBookmark } from "@/src/entities/user-recipe/model/useBookmark";
import { type ViewStatus } from "@/src/entities/recipe";
import { IngredientPurchaseModal } from "../common/component/IngredientPurchaseModal";
import { MeasurementOverlay } from "../common/component/MeasurementOverlay";
import { TimerButton } from "../common/component/TimerButton";
import {
  useRecipeDetailController,
  type TabName,
  type Ingredient,
  type RecipeStep,
  type RecipeTag,
  type RecipeBriefing,
  type RecipeMeta,
} from "../common/hook/useRecipeDetailController";

export const RecipeDetailPageSkeletonTablet = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-[1024px] mx-auto px-6 py-8">
      <div className="space-y-6">
        <Skeleton className="w-full aspect-video rounded-xl" />
        <div className="space-y-4">
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
  const {
    videoInfo,
    recipeSummary,
    ingredients,
    steps,
    tags,
    briefings,
    viewStatus,
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
  } = useRecipeDetailController(id, "tablet");

  const playerRef = useRef<YT.Player | null>(null);

  const handleTimeClick = (sec: number) => {
    onTimeClick(sec, playerRef);
  };

  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <SectionFallback error={error} resetErrorBoundary={resetErrorBoundary} recipeId={id} />
      )}
    >
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-50 bg-white border-b border-gray-100">
          <div className="max-w-[1024px] mx-auto">
            <Header
              leftContent={
                <div className="z-1">
                  <BackButton onClick={onBack} />
                </div>
              }
              centerContent={
                <div
                  className="text-xl font-semibold text-center overflow-hidden text-ellipsis whitespace-nowrap max-w-[500px]"
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

        <div className="max-w-[1024px] mx-auto px-8 py-10">
          <div className="flex flex-col gap-10">
            <div className="w-full">
              <VideoPlayer
                videoId={videoInfo?.videoId}
                title={videoInfo?.videoTitle}
                onPlayerReady={(p) => (playerRef.current = p)}
              />
            </div>

            <div className="w-full">
              <RecipeContentTablet
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
                viewStatus={viewStatus}
                t={t}
                lang={lang}
                formatTime={formatTime}
              />
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
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
  viewStatus,
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
  viewStatus?: ViewStatus | null;
  t: (key: string, options?: Record<string, unknown>) => string;
  lang: string;
  formatTime: (min: number) => string;
}) => {
  const { enrollBookmark, isLoading: isEnrollingBookmark } = useEnrollBookmark();
  const { data: balanceData } = useFetchBalance();
  const balance = balanceData?.balance ?? 0;
  const isEnrolled = viewStatus !== null;

  const [activeTab, setActiveTab] = useState<TabName>("summary");
  const [expanded, setExpanded] = useState<Set<number>>(new Set(steps.map((_, idx) => idx)));
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [measurementOpen, setMeasurementOpen] = useState(false);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);

  const cookTime = recipe_summary?.cookingTime ?? 0;
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
                className={`flex-1 py-6 text-xl font-bold transition-colors relative ${
                  active ? "text-neutral-900" : "text-gray-400 active:text-gray-600 hover:text-gray-500"
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
                  <div className="absolute bottom-0 left-6 right-6 h-1 bg-orange-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        <div className="p-8">
          {activeTab === "summary" && (
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-4 p-5 rounded-2xl border border-orange-200 bg-orange-50">
                <svg className="w-6 h-6 text-orange-500 shrink-0" viewBox="0 0 24 24" fill="none">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} stroke="currentColor" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-base font-medium text-gray-700">{t("summary.aiWarning")}</span>
              </div>

              {(!!description || cookTime > 0 || servings > 0 || (tags?.length ?? 0) > 0) && (
                <section className="p-8 rounded-2xl border border-gray-200 bg-gray-50/50">
                  {!!description && (
                    <p className="text-lg leading-8 text-neutral-900">{description}</p>
                  )}

                  {(cookTime > 0 || servings > 0) && (
                    <div className="flex flex-wrap gap-4 mt-6">
                      {cookTime > 0 && (
                        <span className="inline-flex items-center px-5 py-2.5 rounded-full bg-white border border-gray-200 text-base font-medium text-gray-700 shadow-sm">
                          ⏱ {formatTime(cookTime)}
                        </span>
                      )}
                      {servings > 0 && (
                        <span className="inline-flex items-center px-5 py-2.5 rounded-full bg-white border border-gray-200 text-base font-medium text-gray-700 shadow-sm">
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
                          <span key={`${name}-${i}`} className="inline-flex items-center px-4 py-2 rounded-full bg-orange-50 text-base font-medium text-orange-600">
                            #{name}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </section>
              )}

              {Array.isArray(briefings) && briefings.length > 0 && (
                <section className="p-8 rounded-2xl border border-gray-200 bg-gray-50/50">
                  <h4 className="text-xl font-bold text-neutral-900 mb-6">{t("summary.reviews")}</h4>
                  <p className="text-base text-gray-500 mb-6 flex gap-2 items-center">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
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
                          <span className="w-2.5 h-2.5 mt-2.5 rounded-full bg-orange-500 shrink-0" />
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
            <div className="relative">
              {!isEnrolled && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-t from-amber-100/95 via-amber-50/80 to-white/60 backdrop-blur-[2px] rounded-2xl">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-[100px] h-[90px]">
                      <Image
                        src="/images/tory/polite-tory.png"
                        alt="Tory"
                        width={100}
                        height={90}
                        className="object-cover object-center"
                      />
                    </div>
                    <div className="text-center space-y-1.5">
                      <p className="text-lg font-bold text-gray-900">{t("lock.berryPrompt1")}</p>
                      <p className="text-lg font-bold text-gray-900">{t("lock.berryPrompt2")}</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-4 py-2 bg-white/80 rounded-full border border-orange-200">
                      <Image src="/images/berry/berry.png" alt="Berry" width={18} height={22} />
                      <span className="text-sm text-gray-600 font-medium">{t("lock.currentBerry", { count: balance })}</span>
                    </div>
                    <button
                      className="mt-2 px-8 py-3 bg-orange-500 rounded-2xl text-white font-bold text-lg shadow-lg shadow-orange-200/50 active:scale-[0.97] transition-transform disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      onClick={() => { if (!isEnrollingBookmark) enrollBookmark(recipeId); }}
                      disabled={isEnrollingBookmark}
                    >
                      {isEnrollingBookmark ? t("lock.loading") : t("lock.viewRecipe")}
                    </button>
                  </div>
                </div>
              )}
              <div className={`flex flex-col gap-6 ${!isEnrolled ? 'max-h-[400px] overflow-hidden' : ''}`}>
                {(isEnrolled ? steps : steps.slice(0, 2)).map((step, idx) => (
                  <div key={step.id} className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                    <div
                      className="flex items-center gap-6 cursor-pointer select-none active:opacity-70"
                      onClick={() =>
                        setExpanded((prev) => {
                          const next = new Set(prev);
                          if (next.has(idx)) {
                            next.delete(idx);
                          } else {
                            next.add(idx);
                          }
                          return next;
                        })
                      }
                    >
                      <div className="w-12 h-12 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-xl shadow-sm">
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-neutral-900">{step.subtitle}</h3>
                      </div>
                      <svg
                        className={`w-8 h-8 transition-transform ${expanded.has(idx) ? "rotate-180" : ""}`}
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path d="M6 9L12 15L18 9" stroke="#111111" strokeWidth="2.5" />
                      </svg>
                    </div>

                    {expanded.has(idx) && (
                      <div className="flex flex-col gap-4 mt-6 pl-18">
                        {step.details.map((d, di) => (
                          <button
                            key={di}
                            className="w-full text-left bg-white border border-gray-200 rounded-xl px-6 py-5 active:bg-orange-50 active:border-orange-200 transition-all flex items-start justify-between gap-6 shadow-sm hover:border-orange-200 group"
                            onClick={() => {
                              onTimeClick(d.start);
                              onStepClick?.(step.stepOrder, step.subtitle, d.start, di);
                            }}
                          >
                            <div className="flex items-start gap-4">
                              <span className="w-7 h-7 text-sm font-bold rounded-full bg-gray-100 grid place-items-center shrink-0 group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                                {di + 1}
                              </span>
                              <p className="text-lg leading-7 text-neutral-900">{d.text}</p>
                            </div>
                            <svg className="w-6 h-6 text-gray-400 shrink-0 group-hover:text-orange-400 transition-colors" viewBox="0 0 24 24" fill="none">
                              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" />
                            </svg>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "ingredients" && (
            <div className="flex flex-col gap-8">
              <div className="flex items-center justify-between">
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
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-100 active:bg-gray-200 text-gray-700 text-base font-medium transition-colors hover:bg-gray-200"
                    onClick={() => {
                      setMeasurementOpen(true);
                      onMeasurementClick?.();
                    }}
                  >
                    <span>{t("ingredients.measure")}</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </button>
                )}
              </div>

              {lang === "ko" && (
                <div
                  className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-r from-orange-50 to-white cursor-pointer active:scale-[0.99] transition-all hover:shadow-md"
                  onClick={() => setPurchaseModalOpen(true)}
                >
                  <div className="flex items-center justify-between px-6 py-5">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-sm text-3xl">
                        🛒
                      </div>
                      <span className="text-xl font-bold text-neutral-900">{t("ingredients.purchase")}</span>
                    </div>
                    <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {ingredients.map((ing, i) => {
                  const isSel = selected.has(i);
                  return (
                    <button
                      key={i}
                      className={`aspect-square w-full border-2 rounded-2xl px-4 py-4 flex flex-col items-center justify-center gap-3 transition-all active:scale-95 ${
                        isSel
                          ? "border-orange-500 bg-orange-50 ring-4 ring-orange-100"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                      }`}
                      onClick={() =>
                        setSelected((prev) => {
                          const next = new Set(prev);
                          if (next.has(i)) {
                            next.delete(i);
                          } else {
                            next.add(i);
                          }
                          return next;
                        })
                      }
                    >
                      <span className={`text-center font-bold text-lg leading-tight line-clamp-2 ${isSel ? "text-orange-600" : "text-neutral-900"}`}>
                        {ing.name}
                      </span>
                      {(ing.amount ?? 0) > 0 ? (
                        <span className="text-base text-gray-600 font-medium">
                          {ing.amount}{ing.unit ?? ""}
                        </span>
                      ) : (
                        <span className="text-base text-gray-500">{t("ingredients.videoRef")}</span>
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
                className={`flex-1 px-8 py-4 rounded-xl font-bold text-lg border-2 transition-all active:scale-[0.98] ${
                  allSel
                    ? "bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-200"
                    : "bg-white text-orange-500 border-orange-500"
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
                className={`flex-1 px-8 py-4 rounded-xl font-bold text-lg transition-all active:scale-[0.98] ${
                  allSel
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
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
              className="w-full px-8 py-4 rounded-xl font-bold text-lg bg-orange-500 text-white active:scale-[0.99] transition-all shadow-lg shadow-orange-200 hover:bg-orange-600"
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
