import { Skeleton } from "@/components/ui/skeleton";
import Header, { BackButton } from "@/src/shared/ui/header/header";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
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
  StepDetail,
} from "./RecipeDetail.controller";
import Image from "next/image";
import { useSafeArea } from "@/src/shared/safearea/useSafaArea";
import { ChevronLeft } from "lucide-react";

/** ---- Skeleton ---- */
export const RecipeDetailPageSkeletonMobile = () => (
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

export const RecipeDetailPageReadyMobile = ({ id }: { id: string }) => {
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
  } = useRecipeDetailController(id, "mobile");

  useSafeArea({
    top: { color: "#FFFFFF", isExists: true },
    bottom: { color: "#FFFFFF", isExists: false },
    left: { color: "#FFFFFF", isExists: true },
    right: { color: "#FFFFFF", isExists: true },
  });

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
    onTimeClick(sec, playerRef);
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-scroll overscroll-y-none bg-white">
      <div className="fixed top-[0px] left-0 right-0 z-10">
        <YoutubeVideo
          videoId={videoInfo.videoId}
          title={videoInfo?.videoTitle}
          containerRef={videoWrapRef as React.RefObject<HTMLDivElement>}
          onPlayerReady={(p) => (playerRef.current = p)}
        />
      </div>

      <div className="w-full">
        <VideoPadding />
        <RecipeSummary
          title={videoInfo?.videoTitle}
          description={recipeSummary?.description}
          cookTime={recipeSummary?.cookingTime}
          servings={recipeSummary?.servings}
          ingredientCount={ingredients.length}
        />
        <BriefingSummary briefings={briefings} />
        <Ingredients ingredients={ingredients} />
        <Steps isEnrolled={viewStatus !== null} steps={steps} />
      </div>
      {viewStatus !== null && (
        <div className="fixed bottom-14 right-10 z-10">
          <ButtonStartCooking />
        </div>
      )}
      <div className="fixed bottom-14 left-10 z-10">
        <ButtonBack />
      </div>
    </div>
  );
};

const ButtonStartCooking = () => {
  return (
    <div className="flex h-14 w-36 gap-2 items-center justify-center bg-orange-500 rounded-xl shadow-xl shadow-gray-500/40 text-white font-bold text-xl">
      <span className="text-white font-bold text-xl">요리하기</span>
      <Image
        src="/images/cook-pot.png"
        alt="Cooking Pot"
        width={24}
        height={20}
      />
    </div>
  );
};

const ButtonBack = () => {
  return (
    <button
      type="button"
      aria-label="Back"
      className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gray-500/80 text-white font-bold text-base shadow-xl shadow-gray-500/40"
    >
      <ChevronLeft className=" opacity-90" />
    </button>
  );
};

