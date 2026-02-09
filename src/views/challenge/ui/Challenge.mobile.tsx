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

export function ChallengePageMobile() {
  const { headerContent, renderErrorBoundary } = useChallengeController("mobile");

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-white">
      <Header leftContent={headerContent} />
      <div className="flex flex-col w-full h-full overflow-y-scroll">
        {renderErrorBoundary(
          <SSRSuspense fallback={<ChallengePageSkeletonMobile />}>
            <ChallengePageReadyMobile />
          </SSRSuspense>
        )}
      </div>
    </div>
  );
}

function ChallengePageReadyMobile() {
  const { data } = useChallengeInfo();

  if (!data.isParticipant) {
    return <NonParticipantView />;
  }

  return (
    <>
      <div className="pb-28">
        <ChallengePeriod startDate={data.startDate} endDate={data.endDate} />
        <SSRSuspense fallback={<ChallengeContentSkeletonMobile />}>
          <ChallengeContentMobile
            challengeId={data.challengeId}
            startDate={data.startDate}
            endDate={data.endDate}
          />
        </SSRSuspense>
      </div>
      <ChallengeBottomBar
        challengeType={data.challengeType}
        startDate={data.startDate}
        endDate={data.endDate}
      />
    </>
  );
}

function ChallengeContentMobile({
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
      <ChallengeProgressSection
        completedCount={completedCount}
        totalCount={CHALLENGE_CONSTANTS.totalCount}
        startDate={startDate}
        endDate={endDate}
      />
      <ChallengeRecipeList
        recipes={recipes}
        totalElements={totalElements}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
        variant="mobile"
      />
    </>
  );
}

export function ChallengePageSkeletonMobile() {
  return (
    <div className="px-4 py-6 space-y-4">
      <Skeleton className="w-48 h-6 mx-auto" />
      <div className="flex justify-center gap-4">
        <Skeleton className="w-16 h-16 rounded-lg" />
        <Skeleton className="w-16 h-16 rounded-lg" />
        <Skeleton className="w-16 h-16 rounded-lg" />
      </div>
      <Skeleton className="w-full h-12 rounded-lg" />
      <div className="grid grid-cols-2 gap-4 mt-8">
        <ChallengeRecipeCardSkeleton />
        <ChallengeRecipeCardSkeleton />
      </div>
    </div>
  );
}

function ChallengeContentSkeletonMobile() {
  return (
    <>
      <div className="mx-4 my-3 px-4 py-4 bg-gray-50 rounded-xl">
        <div className="flex justify-center gap-4">
          <Skeleton className="w-16 h-16 rounded-lg" />
          <Skeleton className="w-16 h-16 rounded-lg" />
          <Skeleton className="w-16 h-16 rounded-lg" />
        </div>
      </div>
      <div className="px-4 pb-6">
        <Skeleton className="w-40 h-6 mb-4" />
        <div className="grid grid-cols-2 gap-4">
          <ChallengeRecipeCardSkeleton />
          <ChallengeRecipeCardSkeleton />
          <ChallengeRecipeCardSkeleton />
          <ChallengeRecipeCardSkeleton />
        </div>
      </div>
    </>
  );
}
