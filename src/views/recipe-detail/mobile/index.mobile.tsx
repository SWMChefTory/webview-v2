import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useRef, useState, useCallback } from "react";
import { useRecipeDetailController } from "../common/hook/useRecipeDetailController";
import Image from "next/image";
import { useSafeArea } from "@/src/shared/safearea/useSafaArea";
import { ChevronLeft, ChefHat, ListChecks } from "lucide-react";
import { useFetchBalance } from "@/src/entities/balance";
import { VideoPadding, YoutubeVideo } from "./component/youtubeVideo";
import { BriefingSummary } from "./component/briefingSummary";
import { Steps } from "./component/steps";
import { Ingredients } from "./component/ingredients";

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
    routeToStep,
    onTimeClick,
    t,
    lang,
    formatTime,
  } = useRecipeDetailController(id, "mobile");

  const { data: balanceData } = useFetchBalance();
  const balance = balanceData?.balance ?? 0;

  useSafeArea({
    top: { color: "#FFFFFF", isExists: true },
    bottom: { color: "#FFFFFF", isExists: false },
    left: { color: "#FFFFFF", isExists: true },
    right: { color: "#FFFFFF", isExists: true },
  });

  const videoWrapRef = useRef<HTMLDivElement | null>(null);

  // 스크롤 컨테이너 ref
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // YouTube 플레이어 ref
  const playerRef = useRef<YT.Player | null>(null);

  const handleTimeClick = (sec: number) => {
    onTimeClick(sec, playerRef);
  };

  return (
    <div
      ref={scrollContainerRef}
      className="relative w-full h-[100dvh] overflow-scroll overscroll-y-none bg-white"
    >
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
        />
        <QuickAccessCards
          ingredientCount={ingredients.length}
          stepCount={steps.length}
          scrollContainerRef={scrollContainerRef}
        />
        <div className="px-4">
          <HorizontalLine />
        </div>
        <div className="h-2" />
        {briefings && briefings.length > 0 && (
          <>
            <BriefingSummary briefings={briefings} />
            <div className="px-4">
              <HorizontalLine />
            </div>
            <div className="h-2" />
          </>
        )}
        <Ingredients ingredients={ingredients} recipeId={id} />
        <div className="px-4">
          <HorizontalLine />
        </div>
        <div className="h-2" />
        <Steps
          recipeId={id}
          isEnrolled={viewStatus !== null}
          steps={steps}
          onTimeClick={handleTimeClick}
          balance={balance}
        />
      </div>
      {viewStatus !== null && (
        <div className="fixed bottom-14 right-10 z-10">
          <ButtonStartCooking onClick={routeToStep} />
        </div>
      )}
      <div className="fixed bottom-14 left-10 z-10">
        <ButtonBack onClick={onBack} />
      </div>
    </div>
  );
};

const ButtonStartCooking = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-14 w-36 gap-2 items-center justify-center bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl shadow-xl shadow-gray-500/40 text-white font-bold text-xl
        transition-all duration-150
        hover:from-orange-500 hover:to-orange-600 hover:shadow-lg
        active:scale-[0.95] active:shadow-md
        cursor-pointer"
    >
      <span className="text-white font-bold text-xl">요리하기</span>
      <Image
        src="/images/cook-pot.png"
        alt="Cooking Pot"
        width={24}
        height={20}
      />
    </button>
  );
};

const ButtonBack = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button
      type="button"
      aria-label="Back"
      onClick={onClick}
      className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gray-500/80 text-white font-bold text-base shadow-xl shadow-gray-500/40
        transition-all duration-150
        hover:bg-gray-600/90 hover:shadow-lg
        active:scale-[0.92] active:shadow-md active:bg-gray-600
        cursor-pointer"
    >
      <ChevronLeft className="opacity-90" />
    </button>
  );
};

type RecipeSummaryProps = {
  title?: string;
  description?: string;
  cookTime?: number;
  servings?: number;
};

const RecipeSummary = ({
  title,
  description,
  cookTime,
  servings,
}: RecipeSummaryProps) => {
  const CookingTime = () => {
    return (
      <div className="flex-1 flex gap-2 items-center justify-center">
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
      <div className="flex-1 flex gap-2 items-center justify-center">
        <div className="w-[44px] h-[28px]">
          <Image
            src="/images/description/serving-counts.png"
            alt="Servings"
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

  return (
    <div className="pt-6 px-4">
      <div className="text-xl font-bold line-clamp-2">{title}</div>
      <div className="text-sm text-gray-500 line-clamp-2">{description}</div>
      <div className="pt-4 flex flex-col">
        <HorizontalLine />
        <div className="flex py-4 h-[92px] items-center">
          <CookingTime />
          <VerticalLine />
          <Servings />
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

/** ---- Quick Access Cards with Tory Guide ---- */
const TORY_GUIDE_STORAGE_KEY = "recipe-detail-tory-guide-shown";

const QuickAccessCards = ({
  ingredientCount,
  stepCount,
  scrollContainerRef,
}: {
  ingredientCount: number;
  stepCount: number;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const [showToryGuide, setShowToryGuide] = useState(false);

  useEffect(() => {
    // 첫 방문 시에만 토리 가이드 표시
    const hasShown = localStorage.getItem(TORY_GUIDE_STORAGE_KEY);
    if (!hasShown) {
      setShowToryGuide(true);
      localStorage.setItem(TORY_GUIDE_STORAGE_KEY, "true");
    }
  }, []);

  const scrollToSection = useCallback(
    (sectionId: string) => {
      const element = document.getElementById(sectionId);
      const container = scrollContainerRef.current;
      if (element && container) {
        // YouTube 비디오가 fixed로 상단에 있으므로 비디오 높이만큼 offset 필요
        const videoHeight = window.innerWidth * (9 / 16); // aspect-video 비율
        // 컨테이너 스크롤 기준으로 요소 위치 계산
        const elementTop = element.offsetTop;
        const offsetTop = elementTop - videoHeight; // 16px 추가 여백

        container.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    },
    [scrollContainerRef]
  );

  return (
    <div className="px-4 pt-3 pb-2">
      {/* 토리 가이드 - 첫 방문 시에만 */}
      {showToryGuide && (
        <div className="mb-3 p-3 bg-orange-50 rounded-2xl border border-orange-100 flex items-center gap-3">
          <div className="w-12 h-12 flex-shrink-0">
            <Image
              src="/images/tory/polite-tory.png"
              alt="토리"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">
              뭐부터 확인할까요?
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              아래 버튼으로 바로 이동할 수 있어요
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowToryGuide(false)}
            className="p-1 text-gray-400 hover:text-gray-600"
            aria-label="닫기"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* 퀵 액세스 카드 */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => scrollToSection("ingredients-section")}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-orange-200 active:scale-[0.98] transition-all cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-b from-orange-400 to-orange-500 flex items-center justify-center shadow-sm">
            <ListChecks className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <div className="text-sm font-bold text-gray-800">재료</div>
            <div className="text-xs text-gray-500">{ingredientCount}개</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => scrollToSection("recipe-steps-section")}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-orange-200 active:scale-[0.98] transition-all cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-b from-orange-400 to-orange-500 flex items-center justify-center shadow-sm">
            <ChefHat className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <div className="text-sm font-bold text-gray-800">레시피</div>
            <div className="text-xs text-gray-500">{stepCount}단계</div>
          </div>
        </button>
      </div>
    </div>
  );
};
