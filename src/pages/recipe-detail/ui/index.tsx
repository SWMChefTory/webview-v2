// src/pages/recipe-detail/ui/index.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchRecipe } from "@/src/entities/recipe/model/useRecipe";
import Header, { BackButton } from "@/src/shared/ui/header";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";

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

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-white">
      <div ref={headerWrapRef}>
        <Header
          leftContent={<BackButton onClick={() => router.back()} />}
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
        expandedTopPx={expandedTop} // ⬅️ 추가
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

export const RecipeBottomSheet = ({
  steps,
  ingredients,
  onTimeClick,
  handleRouteToStep,
  recipe_summary,
  tags = [],
  briefings = [],
  collapsedTopPx,
  expandedTopPx, // ⬅️ 추가
}: {
  steps: RecipeStep[];
  ingredients: Ingredient[];
  onTimeClick: (time: number) => void;
  handleRouteToStep: () => void;
  recipe_summary: RecipeMeta;
  tags?: RecipeTag[];
  briefings?: RecipeBriefing[];
  collapsedTopPx: number;
  expandedTopPx: number; // ⬅️ 추가
}) => {
  const [activeTab, setActiveTab] = useState<
    "summary" | "recipe" | "ingredients"
  >("summary");
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const [isMeasured, setIsMeasured] = useState(false);
  const [topPx, setTopPx] = useState<number>(() => collapsedTopPx || 0);

  const dragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartTop = useRef(0);

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

  const formatMinutes = (min?: number) => {
    const minutes = Math.max(0, Math.floor(min ?? 0));
    const h = Math.floor(minutes / 60);
    const r = minutes % 60;
    if (h > 0) {
      const r5 = r > 0 ? Math.ceil(r / 5) * 5 : 0;
      return `${h}시간${r5 ? ` ${r5}분 이내` : ""}`;
    }
    const rounded = Math.max(5, Math.ceil(minutes / 5) * 5);
    return `${rounded}분 이내`;
  };

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
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "summary"
                    ? "요약"
                    : tab === "recipe"
                    ? "레시피"
                    : "재료"}
                  {active && (
                    <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-neutral-900" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* content */}
        <div className="flex-1 overflow-y-auto p-4">
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
                  이 레시피 정보는 AI로 생성되었으며 부정확할 수 있습니다. 조리
                  전 확인해주세요.
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
                          ⏱ {formatMinutes(cookTime)}
                        </span>
                      )}
                      {servings > 0 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full border border-gray-100 bg-gray-50 text-sm font-semibold text-gray-600">
                          {servings}인분 기준
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
                    💡 요리 팁
                  </h4>
                  <ul className="flex flex-col gap-2">
                    {briefings.map((b, i) => {
                      const text = b?.content ?? "";
                      if (!text) return null;
                      return (
                        <li
                          key={`${i}-${text.slice(0, 12)}`}
                          className="flex gap-2 items-start"
                        >
                          <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-orange-500" />
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
                    <>
                      <span className="text-neutral-900">
                        준비 {selected.size}개
                      </span>
                      <span className="text-gray-500">
                        /{ingredients.length}개
                      </span>
                    </>
                  ) : (
                    <span className="text-neutral-900">
                      전체 {ingredients.length}개
                    </span>
                  )}
                </div>
                <button
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm"
                  onClick={() => window.location.assign("/recipes/measurement")}
                >
                  <span>계량법</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 18L15 12L9 6"
                      stroke="#4B4B4B"
                      strokeWidth="2"
                    />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {ingredients.map((ing, i) => {
                  const isSel = selected.has(i);
                  return (
                    <button
                      key={i}
                      className={[
                        "aspect-square min-w-20 border rounded-md px-3 py-3 flex flex-col items-center justify-center gap-1 transition-all",
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
                      {(ing.amount ?? 0) > 0 && (
                        <span className="text-sm text-gray-600">
                          {ing.amount}
                          {ing.unit ?? ""}
                        </span>
                      )}
                    </button>
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
                  {allSel ? "전체 해제" : "전체 선택"}
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
                    setActiveTab("summary");
                    setTopPx(minCollapseTop);
                  }}
                  disabled={!allSel}
                >
                  준비 완료
                </button>
              </div>
            )
          ) : (
            <div className="flex">
              <button
                className="flex-1 px-4 py-3 rounded-md font-bold bg-orange-500 text-white active:scale-[0.98] transition"
                onClick={() => handleRouteToStep()}
              >
                요리 시작
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
