import { useRef } from "react";
import { useRecipeDetailController } from "../common/hook/useRecipeDetailController";
import Image from "next/image";
import { useSafeArea } from "@/src/shared/safearea/useSafaArea";
import { ChevronLeft } from "lucide-react";
import { useFetchBalance } from "@/src/entities/balance";
import { VideoPadding, YoutubeVideo } from "./component/youtubeVideo";
import {
  BriefingSummary,
  BriefingSummarySkeleton,
} from "./component/briefingSummary";
import { Steps } from "./component/steps";
import { Ingredients, IngredientsSkeleton } from "./component/ingredients";
import { useRouter } from "next/router";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { ErrorBoundary } from "react-error-boundary";
import { isAxiosError } from "axios";
import { useRecipeDetailTranslation } from "../common/hook/useRecipeDetailTranslation";

const RecipeVideoSummarySkeleton = () => {
  return (
    <>
      <BriefingSummarySkeleton />
      <div className="px-4">
        <HorizontalLineSkeleton />
      </div>
      <div className="h-3" />
      <IngredientsSkeleton />
      <div className="px-4">
        <HorizontalLineSkeleton />
      </div>
      <div className="h-3" />
    </>
  );
};

export const RecipeDetailPageReadyMobile = ({ id }: { id: string }) => {
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

  const router = useRouter();
  const title = router.query.title as string;
  const description = router.query.description as string;
  const cookingTime = router.query.cookingTime as string;
  const servings = router.query.servings as string;
  const videoId = router.query.videoId as string;

  if (!id || !title || !description || !cookingTime || !servings || !videoId) {
    return <div>No data</div>;
  }

  return (
    <ErrorBoundary
      fallbackRender={({ error }) => <RecipeDetailPageError error={error} />}
    >
      <div
        ref={scrollContainerRef}
        className="relative w-full h-[100dvh] overflow-y-auto overscroll-y-none bg-white [-webkit-overflow-scrolling:touch]"
      >
        <FirstSection
          videoInfo={{ videoId: videoId, videoTitle: title }}
          recipeSummary={{
            description,
            cookingTime: Number(cookingTime),
            servings: Number(servings),
          }}
          playerRef={playerRef}
          videoWrapRef={videoWrapRef}
        />
        <SSRSuspense fallback={<RecipeVideoSummarySkeleton />}>
          <RecipeVideoSummary
            recipeId={id}
            playerRef={playerRef}
            scrollContainerRef={scrollContainerRef}
          />
        </SSRSuspense>
        {/* Always visible back button */}
        <div className="fixed bottom-[calc(3.5rem+env(safe-area-inset-bottom))] left-4 z-10">
          <ButtonBack onClick={() => router.back()} />
        </div>
      </div>
    </ErrorBoundary>
  );
};

const RecipeDetailPageError = ({ error }: { error: any }) => {
  const router = useRouter();
  const { t } = useRecipeDetailTranslation();
  if (isAxiosError(error)) {
    const errorCode = error.response?.data?.errorCode;
    if (errorCode === "RECIPE008") {
      return (
        <div className="flex flex-col items-center justify-center h-[100dvh] w-full bg-gradient-to-b from-orange-50 via-orange-50/50 to-white px-6">
          <div className="flex flex-col items-center justify-center max-w-sm w-full">
            {/* Tory 이미지 카드 */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-b from-orange-200/40 to-transparent rounded-3xl blur-xl" />
              <div className="relative bg-white rounded-3xl p-6 shadow-xl shadow-orange-100/50 border border-orange-100">
                <Image
                  src="/images/tory/tory_cry.png"
                  alt={t("error.failedRecipeAlt")}
                  width={140}
                  height={140}
                />
              </div>
            </div>

            {/* 에러 메시지 */}
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-xl font-bold text-gray-900">
                {t("error.failedRecipeTitle")}
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {t("error.failedRecipeDescription")}
              </p>
            </div>

            {/* 액션 버튼들 */}
            <div className="w-full flex flex-col gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full flex items-center justify-center gap-2 bg-white rounded-2xl px-6 py-4 text-gray-600 font-semibold text-base border border-gray-200 shadow-sm
                  transition-all duration-150
                  hover:bg-gray-50 hover:border-gray-300 hover:shadow-md
                  active:scale-[0.98] active:bg-gray-100
                  cursor-pointer"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span>{t("error.goBack")}</span>
              </button>
            </div>
          </div>
        </div>
      );
    }
  }
  throw error;
};

const FirstSection = ({
  videoInfo,
  recipeSummary,
  playerRef,
  videoWrapRef,
}: {
  videoInfo: { videoId: string; videoTitle: string };
  recipeSummary: { description: string; cookingTime: number; servings: number };
  playerRef: React.RefObject<YT.Player | null>;
  videoWrapRef: React.RefObject<HTMLDivElement | null>;
}) => {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-10">
        <YoutubeVideo
          videoId={videoInfo.videoId}
          title={videoInfo?.videoTitle}
          containerRef={videoWrapRef as React.RefObject<HTMLDivElement>}
          onPlayerReady={(p) => (playerRef.current = p)}
        />
      </div>
      <VideoPadding />
      <RecipeSummary
        title={videoInfo?.videoTitle}
        description={recipeSummary?.description}
        cookTime={recipeSummary?.cookingTime}
        servings={recipeSummary?.servings}
      />
    </>
  );
};

