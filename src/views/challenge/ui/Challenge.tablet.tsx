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

export function ChallengePageTablet() {
  const { headerContent, renderErrorBoundary } = useChallengeController("tablet");

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-[1024px] mx-auto">
          <Header leftContent={headerContent} />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1024px] mx-auto px-8 py-10">
          {renderErrorBoundary(
            <SSRSuspense fallback={<ChallengePageSkeletonTablet />}>
              <ChallengePageReadyTablet />
            </SSRSuspense>
          )}
        </div>
      </div>
    </div>
  );
}

function ChallengePageReadyTablet() {
  const { data } = useChallengeInfo();

  if (!data.isParticipant) {
    return <NonParticipantView />;
  }

  return (
    <>
      <div className="pb-36">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe">
        <div className="max-w-[1024px] mx-auto">
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
      <ChallengeRecipeList
        recipes={recipes}
        totalElements={totalElements}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
        variant="tablet"
      />
    </>
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
        <div className="grid grid-cols-3 gap-6">
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
        <div className="grid grid-cols-3 gap-6">
          <ChallengeRecipeCardSkeleton />
          <ChallengeRecipeCardSkeleton />
          <ChallengeRecipeCardSkeleton />
        </div>
      </div>
    </>
  );
}
