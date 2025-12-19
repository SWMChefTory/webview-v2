import Link from "next/link";
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
            p-4 rounded-xl shadow-sm
            ${
              isCompleted
                ? "bg-gradient-to-r from-green-100 to-emerald-100"
                : "bg-gradient-to-r from-orange-100 to-amber-100"
            }
          `}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-gray-800">{data.challengeName}</h3>
              <div className="flex items-center gap-2 mt-2">
                {/* 미니 진행 박스 */}
                <div className="flex gap-1">
                  {Array.from({ length: data.totalCount }, (_, i) => (
                    <div
                      key={i}
                      className={`w-4 h-4 rounded ${
                        i < data.completedCount ? "bg-orange-500" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {isCompleted
                    ? BANNER_MESSAGES.completed
                    : BANNER_MESSAGES.inProgress(
                        data.completedCount,
                        data.totalCount
                      )}
                </span>
              </div>
            </div>
            <span className="text-orange-600 text-sm font-medium">
              레시피 확인하기 →
            </span>
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
      <Skeleton className="w-full h-[80px] rounded-xl" />
    </div>
  );
}