const RecipeVideoSummary = ({
  recipeId,
  playerRef,
  scrollContainerRef,
}: {
  recipeId: string;
  playerRef: React.RefObject<YT.Player | null>;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const {
    ingredients,
    steps,
    briefings,
    viewStatus,
    onBack,
    routeToStep,
    onTimeClick,
    t,
    lang,
    formatTime,
  } = useRecipeDetailController(recipeId, "mobile");
  const handleTimeClick = (sec: number) => {
    onTimeClick(sec, playerRef);
  };

  const { data: balanceData } = useFetchBalance();
  const balance = balanceData?.balance ?? 0;
  return (
    <>
      {briefings && briefings.length > 0 && (
        <>
          <BriefingSummary briefings={briefings} />
          <div className="px-4">
            <HorizontalLine />
          </div>
          <div className="h-3" />
        </>
      )}
      <Ingredients ingredients={ingredients} recipeId={recipeId} />
      <div className="h-2" />
      <div className="px-4">
        <HorizontalLine />
      </div>
      <div className="h-3" />
      <Steps
        recipeId={recipeId}
        isEnrolled={viewStatus !== null}
        steps={steps}
        onTimeClick={handleTimeClick}
        balance={balance}
      />
      {viewStatus !== null && (
        <div className="fixed bottom-[calc(3.5rem+env(safe-area-inset-bottom))] right-4 z-10">
          <ButtonStartCooking onClick={routeToStep} />
        </div>
      )}
    </>
  );
};

const ButtonStartCooking = ({ onClick }: { onClick?: () => void }) => {
  const { t } = useRecipeDetailTranslation();
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
      <span className="text-white font-bold text-xl">{t("mobile.startCooking")}</span>
      <Image
        src="/images/cook-pot.png"
        alt=""
        aria-hidden="true"
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
        active:scale-[0.95] active:shadow-md active:bg-gray-600
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
  const { t } = useRecipeDetailTranslation();
  const CookingTime = () => {
    return (
      <div className="flex-1 flex gap-2.5 items-center justify-center">
        <div className="w-11 h-11 flex items-center justify-center">
          <Image
            src="/images/description/timer.png"
            alt=""
            aria-hidden="true"
            className="object-cover object-center"
            width={34}
            height={34}
          />
        </div>
        <div className="flex flex-col">
          <div className="text-lg font-bold leading-tight text-gray-900">{t("mobile.cookingTimeValue", { minutes: cookTime })}</div>
          <div className="text-sm text-gray-500">{t("mobile.cookingTime")}</div>
        </div>
      </div>
    );
  };

  const Servings = () => {
    return (
      <div className="flex-1 flex gap-2.5 items-center justify-center">
        <div className="w-11 h-11 flex items-center justify-center">
          <Image
            src="/images/description/count.png"
            alt=""
            aria-hidden="true"
            width={36}
            height={22}
          />
        </div>
        <div className="flex flex-col">
          <div className="text-lg font-bold leading-tight text-gray-900">{t("mobile.servingsValue", { count: servings })}</div>
          <div className="text-sm text-gray-500">{t("mobile.servingsLabel")}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="pt-3 px-4">
      <h1 className="text-xl font-bold leading-tight line-clamp-2">{title}</h1>
      <div className="h-1.5" />
      <p className="text-sm leading-relaxed text-gray-600 line-clamp-2">{description}</p>
      <div className="pt-3 flex flex-col">
        <HorizontalLine />
        <div className="flex py-2 items-center">
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
  return <div className="w-full h-[1px] bg-gray-200"></div>;
};

const HorizontalLineSkeleton = () => {
  return <div className="w-full h-[1px] bg-gray-200"></div>;
};

const VerticalLine = () => {
  return <div className="w-[1px] h-full bg-gray-300"></div>;
};

