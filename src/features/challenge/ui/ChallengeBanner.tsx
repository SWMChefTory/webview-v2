import Image from "next/image";
import { useRouter } from "next/router";
import { FaCheck, FaChevronRight } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { SSRErrorBoundary } from "@/src/shared/boundary/SSRErrorBoundary";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { BANNER_MESSAGES } from "../model/messages";
import { useChallengeInfo } from "../model/useChallengeInfo";
import { useChallengeRecipes } from "../model/useChallengeRecipes";
import { CHALLENGE_CONSTANTS } from "../model/constants";
import type { ChallengeType } from "../model/types";
import {
  getChallengeStatus,
  calculateDaysUntilStart,
} from "../lib/formatDate";

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
        <ChallengeBannerWithRecipes
          challengeId={data.challengeId}
          challengeType={data.challengeType}
          startDate={data.startDate}
          endDate={data.endDate}
        />
      </SSRSuspense>
    </SSRErrorBoundary>
  );
}

// 레시피 데이터 로드 컴포넌트
function ChallengeBannerWithRecipes({
  challengeId,
  challengeType,
  startDate,
  endDate,
}: {
  challengeId: string;
  challengeType: ChallengeType;
  startDate: string;
  endDate: string;
}) {
  const { completeRecipes } = useChallengeRecipes(challengeId);
  const completedCount = completeRecipes.length;
  const totalCount = CHALLENGE_CONSTANTS.totalCount;
  const challengeName = CHALLENGE_CONSTANTS.name;

  return (
    <ChallengeBannerContent
      challengeId={challengeId}
      challengeType={challengeType}
      challengeName={challengeName}
      completedCount={completedCount}
      totalCount={totalCount}
      startDate={startDate}
      endDate={endDate}
    />
  );
}

// 배너 내부 컨텐츠
interface ChallengeBannerContentProps {
  challengeId: string;
  challengeType: ChallengeType;
  challengeName: string;
  completedCount: number;
  totalCount: number;
  startDate: string;
  endDate: string;
}

function ChallengeBannerContent({
  challengeId,
  challengeType,
  challengeName,
  completedCount,
  totalCount,
  startDate,
  endDate,
}: ChallengeBannerContentProps) {
  const router = useRouter();
  const status = getChallengeStatus(startDate, endDate);
  const isCompleted = completedCount >= totalCount;
  const isBefore = status === "BEFORE";

  // 배너 클릭 핸들러
  const handleClick = () => {
    track(AMPLITUDE_EVENT.CHALLENGE_BANNER_CLICK, {
      challenge_id: challengeId,
      challenge_type: challengeType,
      status,
      completed_count: completedCount,
    });
    router.push("/challenge");
  };

  // 오버레이 스타일 결정
  const getOverlayStyle = () => {
    if (isCompleted) {
      return "bg-linear-to-r from-green-100/50 via-green-50/20 to-transparent";
    }
    if (isBefore) {
      return "bg-linear-to-r from-blue-100/50 via-blue-50/20 to-transparent";
    }
    return "bg-linear-to-r from-white/50 via-white/20 to-transparent";
  };

  // 서브 메시지 결정
  const getSubMessage = () => {
    if (isBefore) {
      const dday = calculateDaysUntilStart(startDate);
      return BANNER_MESSAGES.beforeStart(dday);
    }
    if (isCompleted) {
      return BANNER_MESSAGES.completed;
    }
    return BANNER_MESSAGES.inProgress(completedCount, totalCount);
  };

  // 미니 박스 스타일 결정
  const getMiniBoxStyle = (isDone: boolean) => {
    if (isDone) {
      return isCompleted ? "bg-green-500" : "bg-orange-500";
    }
    if (isBefore) {
      return "bg-blue-100 border-2 border-blue-300";
    }
    return "bg-gray-200 border-2 border-orange-400";
  };

  // 화살표 색상 결정
  const getArrowColor = () => {
    if (isCompleted) return "text-green-600";
    if (isBefore) return "text-blue-500";
    return "text-orange-500";
  };

  return (
    <div className="px-4 py-2">
      <div
        onClick={handleClick}
        className="relative overflow-hidden rounded-2xl shadow-sm transition-all duration-200 active:scale-[0.99] cursor-pointer"
        style={{
          backgroundImage: "url('/images/challenge/challenge-banner.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
          {/* 그라데이션 오버레이 (왼쪽 텍스트 가독성 확보) */}
          <div className={`absolute inset-0 ${getOverlayStyle()}`} />
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
                          className={`w-5 h-5 rounded-md flex items-center justify-center ${getMiniBoxStyle(isDone)}`}
                        >
                          {isDone && (
                            <FaCheck className="text-white text-[10px]" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <span
                    className="text-sm text-gray-700 font-semibold"
                    style={{ textShadow: "0 1px 2px rgba(255,255,255,0.8)" }}
                  >
                    {getSubMessage()}
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
                <FaChevronRight size={14} className={getArrowColor()} />
              </div>
            </div>
          </div>
        </div>
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
