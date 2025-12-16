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
import { useLangcode, Lang } from "@/src/shared/translation/useLangCode";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";

/** ---- Skeleton ---- */
export const RecipeDetailPageSkeleton = () => (
  <div className="p-4">
    <Skeleton className="w-full h-56 mb-4" />
    <Skeleton className="w-2/3 h-6 mb-2" />
    <Skeleton className="w-1/2 h-6 mb-6" />
    <div className="space-y-2">
      <Skeleton className="w-full h-10" />
      <Skeleton className="w-full h-10" />
      <Skeleton className="w-full h-10" />
    </div>
  </div>
);

export const RecipeDetailPageReady = ({ id }: { id: string }) => {
  const { data } = useFetchRecipe(id);
  const router = useRouter();

  const videoInfo = data?.videoInfo ?? {};
  const recipeSummary = data?.detailMeta ?? {};
  const ingredients = data?.ingredients ?? [];
  const steps = data?.steps ?? [];
  const tags = data?.tags ?? [];
  const briefings = data?.briefings ?? [];

  // 높이 측정용
  const headerWrapRef = useRef<HTMLDivElement | null>(null);
  const videoWrapRef = useRef<HTMLDivElement | null>(null);

  // 시트 위치 기준값
  const [expandedTop, setExpandedTop] = useState<number>(56); // 헤더 높이
  const [collapsedTop, setCollapsedTop] = useState<number>(0); // 헤더+영상

  // YouTube 플레이어 ref
  const playerRef = useRef<YT.Player | null>(null);

  // Amplitude 추적용 refs
  const pageStartTime = useRef(Date.now());
  const tabSwitchCount = useRef(0);
  const currentTab = useRef<"summary" | "recipe" | "ingredients">("summary");
  const reachedCookingStart = useRef(false);

  // Amplitude: View/Exit 이벤트
  useEffect(() => {
    // is_first_view 판단 로직 (1시간 기준)
    const key = `recipe_${id}_last_view`;
    const lastView = sessionStorage.getItem(key);
    let isFirstView = true;

    if (lastView) {
      const elapsed = Date.now() - Number(lastView);
      const ONE_HOUR = 60 * 60 * 1000;
      isFirstView = elapsed > ONE_HOUR;
    }

    // timestamp 갱신
    sessionStorage.setItem(key, Date.now().toString());

    // View 이벤트
    track(AMPLITUDE_EVENT.RECIPE_DETAIL_VIEW, {
      recipe_id: id,
      recipe_title: videoInfo?.videoTitle || "",
      is_first_view: isFirstView,
      total_steps: steps.length,
      total_ingredients: ingredients.length,
      has_video: !!videoInfo?.id,
    });

    // Exit 이벤트 (cleanup)
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
    top: { color: "#FFFFFF", isExists: true },
    bottom: { color: "#FFFFFF", isExists: true },
    left: { color: "#FFFFFF", isExists: true },
    right: { color: "#FFFFFF", isExists: true },
  });

  useEffect(() => {
    const measure = () => {
      const headerH =
        headerWrapRef.current?.getBoundingClientRect().height ?? 56;
      const videoH =
        videoWrapRef.current?.getBoundingClientRect().height ??
        (window.innerWidth * 9) / 16;

      setExpandedTop(Math.round(headerH)); // 헤더 하단까지만 올라가도록
      setCollapsedTop(Math.round(headerH + videoH)); // 접힘 위치
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const handleTimeClick = (sec: number) => {
    const t = Math.max(0, sec - 1.5);
    const p = playerRef.current;
    if (!p) return;
    try {
      p.seekTo(t, true);
      if (typeof p.playVideo === "function") p.playVideo();
    } catch {}
  };

  // Amplitude: 탭 클릭 핸들러
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

  // Amplitude: 스텝 클릭 핸들러 (영상 시간 이동)
  const handleStepClick = (
    stepOrder: number,
    stepTitle: string,
    videoTime: number
  ) => {
    track(AMPLITUDE_EVENT.RECIPE_DETAIL_VIDEO_SEEK, {
      recipe_id: id,
      step_order: stepOrder,
      step_title: stepTitle,
      video_time: videoTime,
    });
  };

  // Amplitude: 타이머 클릭 핸들러
  const handleTimerClick = () => {
    track(AMPLITUDE_EVENT.RECIPE_DETAIL_FEATURE_CLICK, {
      recipe_id: id,
      feature_type: "timer",
      current_tab: currentTab.current,
    });
  };

  // Amplitude: 계량법 클릭 핸들러
  const handleMeasurementClick = () => {
    track(AMPLITUDE_EVENT.RECIPE_DETAIL_FEATURE_CLICK, {
      recipe_id: id,
      feature_type: "measurement",
      current_tab: currentTab.current,
    });
  };

  // Amplitude: 요리 시작 핸들러
  const handleCookingStart = (selectedIngredientCount: number) => {
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
    <div className="relative w-full h-[100dvh] overflow-hidden bg-white">
      <div ref={headerWrapRef}>
        <Header
          leftContent={
            <div className="z-1">
              <BackButton onClick={() => router.back()} />
            </div>
          }
          centerContent={
            <div
              className="
              text-xl font-semibold text-center
              overflow-hidden text-ellipsis whitespace-nowrap
              max-w-[calc(100vw-144px)] break-keep break-words
            "
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

      <StickyVideo
        videoId={videoInfo?.id}
        title={videoInfo?.videoTitle}
        containerRef={videoWrapRef as React.RefObject<HTMLDivElement>}
        onPlayerReady={(p) => (playerRef.current = p)}
      />

      <RecipeBottomSheet
        steps={steps}
        ingredients={ingredients}
        onTimeClick={handleTimeClick}
        handleRouteToStep={() => router.push(`/recipe/${id}/step`)}
        recipe_summary={recipeSummary}
        tags={tags}
        briefings={briefings}
        collapsedTopPx={collapsedTop}
        expandedTopPx={expandedTop}
        recipeId={id}
        // Amplitude 콜백
        onTabClick={handleTabClick}
        onStepClick={handleStepClick}
        onMeasurementClick={handleMeasurementClick}
        onCookingStart={handleCookingStart}
      />
    </div>
  );
};

/** ---- YouTube (react-youtube 동적 로딩) ---- */
const ReactYouTube = dynamic(() => import("react-youtube"), { ssr: false });

const StickyVideo = ({
  videoId,
  title,
  containerRef,
  onPlayerReady,
}: {
  videoId?: string;
  title?: string;
  containerRef?: React.RefObject<HTMLDivElement>;
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
    <div ref={containerRef} className="relative w-full aspect-video bg-black">
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

/** ---- Bottom Sheet ---- */
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

// 다국어 메시지 포매터
const formatRecipeBottomSheetMessages = (lang: Lang) => {
  switch (lang) {
    case "en":
      return {
        tabs: {
          summary: "Summary",
          recipe: "Recipe",
          ingredients: "Ingredients",
        },
        summary: {
          aiWarning:
            "This recipe information is generated by AI and may be inaccurate. Please verify before cooking.",
          time: (min: number) => {
            const h = Math.floor(min / 60);
            const m = min % 60;
            if (h > 0) return `${h}h${m > 0 ? ` ${m}m` : ""} max`;
            return `${min}m max`;
          },
          servings: (num: number) => `${num} servings`,
          reviews: "Actual User Reviews",
          reviewSource: "Created based on YouTube comments.",
        },
        ingredients: {
          prepared: (count: number, total: number) =>
            `${count}/${total} Prepared`,
          all: (total: number) => `Total ${total}`,
          measure: "Measure",
          purchase: "Buy Ingredients from Video",
          videoRef: "(See video)",
          tooltip: "Tap prepared ingredients",
          deselectAll: "Deselect All",
          selectAll: "Select All",
          ready: "Ready to Cook",
          start: "Start Cooking",
        },
      };
    default:
      return {
        tabs: {
          summary: "요약",
          recipe: "레시피",
          ingredients: "재료",
        },
        summary: {
          aiWarning:
            "이 레시피 정보는 AI로 생성되었으며 부정확할 수 있습니다. 조리 전 확인해주세요.",
          time: (min: number) => {
            const h = Math.floor(min / 60);
            const m = min % 60;
            if (h > 0) {
              const r5 = m > 0 ? Math.ceil(m / 5) * 5 : 0;
              return `${h}시간${r5 ? ` ${r5}분 이내` : ""}`;
            }
            const rounded = Math.max(5, Math.ceil(min / 5) * 5);
            return `${rounded}분 이내`;
          },
          servings: (num: number) => `${num}인분 기준`,
          reviews: "실제 사용자 후기",
          reviewSource: "유튜브 댓글을 참고해서 만들었어요.",
        },
        ingredients: {
          prepared: (count: number, total: number) =>
            `준비 ${count}개 / ${total}개`,
          all: (total: number) => `전체 ${total}개`,
          measure: "계량법",
          purchase: "영상 속 재료 바로 구매하기",
          videoRef: "(영상 참고)",
          tooltip: "준비한 재료는 터치",
          deselectAll: "전체 해제",
          selectAll: "전체 선택",
          ready: "준비 완료",
          start: "요리 시작",
        },
      };
  }
};

export const RecipeBottomSheet = ({
  steps,
  ingredients,
  onTimeClick,
  handleRouteToStep,
  recipe_summary,
  tags = [],
  briefings = [],
  collapsedTopPx,
  expandedTopPx,
  recipeId,
  // Amplitude 콜백
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
  collapsedTopPx: number;
  expandedTopPx: number;
  recipeId: string;
  // Amplitude 콜백 타입
  onTabClick?: (tabName: "summary" | "recipe" | "ingredients") => void;
  onStepClick?: (stepOrder: number, stepTitle: string, videoTime: number) => void;
  onMeasurementClick?: () => void;
  onCookingStart?: (selectedIngredientCount: number) => void;
}) => {
  const [activeTab, setActiveTab] = useState<
    "summary" | "recipe" | "ingredients"
  >("summary");
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [measurementOpen, setMeasurementOpen] = useState(false);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);

  const [isMeasured, setIsMeasured] = useState(false);
  const [topPx, setTopPx] = useState<number>(() => collapsedTopPx || 0);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const dragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartTop = useRef(0);

  // 언어 설정 가져오기
  const lang = useLangcode();
  const messages = formatRecipeBottomSheetMessages(lang);

  // 상단/하단 한계 (완전 확장=헤더 하단, 접힘=헤더+영상)
  const maxExpandTop = Math.max(0, expandedTopPx);
  const minCollapseTop = Math.max(0, collapsedTopPx);

  // 최초 위치 확정 + 리사이즈 반영 시 클램핑
  useEffect(() => {
    if (collapsedTopPx > 0 && !isMeasured) {
      setTopPx(collapsedTopPx);
      setIsMeasured(true);
      return;
    }
    if (isMeasured && (collapsedTopPx > 0 || expandedTopPx > 0)) {
      setTopPx((prev) => {
        const clamped = Math.min(Math.max(prev, maxExpandTop), minCollapseTop);
        return Math.abs(clamped - prev) > 1 ? clamped : prev;
      });
    }
  }, [collapsedTopPx, expandedTopPx, maxExpandTop, minCollapseTop, isMeasured]);

  // 드래그
  const onDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    dragging.current = true;
    dragStartY.current =
      "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    dragStartTop.current = topPx;
  };

  const onDragMove = (e: TouchEvent | MouseEvent) => {
    if (!dragging.current) return;
    const y =
      e instanceof TouchEvent
        ? e.touches[0].clientY
        : (e as MouseEvent).clientY;
    const dy = y - dragStartY.current;
    const nextTop = Math.min(
      Math.max(dragStartTop.current + dy, maxExpandTop),
      minCollapseTop
    );
    setTopPx(nextTop);
    if ((e as any).cancelable) e.preventDefault();
  };

  const onDragEnd = () => {
    if (!dragging.current) return;
    dragging.current = false;
    const mid = (maxExpandTop + minCollapseTop) / 2;
    setTopPx((t) => (t < mid ? maxExpandTop : minCollapseTop));
  };

  // 전역 드래그 리스너
  useEffect(() => {
    const mm = (e: MouseEvent) => onDragMove(e);
    const mu = () => onDragEnd();
    const tm = (e: TouchEvent) => onDragMove(e);
    const tu = () => onDragEnd();
    window.addEventListener("mousemove", mm);
    window.addEventListener("mouseup", mu);
    window.addEventListener("touchmove", tm, { passive: false });
    window.addEventListener("touchend", tu);
    return () => {
      window.removeEventListener("mousemove", mm);
      window.removeEventListener("mouseup", mu);
      window.removeEventListener("touchmove", tm);
      window.removeEventListener("touchend", tu);
    };
  }, [maxExpandTop, minCollapseTop]);

  if (!isMeasured) return null;

  // 유틸
  const cookTime = recipe_summary?.cookTime ?? 0;
  const description = recipe_summary?.description ?? "";
  const servings = Math.max(0, Number(recipe_summary?.servings ?? 0));
  const allSel = selected.size === ingredients.length;

  return (
    <>
      {/* overlay: 헤더를 덮지 않게 top을 헤더 높이로 */}
      <div
        className={[
          "fixed inset-x-0 bottom-0 bg-black/60 opacity-0 pointer-events-none transition-opacity duration-300 z-[900]",
          topPx === maxExpandTop ? "opacity-100 pointer-events-auto" : "",
        ].join(" ")}
        style={{ top: `${maxExpandTop}px` }}
        onClick={() => setTopPx(minCollapseTop)}
      />

      {/* sheet */}
      <div
        className={[
          "fixed left-0 right-0 bottom-0 max-w-[100vw] bg-white rounded-t-2xl shadow-[0_-4px_16px_rgba(0,0,0,0.2)]",
          "flex flex-col overflow-hidden transition-[top] duration-300 z-[950]",
        ].join(" ")}
        style={{ top: `${topPx}px` }}
      >
        {/* handle & tabs */}
        <div className="flex flex-col items-center bg-white">
          <div
            className="w-full flex justify-center py-5 cursor-grab select-none"
            onMouseDown={onDragStart}
            onTouchStart={onDragStart}
          >
            <div className="w-16 h-1.5 bg-gray-200 rounded-md" />
          </div>
          <div className="w-full flex px-1 border-b border-gray-100">
            {(["summary", "recipe", "ingredients"] as const).map((tab) => {
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  className={[
                    "flex-1 flex flex-col items-center h-9 font-bold text-[18px]",
                    active ? "text-neutral-900" : "text-gray-400",
                    "relative",
                  ].join(" ")}
                  onClick={() => {
                    setActiveTab(tab);
                    contentRef.current?.scrollTo({ top: 0, behavior: "auto" });
                    if (tab === "recipe") {
                      setExpanded(new Set(steps.map((_, idx) => idx)));
                    }
                    // Amplitude: 탭 클릭 추적
                    onTabClick?.(tab);
                  }}
                >
                  {messages.tabs[tab]}
                  {active && (
                    <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-neutral-900" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* content */}
        <div ref={contentRef} className="flex-1 overflow-y-auto p-4">
          {activeTab === "summary" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 p-2 rounded-lg border border-orange-200 bg-orange-50 text-sm text-gray-500">
                <svg
                  className="w-4 h-4 text-orange-500"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    stroke="currentColor"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="break-keep break-words">
                  {messages.summary.aiWarning}
                </span>
              </div>

              {(!!description ||
                cookTime > 0 ||
                servings > 0 ||
                (tags?.length ?? 0) > 0) && (
                <section className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm">
                  {!!description && (
                    <p className="text-base leading-7 text-neutral-900 whitespace-normal break-keep break-words">
                      {description}
                    </p>
                  )}

                  {(cookTime > 0 || servings > 0) && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {cookTime > 0 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full border border-gray-100 bg-gray-50 text-sm font-semibold text-gray-600">
                          ⏱ {messages.summary.time(cookTime)}
                        </span>
                      )}
                      {servings > 0 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full border border-gray-100 bg-gray-50 text-sm font-semibold text-gray-600">
                          {messages.summary.servings(servings)}
                        </span>
                      )}
                    </div>
                  )}

                  {(tags?.length ?? 0) > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {tags!.map((t, i) => {
                        const name = t?.name ?? "";
                        if (!name) return null;
                        return (
                          <span
                            key={`${name}-${i}`}
                            className="inline-flex h-7 items-center px-3 rounded-full border border-gray-100 bg-gray-50 text-sm font-semibold text-gray-600 break-keep break-words"
                          >
                            #{name}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </section>
              )}

              {Array.isArray(briefings) && briefings.length > 0 && (
                <section className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm">
                  <h4 className="text-neutral-900 font-bold text-base mb-3">
                    {messages.summary.reviews}
                  </h4>
                  <p className="text-sm text-gray-500 mb-3 flex gap-1.5 items-center">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        stroke="currentColor"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {messages.summary.reviewSource}
                  </p>
                  <ul className="flex flex-col gap-2">
                    {briefings.map((b, i) => {
                      const text = b?.content ?? "";
                      if (!text) return null;
                      return (
                        <li
                          key={`${i}-${text.slice(0, 12)}`}
                          className="flex gap-2 items-start"
                        >
                          <span className="w-1.5 h-1.5 mt-2.5 rounded-full bg-orange-500 flex-shrink-0" />
                          <span className="text-base leading-7 text-neutral-900 break-keep break-words">
                            {text}
                          </span>
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
                <div key={step.id} className="flex flex-col gap-3">
                  <div
                    className="flex items-center gap-3 cursor-pointer select-none rounded-md p-2 -m-2 hover:bg-gray-50"
                    onClick={() =>
                      setExpanded((prev) => {
                        const next = new Set(prev);
                        next.has(idx) ? next.delete(idx) : next.add(idx);
                        return next;
                      })
                    }
                  >
                    <div className="w-8 h-8 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center">
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <div className="flex-1">
                      <h3 className="m-0 text-lg font-bold text-neutral-900 break-keep break-words">
                        {step.subtitle}
                      </h3>
                    </div>
                    <svg
                      className={[
                        "w-6 h-6 transition-transform",
                        expanded.has(idx) ? "rotate-180" : "",
                      ].join(" ")}
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M6 9L12 15L18 9"
                        stroke="#111111"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>

                  {expanded.has(idx) && (
                    <div className="flex flex-col gap-2 pl-11">
                      {step.details.map((d, di) => (
                        <button
                          key={di}
                          className="w-full min-h-11 text-left border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 flex items-start justify-between gap-3"
                          onClick={() => {
                            onTimeClick(d.start);
                            setTopPx(minCollapseTop);
                            // Amplitude: 스텝 클릭 추적
                            onStepClick?.(step.stepOrder, step.subtitle, d.start);
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <span className="w-5 h-5 text-xs font-bold rounded-full bg-white grid place-items-center border">
                              {di + 1}
                            </span>
                            <p className="m-0 text-sm leading-6 text-neutral-900 break-keep break-words">
                              {d.text}
                            </p>
                          </div>
                          <svg
                            className="w-4 h-4 text-gray-500"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M9 18L15 12L9 6"
                              stroke="#7E7E7E"
                              strokeWidth="2"
                            />
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
            <div className="flex flex-col gap-4 relative">
              <div className="flex items-center justify-between">
                <div className="font-bold text-xl">
                  {selected.size > 0 ? (
                    <span className="text-neutral-900">
                      {messages.ingredients.prepared(
                        selected.size,
                        ingredients.length
                      )}
                    </span>
                  ) : (
                    <span className="text-neutral-900">
                      {messages.ingredients.all(ingredients.length)}
                    </span>
                  )}
                </div>
                <button
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm"
                  onClick={() => {
                    setMeasurementOpen(true);
                    // Amplitude: 계량법 클릭 추적
                    onMeasurementClick?.();
                  }}
                >
                  <span>{messages.ingredients.measure}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 18L15 12L9 6"
                      stroke="#4B4B4B"
                      strokeWidth="2"
                    />
                  </svg>
                </button>
              </div>

              {/* 재료 구매 배너 */}
              <div
                className="relative overflow-hidden rounded-md border border-gray-200 bg-gradient-to-r from-orange-50 to-white cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setPurchaseModalOpen(true)}
              >
                <div className="flex items-center justify-between px-4 py-2.5">
                  <div className="flex items-center gap-2.5">
                    {/* 왼쪽 아이콘 */}
                    <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center">
                      <div className="text-xl">🛒</div>
                    </div>

                    {/* 텍스트 */}
                    <span className="text-base font-semibold text-neutral-900">
                      {messages.ingredients.purchase}
                    </span>
                  </div>

                  {/* 오른쪽 화살표 */}
                  <svg
                    className="w-5 h-5 text-gray-400 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M9 18L15 12L9 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {ingredients.map((ing, i) => {
                  const isSel = selected.has(i);
                  const isFirst = i === 0;
                  const showTooltip = isFirst && selected.size === 0;

                  return (
                    <div key={i} className="relative">
                      <button
                        className={[
                          "aspect-square min-w-20 w-full border rounded-md px-3 py-3 flex flex-col items-center justify-center gap-1 transition-all relative overflow-visible",
                          isSel
                            ? "border-orange-500 ring-1 ring-orange-500"
                            : "border-gray-200",
                        ].join(" ")}
                        onClick={() =>
                          setSelected((prev) => {
                            const next = new Set(prev);
                            next.has(i) ? next.delete(i) : next.add(i);
                            return next;
                          })
                        }
                      >
                        <span
                          className={[
                            "text-center font-bold text-base leading-5 break-keep break-words",
                            isSel ? "text-orange-500" : "text-neutral-900",
                          ].join(" ")}
                        >
                          {ing.name}
                        </span>
                        {(ing.amount ?? 0) > 0 ? (
                          <span className="text-sm text-gray-600">
                            {ing.amount}
                            {ing.unit ?? ""}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-600">
                            {messages.ingredients.videoRef}
                          </span>
                        )}

                        {showTooltip && (
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 animate-bounce pointer-events-none">
                            <div className="relative bg-orange-500 text-white px-3 py-1.5 rounded-2xl shadow-md">
                              <span className="text-xs font-semibold whitespace-nowrap block">
                                {messages.ingredients.tooltip}
                              </span>
                              {/* 꼬리 (위로 향함) */}
                              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] border-b-orange-500" />
                            </div>
                          </div>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* footer */}
        <div className="border-t border-gray-200 bg-white p-3">
          {activeTab === "ingredients" ? (
            selected.size > 0 && (
              <div className="flex gap-2">
                <button
                  className={[
                    "flex-1 px-4 py-3 rounded-md font-bold border",
                    allSel
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white text-orange-500 border-orange-500",
                  ].join(" ")}
                  onClick={() =>
                    setSelected((prev) =>
                      prev.size === ingredients.length
                        ? new Set()
                        : new Set(ingredients.map((_, idx) => idx))
                    )
                  }
                >
                  {allSel
                    ? messages.ingredients.deselectAll
                    : messages.ingredients.selectAll}
                </button>
                <button
                  className={[
                    "flex-1 px-4 py-3 rounded-md font-bold",
                    allSel
                      ? "bg-orange-500 text-white"
                      : "bg-gray-300 text-white cursor-not-allowed",
                  ].join(" ")}
                  onClick={() => {
                    if (!allSel) return;
                    setSelected(new Set());
                    setActiveTab("recipe");
                    contentRef.current?.scrollTo({ top: 0, behavior: "auto" });
                    setTopPx(minCollapseTop);
                  }}
                  disabled={!allSel}
                >
                  {messages.ingredients.ready}
                </button>
              </div>
            )
          ) : (
            <div className="flex">
              <button
                className="flex-1 px-4 py-3 rounded-md font-bold bg-orange-500 text-white active:scale-[0.98] transition"
                onClick={() => {
                  // Amplitude: 요리 시작 추적 (있으면 콜백 사용, 없으면 기존 라우팅)
                  if (onCookingStart) {
                    onCookingStart(selected.size);
                  } else {
                    handleRouteToStep();
                  }
                }}
              >
                {messages.ingredients.start}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Measurement Overlay */}
      <MeasurementOverlay
        open={measurementOpen}
        onOpenChange={setMeasurementOpen}
      />

      {/* Purchase Modal */}
      <IngredientPurchaseModal
        open={purchaseModalOpen}
        onOpenChange={setPurchaseModalOpen}
        ingredients={ingredients}
        recipeId={recipeId}
      />
    </>
  );
};