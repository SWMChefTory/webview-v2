import Link from "next/link";
import Image from "next/image";
import { FaCheck, FaChevronRight } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { SSRErrorBoundary } from "@/src/shared/boundary/SSRErrorBoundary";
import { BANNER_MESSAGES } from "../model/messages";
import { useChallengeInfo } from "../model/useChallengeInfo";
import { useChallengeRecipes } from "../model/useChallengeRecipes";
import { CHALLENGE_CONSTANTS } from "../model/constants";

// 외부 export
export function ChallengeBanner() {
  return (
    <SSRErrorBoundary fallbackRender={() => null}>
      <SSRSuspense fallback={<ChallengeBannerSkeleton />}>
        <ChallengeBannerReady />
      </SSRSuspense>
    </SSRErrorBoundary>
  );
}

// Ready 컴포넌트 - 참여자 여부 확인
function ChallengeBannerReady() {
  const { data } = useChallengeInfo();

  // 비참여자는 배너 숨김
  if (!data.isParticipant) {
    return null;
  }

  // 참여자면 레시피 데이터 로드
  return (
    <SSRErrorBoundary fallbackRender={() => null}>
      <SSRSuspense fallback={<ChallengeBannerSkeleton />}>
        <ChallengeBannerWithRecipes challengeId={data.challengeId} />
      </SSRSuspense>
    </SSRErrorBoundary>
  );
}

// 레시피 데이터 로드 컴포넌트
function ChallengeBannerWithRecipes({ challengeId }: { challengeId: string }) {
  const { completeRecipes } = useChallengeRecipes(challengeId);
  const completedCount = completeRecipes.length;
  const totalCount = CHALLENGE_CONSTANTS.totalCount;
  const challengeName = CHALLENGE_CONSTANTS.name;

  return (
    <ChallengeBannerContent
      challengeName={challengeName}
      completedCount={completedCount}
      totalCount={totalCount}
    />
  );
}

// 배너 내부 컨텐츠
interface ChallengeBannerContentProps {
  challengeName: string;
  completedCount: number;
  totalCount: number;
}

function ChallengeBannerContent({
  challengeName,
  completedCount,
  totalCount,
}: ChallengeBannerContentProps) {
  const isCompleted = completedCount >= totalCount;

  return (
    <div className="px-4 py-2">
      <Link href="/challenge">
        <div
          className="relative overflow-hidden rounded-2xl shadow-sm transition-all duration-200 active:scale-[0.99]"
          style={{
            backgroundImage: "url('/images/challenge/challenge-banner.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* 그라데이션 오버레이 (왼쪽 텍스트 가독성 확보) */}
          <div
            className={`absolute inset-0 ${
              isCompleted
                ? "bg-linear-to-r from-green-100/50 via-green-50/20 to-transparent"
                : "bg-linear-to-r from-white/50 via-white/20 to-transparent"
            }`}
          />
          {/* 콘텐츠 */}
          <div className="relative p-4">
          <div className="flex items-center gap-3">
            {/* 왼쪽: 챌린지 정보 */}
            <div className="flex-1 min-w-0">
              <h3
                className="font-extrabold text-gray-900"
                style={{ textShadow: "0 1px 3px rgba(255,255,255,0.9)" }}
              >
                {challengeName}
              </h3>
              <div className="flex items-center gap-2.5 mt-2">
                {/* 미니 진행 박스 - 체크 표시 */}
                <div className="flex gap-1">
                  {Array.from({ length: totalCount }, (_, i) => {
                    const isDone = i < completedCount;
                    return (
                      <div
                        key={i}
                        className={`w-5 h-5 rounded-md flex items-center justify-center ${
                          isDone
                            ? isCompleted
                              ? "bg-green-500"
                              : "bg-orange-500"
                            : "bg-gray-200 border-2 border-orange-400"
                        }`}
                      >
                        {isDone && <FaCheck className="text-white text-[10px]" />}
                      </div>
                    );
                  })}
                </div>
                <span
                  className="text-sm text-gray-700 font-semibold"
                  style={{ textShadow: "0 1px 2px rgba(255,255,255,0.8)" }}
                >
                  {isCompleted
                    ? BANNER_MESSAGES.completed
                    : BANNER_MESSAGES.inProgress(completedCount, totalCount)}
                </span>
              </div>
            </div>

            {/* 오른쪽: 캐릭터 + 화살표 */}
            <div className="flex items-center gap-2 shrink-0">
              <Image
                src="/images/challenge/challeng-banner-tory.png"
                alt="토리 캐릭터"
                width={56}
                height={56}
                className="object-contain"
              />
              <FaChevronRight
                size={14}
                className={isCompleted ? "text-green-600" : "text-orange-500"}
              />
            </div>
          </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

// Skeleton 컴포넌트
function ChallengeBannerSkeleton() {
  return (
    <div className="px-4 py-2">
      <Skeleton className="w-full h-20 rounded-2xl" />
    </div>
  );
}
