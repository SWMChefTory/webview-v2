import { useCallback, useMemo, useRef, useState } from "react";
import { useRecipeDetailController } from "../common/hook/useRecipeDetailController";
import { useTextTruncation } from "../common/hook/useTextTruncation";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useEnrollBookmark } from "@/src/entities/user-recipe/model/useBookmark";
import { useCreditRechargeModalStore } from "@/src/widgets/credit-recharge-modal/creditRechargeModalStore";

const RecipeDetailPageSkeleton = () => {
  return (
    <div className="relative w-full h-[100dvh] overflow-y-auto overscroll-y-none bg-white [-webkit-overflow-scrolling:touch]">
      <div className="w-full aspect-video bg-gray-200 animate-pulse" />
      <div className="pt-3 px-4">
        <Skeleton className="h-8 w-[80%] rounded" />
        <div className="h-1.5" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-[60%] rounded mt-1" />
        <div className="pt-3 flex flex-col">
          <div className="w-full h-[1px] bg-gray-200" />
          <div className="flex py-2 items-center">
            <div className="flex-1 flex gap-2.5 items-center justify-center">
              <Skeleton className="w-11 h-11 rounded-full" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-5 w-16 rounded" />
                <Skeleton className="h-4 w-12 rounded" />
              </div>
            </div>
            <div className="w-[1px] h-10 bg-gray-200" />
            <div className="flex-1 flex gap-2.5 items-center justify-center">
              <Skeleton className="w-11 h-11 rounded-full" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-5 w-16 rounded" />
                <Skeleton className="h-4 w-12 rounded" />
              </div>
            </div>
          </div>
          <div className="w-full h-[1px] bg-gray-200" />
        </div>
      </div>
      <div className="flex flex-col gap-3 mt-3 px-3">
        <div className="bg-gray-50/50 rounded-2xl py-3">
          <IngredientsSkeleton />
        </div>
        <BriefingSummarySkeleton />
      </div>
    </div>
  );
};

