import Link from "next/link";
import { FaCheck, FaChevronRight } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { BANNER_MESSAGES } from "../model/messages";
import { useChallengeInfo } from "../model/useChallengeInfo";
import type { ChallengeInfo } from "../model/schema";

// 외부 export
export function ChallengeBanner() {
  return (
    <SSRSuspense fallback={<ChallengeBannerSkeleton />}>
      <ChallengeBannerReady />
    </SSRSuspense>
  );
}

// Ready 컴포넌트
function ChallengeBannerReady() {
  try {
    const { data } = useChallengeInfo();

    // 비참여자는 배너 숨김
    if (!data.isParticipant) {
      return null;
    }

    return <ChallengeBannerContent data={data} />;
  } catch {
    // 에러 시 배너 숨김 (홈 화면에서 에러 표시 안 함)
    return null;
  }
}

// 배너 내부 컨텐츠
function ChallengeBannerContent({ data }: { data: ChallengeInfo }) {
  const isCompleted = data.completedCount >= data.totalCount;

  return (
    <div className="px-4 py-2">
      <Link href="/challenge">
        <div
          className={`
            p-4 rounded-2xl shadow-sm transition-all duration-200 active:scale-[0.99]
            ${
              isCompleted
                ? "bg-linear-to-r from-green-100 to-emerald-50"
                : "bg-linear-to-r from-orange-100 to-amber-50"
            }
          `}
        >
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h3 className="font-bold text-gray-800">{data.challengeName}</h3>
              <div className="flex items-center gap-2.5 mt-2">
                {/* 미니 진행 박스 - 체크 표시 */}
                <div className="flex gap-1">
                  {Array.from({ length: data.totalCount }, (_, i) => {
                    const isDone = i < data.completedCount;
                    return (
                      <div
                        key={i}
                        className={`w-5 h-5 rounded-md flex items-center justify-center ${
                          isDone
                            ? isCompleted
                              ? "bg-green-500"
                              : "bg-orange-500"
                            : "bg-gray-200"
                        }`}
                      >
                        {isDone && <FaCheck className="text-white text-[10px]" />}
                      </div>
                    );
                  })}
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  {isCompleted
                    ? BANNER_MESSAGES.completed
                    : BANNER_MESSAGES.inProgress(
                        data.completedCount,
                        data.totalCount
                      )}
                </span>
              </div>
            </div>
            <div
              className={`flex items-center gap-1 text-sm font-semibold ${
                isCompleted ? "text-green-600" : "text-orange-600"
              }`}
            >
              <span className="hidden sm:inline">레시피 보기</span>
              <FaChevronRight size={12} />
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
