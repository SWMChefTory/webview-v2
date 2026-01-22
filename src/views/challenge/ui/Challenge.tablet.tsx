import { useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Header, { BackButton } from "@/src/shared/ui/header/header";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { SSRErrorBoundary } from "@/src/shared/boundary/SSRErrorBoundary";
import { Skeleton } from "@/components/ui/skeleton";
import { useSafeArea } from "@/src/shared/safearea/useSafaArea";

import {
  ChallengePeriod,
  ChallengeProgressSection,
  ChallengeRecipeCard,
  ChallengeRecipeCardSkeleton,
  NonParticipantView,
  ChallengeErrorFallback,
  ChallengeBottomBar,
  useChallengeInfo,
  useChallengeRecipes,
  CHALLENGE_CONSTANTS,
  CHALLENGE_TYPE_LABELS,
  type ChallengeRecipe,
} from "@/src/features/challenge";

export function ChallengePageTablet() {
  const router = useRouter();

  useSafeArea({
    top: { color: "#F9FAFB", isExists: true },
    bottom: { color: "#F9FAFB", isExists: true },
    left: { color: "#F9FAFB", isExists: true },
    right: { color: "#F9FAFB", isExists: true },
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-[1200px] lg:max-w-[1400px] xl:max-w-[1600px] mx-auto">
          <Header
            leftContent={
              <div className="flex flex-row gap-3 items-center">
                <BackButton onClick={() => router.back()} />
                <SSRSuspense
                  fallback={<h1 className="text-2xl font-semibold">집밥 챌린지</h1>}
                >
                  <ChallengeTitleTablet />
                </SSRSuspense>
              </div>
            }
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1200px] lg:max-w-[1400px] xl:max-w-[1600px] mx-auto px-6 py-8">
          <SSRErrorBoundary
            fallbackRender={({ resetErrorBoundary }) => (
              <ChallengeErrorFallback resetErrorBoundary={resetErrorBoundary} />
            )}
          >
            <SSRSuspense fallback={<ChallengePageSkeletonTablet />}>
              <ChallengePageReadyTablet />
            </SSRSuspense>
          </SSRErrorBoundary>
        </div>
      </div>
    </div>
  );
}

function ChallengeTitleTablet() {
  const { data } = useChallengeInfo();

  if (!data.isParticipant) {
    return <h1 className="text-2xl font-semibold">집밥 챌린지</h1>;
  }

  const title = `${CHALLENGE_TYPE_LABELS[data.challengeType]} 집밥 챌린지`;
  return <h1 className="text-2xl font-semibold">{title}</h1>;
}

function ChallengePageReadyTablet() {
  const { data } = useChallengeInfo();

  if (!data.isParticipant) {
    return <NonParticipantView />;
  }

  return (
    <>
      <div className="pb-32">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <ChallengePeriod startDate={data.startDate} endDate={data.endDate} />
          <SSRSuspense fallback={<ChallengeContentSkeletonTablet />}>
            <ChallengeContentTablet
              challengeId={data.challengeId}
              startDate={data.startDate}
              endDate={data.endDate}
            />
          </SSRSuspense>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-[1200px] lg:max-w-[1400px] xl:max-w-[1600px] mx-auto">
          <ChallengeBottomBar
            challengeType={data.challengeType}
            startDate={data.startDate}
            endDate={data.endDate}
          />
        </div>
      </div>
    </>
  );
}

function ChallengeContentTablet({
  challengeId,
  startDate,
  endDate,
}: {
  challengeId: string;
  startDate: string;
  endDate: string;
}) {
  const {
    recipes,
    completeRecipes,
    totalElements,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useChallengeRecipes(challengeId);

  const completedCount = completeRecipes.length;

  return (
    <>
      <div className="p-6 border-b border-gray-100">
        <ChallengeProgressSection
          completedCount={completedCount}
          totalCount={CHALLENGE_CONSTANTS.totalCount}
          startDate={startDate}
          endDate={endDate}
        />
      </div>
      <ChallengeRecipeListTablet
        recipes={recipes}
        totalElements={totalElements}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </>
  );
}

interface ChallengeRecipeListProps {
  recipes: ChallengeRecipe[];
  totalElements: number;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
}

function ChallengeRecipeListTablet({
  recipes,
  totalElements,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
}: ChallengeRecipeListProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMore = loadMoreRef.current;
    if (!loadMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );

    observer.observe(loadMore);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  return (
    <div className="p-6">
      <div className="flex items-baseline gap-3 mb-6">
        <h2 className="text-xl font-bold text-gray-900">챌린지 레시피</h2>
        <span className="text-base text-gray-500">총 {totalElements}개</span>
      </div>

      <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {recipes.map((recipe) => (
          <div 
            key={recipe.recipeId} 
            className="hover:scale-[1.02] transition-transform duration-200"
          >
            <ChallengeRecipeCard recipe={recipe} />
          </div>
        ))}
        {isFetchingNextPage && (
          <>
            <ChallengeRecipeCardSkeleton />
            <ChallengeRecipeCardSkeleton />
            <ChallengeRecipeCardSkeleton />
          </>
        )}
      </div>

      <div ref={loadMoreRef} className="h-20" />
    </div>
  );
}

export function ChallengePageSkeletonTablet() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 space-y-6">
        <Skeleton className="w-64 h-8 mx-auto" />
        <div className="flex justify-center gap-6">
          <Skeleton className="w-20 h-20 rounded-xl" />
          <Skeleton className="w-20 h-20 rounded-xl" />
          <Skeleton className="w-20 h-20 rounded-xl" />
        </div>
        <Skeleton className="w-full h-14 rounded-xl" />
      </div>
      <div className="p-6 border-t border-gray-100">
        <Skeleton className="w-48 h-7 mb-6" />
        <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <ChallengeRecipeCardSkeleton />
          <ChallengeRecipeCardSkeleton />
          <ChallengeRecipeCardSkeleton />
          <ChallengeRecipeCardSkeleton />
          <ChallengeRecipeCardSkeleton />
          <ChallengeRecipeCardSkeleton />
        </div>
      </div>
    </div>
  );
}

function ChallengeContentSkeletonTablet() {
  return (
    <>
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-center gap-6">
          <Skeleton className="w-20 h-20 rounded-xl" />
          <Skeleton className="w-20 h-20 rounded-xl" />
          <Skeleton className="w-20 h-20 rounded-xl" />
        </div>
      </div>
      <div className="p-6">
        <Skeleton className="w-48 h-7 mb-6" />
        <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <ChallengeRecipeCardSkeleton />
          <ChallengeRecipeCardSkeleton />
          <ChallengeRecipeCardSkeleton />
          <ChallengeRecipeCardSkeleton />
          <ChallengeRecipeCardSkeleton />
          <ChallengeRecipeCardSkeleton />
        </div>
      </div>
    </>
  );
}