export const RecipeDetailPageReadyMobile = ({ id }: { id: string }) => {
  useSafeArea({
    top: { color: "#FFFFFF", isExists: true },
    bottom: { color: "#FFFFFF", isExists: false },
    left: { color: "#FFFFFF", isExists: true },
    right: { color: "#FFFFFF", isExists: true },
  });

  if (!id) {
    return <RecipeDetailPageSkeleton />;
  }

  return (
    <ErrorBoundary
      fallbackRender={({ error }) => <RecipeDetailPageError error={error} />}
    >
      <SSRSuspense fallback={<RecipeDetailPageSkeleton />}>
        <RecipeDetailContent recipeId={id} />
      </SSRSuspense>
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

const RecipeDetailContent = ({ recipeId }: { recipeId: string }) => {
  const videoWrapRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const router = useRouter();

  const {
    videoInfo,
    recipeSummary,
    ingredients,
    steps,
    briefings,
    viewStatus,
    routeToStep,
    onTimeClick,
    formatTime,
  } = useRecipeDetailController(recipeId, "mobile");

  const handleTimeClick = (sec: number) => {
    onTimeClick(sec, playerRef);
  };

  const { data: balanceData } = useFetchBalance();
  const balance = balanceData?.balance ?? 0;

  const { enrollBookmark, isLoading: isEnrollingBookmark } = useEnrollBookmark();
  const { open: openRechargeModal } = useCreditRechargeModalStore();

  const handleFloatingUnlock = useCallback(() => {
    if (isEnrollingBookmark) return;
    enrollBookmark(recipeId, {
      onError: (error) => {
        if (isAxiosError(error) && error.response?.data?.errorCode === "CREDIT_001") {
          openRechargeModal("recipe_detail");
        }
      },
    });
  }, [recipeId, isEnrollingBookmark, enrollBookmark, openRechargeModal]);

  return (
    <div className="relative w-full h-[100dvh] overflow-y-auto overscroll-y-none bg-white [-webkit-overflow-scrolling:touch]">
      <div className="fixed z-10 top-0 left-0 right-0">
        <YoutubeVideo
          videoId={videoInfo.videoId}
          title={videoInfo.videoTitle}
          containerRef={videoWrapRef as React.RefObject<HTMLDivElement>}
          onPlayerReady={(p) => (playerRef.current = p)}
        />
        <div className="absolute top-3 left-3 z-20">
          <ButtonBack onClick={() => router.back()} />
        </div>
      </div>
      <VideoPadding />
      <RecipeSummary
        title={videoInfo.videoTitle}
        description={recipeSummary.description}
        cookTime={recipeSummary.cookingTime}
        servings={recipeSummary.servings}
        formatTime={formatTime}
      />
      <div className="flex flex-col gap-3 mt-3 px-3">
        <Ingredients ingredients={ingredients} recipeId={recipeId} />
        {briefings && briefings.length > 0 && (
          <BriefingSummary briefings={briefings} />
        )}
        <div className="h-[1px] bg-gray-200 mx-1" />
        <Steps
          recipeId={recipeId}
          isEnrolled={viewStatus !== null}
          steps={steps}
          onTimeClick={handleTimeClick}
          balance={balance}
        />
      </div>
      <div className="fixed bottom-[calc(3.5rem+env(safe-area-inset-bottom))] right-4 z-10">
        {viewStatus !== null ? (
          <ButtonStartCooking onClick={routeToStep} />
        ) : (
          <ButtonUnlockRecipe
            onClick={handleFloatingUnlock}
            isLoading={isEnrollingBookmark}
          />
        )}
      </div>
    </div>
  );
};

const floatingCtaClass =
  "flex h-12 gap-2 px-5 items-center justify-center bg-orange-500 rounded-full shadow-lg shadow-orange-200/40 text-white font-bold text-base transition-all duration-150 hover:bg-orange-600 hover:shadow-xl active:scale-[0.95] active:shadow-md focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 cursor-pointer";

const ButtonStartCooking = ({ onClick }: { onClick?: () => void }) => {
  const { t } = useRecipeDetailTranslation();
  return (
    <button type="button" onClick={onClick} className={floatingCtaClass}>
      <Image
        src="/images/cook-pot.png"
        alt=""
        aria-hidden="true"
        width={22}
        height={18}
      />
      <span>{t("mobile.startCooking")}</span>
    </button>
  );
};

const ButtonUnlockRecipe = ({
  onClick,
  isLoading,
}: {
  onClick?: () => void;
  isLoading?: boolean;
}) => {
  const { t } = useRecipeDetailTranslation();
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className={`${floatingCtaClass} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <Image
        src="/images/berry/berry.png"
        alt=""
        aria-hidden="true"
        width={18}
        height={22}
      />
      <span>{isLoading ? t("lock.loading") : t("lock.viewRecipe")}</span>
    </button>
  );
};

const ButtonBack = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button
      type="button"
      aria-label="Back"
      onClick={onClick}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white
        transition-all duration-150
        hover:bg-black/60
        active:scale-[0.90] active:bg-black/70
        focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2
        cursor-pointer"
    >
      <ChevronLeft className="w-5 h-5" />
    </button>
  );
};

type RecipeSummaryProps = {
  title?: string;
  description?: string;
  cookTime?: number;
  servings?: number;
  formatTime: (min: number) => string;
};

const CookingTime = ({
  cookTime,
  formatTime,
}: {
  cookTime?: number;
  formatTime: (min: number) => string;
}) => {
  const { t } = useRecipeDetailTranslation();
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
        <div className="text-lg font-bold leading-tight text-gray-900">
          {cookTime ? formatTime(cookTime) : t("mobile.cookingTimeValue", { minutes: 0 })}
        </div>
        <div className="text-sm text-gray-600">{t("mobile.cookingTime")}</div>
      </div>
    </div>
  );
};

const ServingsInfo = ({
  servings,
}: {
  servings?: number;
}) => {
  const { t } = useRecipeDetailTranslation();
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
        <div className="text-lg font-bold leading-tight text-gray-900">
          {t("mobile.servingsValue", { count: servings })}
        </div>
        <div className="text-sm text-gray-600">{t("mobile.servingsLabel")}</div>
      </div>
    </div>
  );
};

const RecipeSummary = ({
  title,
  description,
  cookTime,
  servings,
  formatTime,
}: RecipeSummaryProps) => {
  const { t } = useRecipeDetailTranslation();
  const [descExpanded, setDescExpanded] = useState(false);

  const suffix = useMemo(() => `... ${t("summary.showMore")}`, [t]);

  const { containerRef, measurerRef, truncatedText, overflows } =
    useTextTruncation(description, suffix, 2);

  const toggleExpanded = useCallback(() => {
    if (!overflows) return;
    setDescExpanded((prev) => !prev);
  }, [overflows]);

  const handleDescriptionKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleExpanded();
      }
    },
    [toggleExpanded],
  );

  return (
    <div className="pt-3 px-4">
      <h1 className="text-xl font-bold leading-tight line-clamp-2">{title}</h1>
      <div className="h-1.5" />
      <span
        ref={measurerRef}
        aria-hidden="true"
        className="absolute invisible text-sm leading-relaxed whitespace-pre-wrap break-words"
        style={{ top: 0, left: 0, pointerEvents: "none" }}
      />
      <div
        ref={containerRef}
        role={overflows ? "button" : undefined}
        tabIndex={overflows ? 0 : undefined}
        aria-expanded={overflows ? descExpanded : undefined}
        onClick={toggleExpanded}
        onKeyDown={overflows ? handleDescriptionKeyDown : undefined}
        className={`text-sm leading-relaxed text-gray-700 ${overflows ? "cursor-pointer" : ""}`}
      >
        {descExpanded || !overflows ? (
          <>
            {description}
            {overflows && (
              <span className="text-gray-500 font-medium ml-1">
                {t("ingredients.showLess")}
              </span>
            )}
          </>
        ) : (
          <>
            {truncatedText}
            <span className="text-gray-500 font-medium">
              ... {t("summary.showMore")}
            </span>
          </>
        )}
      </div>
      <div className="pt-3 flex flex-col">
        <HorizontalLine />
        <div className="flex py-2 items-center">
          <CookingTime cookTime={cookTime} formatTime={formatTime} />
          <VerticalLine />
          <ServingsInfo servings={servings} />
        </div>
        <HorizontalLine />
      </div>
    </div>
  );
};

const HorizontalLine = () => {
  return <div className="w-full h-[1px] bg-gray-200"></div>;
};

const VerticalLine = () => {
  return <div className="w-[1px] h-full bg-gray-300"></div>;
};

