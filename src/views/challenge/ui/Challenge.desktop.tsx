import Header from "@/src/shared/ui/header/header";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { Skeleton } from "@/components/ui/skeleton";
import { useChallengeController } from "./Challenge.controller";
import { ChallengeRecipeList } from "./Challenge.common";

import {
  ChallengePeriod,
  ChallengeProgressSection,
  ChallengeRecipeCardSkeleton,
  NonParticipantView,
  ChallengeBottomBar,
  useChallengeInfo,
  useChallengeRecipes,
  CHALLENGE_CONSTANTS,
} from "@/src/features/challenge";

export function ChallengePageDesktop() {
  const { headerContent, renderErrorBoundary } = useChallengeController("desktop");

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-8">
          <Header leftContent={headerContent} />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto px-8 py-12 lg:py-16">
          {renderErrorBoundary(
            <SSRSuspense fallback={<ChallengePageSkeletonDesktop />}>
              <ChallengePageReadyDesktop />
            </SSRSuspense>
          )}
        </div>
      </div>
    </div>
  );
}

function ChallengePageReadyDesktop() {
  const { data } = useChallengeInfo();

  if (!data.isParticipant) {
    return <NonParticipantView />;
  }

  return (
    <>
      <div className="pb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <ChallengePeriod startDate={data.startDate} endDate={data.endDate} />
          <SSRSuspense fallback={<ChallengeContentSkeletonDesktop />}>
            <ChallengeContentDesktop
              challengeId={data.challengeId}
              startDate={data.startDate}
              endDate={data.endDate}
            />
          </SSRSuspense>
        </div>
      </div>
      <div className="sticky bottom-0 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] -mx-8 px-8">
        <ChallengeBottomBar
          challengeType={data.challengeType}
          startDate={data.startDate}
          endDate={data.endDate}
        />
      </div>
    </>
  );
}

function ChallengeContentDesktop({
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
      <div className="p-8 border-b border-gray-100">
        <ChallengeProgressSection
          completedCount={completedCount}
          totalCount={CHALLENGE_CONSTANTS.totalCount}
          startDate={startDate}
          endDate={endDate}
        />
      </div>
      <ChallengeRecipeList
        recipes={recipes}
        totalElements={totalElements}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
        variant="desktop"
      />
    </>
  );
}

export function ChallengePageSkeletonDesktop() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-8 space-y-8">
        <Skeleton className="w-80 h-10 mx-auto" />
        <div className="flex justify-center gap-8">
          <Skeleton className="w-24 h-24 rounded-2xl" />
          <Skeleton className="w-24 h-24 rounded-2xl" />
          <Skeleton className="w-24 h-24 rounded-2xl" />
        </div>
        <Skeleton className="w-full h-16 rounded-2xl" />
      </div>
      <div className="p-8 border-t border-gray-100">
        <Skeleton className="w-60 h-10 mb-8" />
        <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 lg:gap-8">
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

function ChallengeContentSkeletonDesktop() {
  return (
    <>
      <div className="p-8 border-b border-gray-100">
        <div className="flex justify-center gap-8">
          <Skeleton className="w-24 h-24 rounded-2xl" />
          <Skeleton className="w-24 h-24 rounded-2xl" />
          <Skeleton className="w-24 h-24 rounded-2xl" />
        </div>
      </div>
      <div className="p-8">
        <Skeleton className="w-60 h-8 mb-8" />
        <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
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
