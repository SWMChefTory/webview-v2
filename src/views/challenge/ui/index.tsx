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

// ============================================
// 메인 페이지 컴포넌트
// ============================================

function ChallengePage() {
  const router = useRouter();

  useSafeArea({
    top: { color: "#FFFFFF", isExists: true },
    bottom: { color: "#FFFFFF", isExists: true },
    left: { color: "#FFFFFF", isExists: true },
    right: { color: "#FFFFFF", isExists: true },
  });

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-white">
      <Header
        leftContent={
          <div className="flex flex-row gap-3 items-center">
            <BackButton onClick={() => router.back()} />
            <SSRSuspense
              fallback={<h1 className="text-xl font-semibold">집밥 챌린지</h1>}
            >
              <ChallengeTitle />
            </SSRSuspense>
          </div>
        }
      />
      <div className="flex flex-col w-full h-full overflow-y-scroll">
        <SSRErrorBoundary
          fallbackRender={({ resetErrorBoundary }) => (
            <ChallengeErrorFallback resetErrorBoundary={resetErrorBoundary} />
          )}
        >
          <SSRSuspense fallback={<ChallengePageSkeleton />}>
            <ChallengePageReady />
          </SSRSuspense>
        </SSRErrorBoundary>
      </div>
    </div>
  );
}

// ============================================
// 타이틀 컴포넌트 (타입별 동적 표시)
// ============================================

function ChallengeTitle() {
  const { data } = useChallengeInfo();

  // 비참여자는 기본 타이틀
  if (!data.isParticipant) {
    return <h1 className="text-xl font-semibold">집밥 챌린지</h1>;
  }

  // 참여자는 타입별 타이틀
  const title = `${CHALLENGE_TYPE_LABELS[data.challengeType]} 집밥 챌린지`;
  return <h1 className="text-xl font-semibold">{title}</h1>;
}

// ============================================
// Ready 컴포넌트 (훅 사용)
// ============================================

function ChallengePageReady() {
  const { data } = useChallengeInfo();

  // 비참여자
  if (!data.isParticipant) {
    return <NonParticipantView />;
  }

  // 참여자
  return (
    <>
      <div className="pb-28">
        {/* 기간 표시 */}
        <ChallengePeriod startDate={data.startDate} endDate={data.endDate} />

        {/* 진행 상황 + 레시피 목록 (challengeId 의존) */}
        <SSRSuspense fallback={<ChallengeContentSkeleton />}>
          <ChallengeContent
            challengeId={data.challengeId}
            startDate={data.startDate}
            endDate={data.endDate}
          />
        </SSRSuspense>
      </div>

      {/* 하단 고정 바 */}
      <ChallengeBottomBar
        challengeType={data.challengeType}
        startDate={data.startDate}
        endDate={data.endDate}
      />
    </>
  );
}

// ============================================
// 챌린지 콘텐츠 (진행 상황 + 레시피 목록)
// ============================================

function ChallengeContent({
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

  // 완료 개수 = completeRecipes 배열 길이
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
      />
    </>
  );
}

// ============================================
// 레시피 목록 섹션
// ============================================

interface ChallengeRecipeListProps {
  recipes: ChallengeRecipe[];
  totalElements: number;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
}

function ChallengeRecipeList({
  recipes,
  totalElements,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
}: ChallengeRecipeListProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver로 무한 스크롤
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
    <div className="px-4 pb-6">
      <div className="flex items-baseline gap-2 mb-4">
        <h2 className="text-lg font-bold">챌린지 레시피</h2>
        <span className="text-sm text-gray-500">총 {totalElements}개</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {recipes.map((recipe) => (
          <ChallengeRecipeCard key={recipe.recipeId} recipe={recipe} />
        ))}
        {isFetchingNextPage && (
          <>
            <ChallengeRecipeCardSkeleton />
            <ChallengeRecipeCardSkeleton />
          </>
        )}
      </div>

      <div ref={loadMoreRef} className="h-20" />
    </div>
  );
}

// ============================================
// Skeleton 컴포넌트
// ============================================

function ChallengePageSkeleton() {
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

function ChallengeContentSkeleton() {
  return (
    <>
      {/* Progress Section Skeleton */}
      <div className="mx-4 my-3 px-4 py-4 bg-gray-50 rounded-xl">
        <div className="flex justify-center gap-4">
          <Skeleton className="w-16 h-16 rounded-lg" />
          <Skeleton className="w-16 h-16 rounded-lg" />
          <Skeleton className="w-16 h-16 rounded-lg" />
        </div>
      </div>
      {/* Recipe List Skeleton */}
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

export default ChallengePage;