const Steps = ({
  steps,
  isEnrolled,
}: {
  steps: RecipeStep[];
  isEnrolled: boolean;
}) => {
  const numberToUpperAlpha = (n: number) => {
    return String.fromCharCode(64 + n);
  };

  const StepTitle = ({
    index,
    stepTitle,
  }: {
    index: number;
    stepTitle: string;
  }) => {
    const Order = () => {
      return (
        <div className="text-sm font-bold text-white bg-orange-500 rounded-full w-6 h-6 flex items-center justify-center">
          {numberToUpperAlpha(index + 1)}
        </div>
      );
    };

    return (
      <div className="flex items-center gap-2">
        <Order />
        <p className="text-base font-bold">{stepTitle}</p>
      </div>
    );
  };

  const StepDetails = ({ stepDetails }: { stepDetails: StepDetail[] }) => {
    return (
      <div className="p-2 rounded-md bg-gray-100 flex flex-col gap-2">
        {stepDetails.map((detail, index) => (
          <div
            key={index}
            className="text-sm font-bold shadow-lg bg-white p-2 rounded-md"
          >
            {detail.text}
          </div>
        ))}
      </div>
    );
  };

  if (!isEnrolled) {
    return (
      <div className="relative pt-6 px-4 gap-2 h-120 overflow-hidden">
        <div className="absolute z-[10] flex items-center justify-center inset-0 bg-gradient-to-t from-[#FDBD78] to-[#D9D9D9]/3">
          <div className="flex flex-col items-center justify-end h-full pb-16 gap-2">
            <div className="w-[110px] h-[100px]">
              <Image
                src="/images/tory/polite-tory.png"
                alt="Recipe Detail BG"
                width={110}
                height={100}
                className="object-cover object-center"
              />
            </div>
            <div className="h-3" />
            <div className="text-lg font-bold text-center">
              <span className="block">토리에게 베리 1개를 주면</span>
              <span className="block">레시피를 볼 수 있어요.</span>
            </div>
            <div className="flex flex-row items-center justify-center gap-1 ">
              <div className="pb-1">
                <div className="w-[20px] h-[24px]">
                  <Image
                    src="/images/berry/berry.png"
                    alt="Berry"
                    width={20}
                    height={24}
                  />
                </div>
              </div>
              <div className="text text-gray-600 ">{`현재 베리 : ${1}개`}</div>
            </div>
            <div className="px-5 py-1.5 bg-orange-500 rounded-xl text-white font-bold text-lg">
              레시피 보기
            </div>
          </div>
        </div>
        <div className=" gap-1 text text-lg font-bold">레시피</div>
        <div className="h-2" />
        <div className="flex flex-col gap-4">
          {steps.slice(0, 2).map((step, index) => (
            <div key={index} className="p-2 rounded-md bg-gray-100">
              <StepTitle index={index} stepTitle={step.subtitle} />
              <div className="h-2" />
              <StepDetails stepDetails={step.details} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-6 px-4 gap-2">
      <div className=" gap-1 text text-lg font-bold">레시피</div>
      <div className="h-2" />
      <div className="flex flex-col gap-4">
        {steps.map((step, index) => (
          <div key={index} className="p-2 rounded-md bg-gray-100">
            <StepTitle index={index} stepTitle={step.subtitle} />
            <div className="h-2" />
            <StepDetails stepDetails={step.details} />
          </div>
        ))}
      </div>
      <div className="h-24" />
    </div>
  );
};

const BriefingSummary = ({ briefings }: { briefings: RecipeBriefing[] }) => {
  const Point = () => {
    return (
      <div className="w-1 h-1 mt-2.5 rounded-full bg-orange-500 flex-shrink-0" />
    );
  };
  return (
    <div className="pt-6 px-4 gap-2">
      <div className="text text-lg font-bold">실제 사용자 후기</div>
      <div className="h-2" />
      <div className="flex flex-col gap-2">
        {briefings.slice(0, 2).map((briefing, index) => (
          <div key={index} className="flex items-start gap-2">
            <Point />
            <div className="">{briefing.content}</div>
          </div>
        ))}
      </div>
      <div className="w-full flex justify-center px-2 py-2">
        <div className="px-6 py-1 bg-gray-300  rounded-md ">더보기</div>
      </div>
      <div className="h-1" />
      <HorizontalLine />
    </div>
  );
};

const Ingredients = ({ ingredients }: { ingredients: Ingredient[] }) => {
  return (
    <div className="pt-6 px-3 gap-2">
      <div className="text text-lg font-bold px-1">재료</div>
      <div className="h-2" />
      <div className="flex flex-wrap gap-1">
        {ingredients.map((ingredient, index) => (
          <div
            className="inline-flex w-fit shrink-0 rounded-md border px-3 py-2"
            key={index}
          >
            <div className="text-center">
              <div className="font-semibold">{ingredient.name}</div>
              <div className="text-gray-500 text-sm">
                {ingredient.amount || "영상참고"}
                {`${ingredient.unit ? ` ${ingredient.unit}` : ""}`}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full flex justify-center px-2 py-4">
        <div className="px-6 py-1 bg-gray-300  rounded-md ">
          영상 속 재료 바로 구매하기
        </div>
      </div>
      <div className="h-1" />
      <HorizontalLine />
    </div>
  );
};

type RecipeSummaryProps = {
  title?: string;
  description?: string;
  cookTime?: number;
  servings?: number;
  ingredientCount?: number;
};

const RecipeSummary = ({
  title,
  description,
  cookTime,
  servings,
  ingredientCount,
}: RecipeSummaryProps) => {
  const CookingTime = () => {
    return (
      <div className="flex gap-2 items-center">
        <div className="w-[30px] h-[30px]">
          <Image
            src="/images/description/cooking-time.png"
            alt="Cooking Time"
            className="object-cover object-center"
            width={30}
            height={30}
          />
        </div>
        <div className="flex flex-col">
          <div className="text-xl font-bold">{cookTime}분</div>
          <div className="text-gray-500">요리시간</div>
        </div>
      </div>
    );
  };

  const Servings = () => {
    return (
      <div className="flex gap-1 items-center">
        <div className="w-[44px] h-[28px] ">
          <Image
            src="/images/description/serving-counts.png"
            alt="Cooking Time"
            width={44}
            height={28}
          />
        </div>
        <div className="flex flex-col">
          <div className="text-xl font-bold">{servings}인분</div>
          <div className="text-gray-500">인원</div>
        </div>
      </div>
    );
  };

  const IngredientCount = () => {
    return (
      <div className="flex gap-1 items-center">
        <div className="w-[36px] h-[26px]">
          <Image
            src="/images/description/ingredient-count.png"
            alt="Cooking Time"
            className="object-cover object-center"
            width={36}
            height={26}
          />
        </div>
        <div className="flex flex-col">
          <div className="text-xl font-bold">{ingredientCount}개</div>
          <div className="text-gray-500">재료</div>
        </div>
      </div>
    );
  };
  return (
    <div className="pt-6 px-4">
      <div className="text-xl font-bold line-clamp-2">{title}</div>
      <div className="text-sm text-gray-500 line-clamp-2">{description}</div>
      <div className="pt-4 flex flex-col">
        <HorizontalLine />
        <div className="flex py-4 h-[92px] justify-center items-center">
          <CookingTime />
          <div className="px-2" />
          <VerticalLine />
          <div className="px-2" />
          <Servings />
          <div className="px-2" />
          <VerticalLine />
          <div className="px-2" />
          <IngredientCount />
        </div>
        <HorizontalLine />
      </div>
    </div>
  );
};

const HorizontalLine = () => {
  return <div className="w-full h-[1px] bg-gray-300"></div>;
};

const VerticalLine = () => {
  return <div className="w-[1px] h-full bg-gray-300"></div>;
};

export const RecipeDetailPageReadyMobileDepredcated = ({
  id,
}: {
  id: string;
}) => {
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
  } = useRecipeDetailController(id, "mobile");

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
    onTimeClick(sec, playerRef);
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-white">
      <div ref={headerWrapRef}>
        <Header
          leftContent={
            <div className="z-1">
              <BackButton onClick={onBack} />
            </div>
          }
          centerContent={
            <div
              className="
              text-xl font-semibold text-center
              overflow-hidden text-ellipsis whitespace-nowrap
              max-w-[calc(100vw-144px)] break-keep break-words
            "
              title={videoInfo.videoTitle}
            >
              {videoInfo.videoTitle}
            </div>
          }
          rightContent={
            <TimerButton
              recipeId={id}
              recipeName={videoInfo.videoTitle ?? ""}
              onTimerClick={onTimerClick}
            />
          }
        />
      </div>

      <YoutubeVideo
        videoId={videoInfo.videoId}
        title={videoInfo?.videoTitle}
        containerRef={videoWrapRef as React.RefObject<HTMLDivElement>}
        onPlayerReady={(p) => (playerRef.current = p)}
      />

      <RecipeBottomSheetMobile
        steps={steps}
        ingredients={ingredients}
        onTimeClick={handleTimeClick}
        handleRouteToStep={routeToStep}
        recipe_summary={recipeSummary}
        tags={tags}
        briefings={briefings}
        collapsedTopPx={collapsedTop}
        expandedTopPx={expandedTop}
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
  );
};

/** ---- YouTube (react-youtube 동적 로딩) ---- */
const ReactYouTube = dynamic(() => import("react-youtube"), { ssr: false });

const YoutubeVideo = ({
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

const VideoPadding = () => {
  return <div className="w-full aspect-video" />;
};

/** ---- Bottom Sheet ---- */
const RecipeBottomSheetMobile = ({
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
  collapsedTopPx: number;
  expandedTopPx: number;
  recipeId: string;
  onTabClick?: (tabName: TabName) => void;
  onStepClick?: (
    stepOrder: number,
    stepTitle: string,
    videoTime: number,
    detailIndex: number
  ) => void;
  onMeasurementClick?: () => void;
  onCookingStart?: (selectedIngredientCount: number) => void;
  t: (key: string, options?: Record<string, unknown>) => string;
  lang: string;
  formatTime: (min: number) => string;
}) => {
  const [activeTab, setActiveTab] = useState<TabName>("summary");
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
    if ((e as TouchEvent).cancelable) e.preventDefault();
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
  const cookTime = recipe_summary?.cookingTime ?? 0;
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
                    onTabClick?.(tab);
                  }}
                >
                  {t(`tabs.${tab}`)}
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
                  {t("summary.aiWarning")}
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
                          ⏱ {formatTime(cookTime)}
                        </span>
                      )}
                      {servings > 0 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full border border-gray-100 bg-gray-50 text-sm font-semibold text-gray-600">
                          {t("summary.servings", { count: servings })}
                        </span>
                      )}
                    </div>
                  )}

                  {(tags?.length ?? 0) > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {tags!.map((tag, i) => {
                        const name = tag?.name ?? "";
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
                    {t("summary.reviews")}
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
                    {t("summary.reviewSource")}
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
                            onStepClick?.(
                              step.stepOrder,
                              step.subtitle,
                              d.start,
                              di
                            );
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
                      {t("ingredients.prepared", {
                        count: selected.size,
                        total: ingredients.length,
                      })}
                    </span>
                  ) : (
                    <span className="text-neutral-900">
                      {t("ingredients.all", { count: ingredients.length })}
                    </span>
                  )}
                </div>
                {lang == "ko" && (
                  <button
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm"
                    onClick={() => {
                      setMeasurementOpen(true);
                      onMeasurementClick?.();
                    }}
                  >
                    <span>{t("ingredients.measure")}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9 18L15 12L9 6"
                        stroke="#4B4B4B"
                        strokeWidth="2"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* 재료 구매 배너 */}
              {lang == "ko" && (
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
                        {t("ingredients.purchase")}
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
              )}

              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
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
                            {t("ingredients.videoRef")}
                          </span>
                        )}

                        {showTooltip && (
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 animate-bounce pointer-events-none">
                            <div className="relative bg-orange-500 text-white px-3 py-1.5 rounded-2xl shadow-md">
                              <span className="text-xs font-semibold whitespace-nowrap block">
                                {t("ingredients.tooltip")}
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
                    ? t("ingredients.deselectAll")
                    : t("ingredients.selectAll")}
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
                  {t("ingredients.ready")}
                </button>
              </div>
            )
          ) : (
            <div className="flex">
              <button
                className="flex-1 px-4 py-3 rounded-md font-bold bg-orange-500 text-white active:scale-[0.98] transition"
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
