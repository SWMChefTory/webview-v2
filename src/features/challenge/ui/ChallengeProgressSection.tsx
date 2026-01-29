import { ChallengeProgressBox } from "./ChallengeProgressBox";
import {
  PROGRESS_MESSAGES,
  COMPLETION_SUB_MESSAGE,
  BEFORE_START_MESSAGES,
} from "../model/messages";
import { getChallengeStatus } from "../lib/formatDate";

interface ChallengeProgressSectionProps {
  completedCount: number;
  totalCount: number;
  startDate: string;
  endDate: string;
}

export function ChallengeProgressSection({
  completedCount,
  totalCount,
  startDate,
  endDate,
}: ChallengeProgressSectionProps) {
  const status = getChallengeStatus(startDate, endDate);
  const isCompleted = completedCount >= totalCount;
  const isBefore = status === "BEFORE";
  const isEnded = status === "ENDED";

  // 배경 스타일 결정
  const getBackgroundStyle = () => {
    if (isCompleted) return "bg-linear-to-b from-green-50 to-white";
    if (isBefore) return "bg-linear-to-b from-blue-50/50 to-white";
    return "";
  };

  return (
    <div
      className={`px-4 lg:px-6 xl:px-8 pt-4 lg:pt-6 pb-2 lg:pb-4 transition-colors duration-500 ${getBackgroundStyle()}`}
    >
      {/* 3개 박스 */}
      <div className="flex justify-center gap-3 lg:gap-4 xl:gap-5 mb-4 lg:mb-6">
        {Array.from({ length: totalCount }, (_, i) => (
          <ChallengeProgressBox
            key={i}
            index={i + 1}
            isCompleted={i < completedCount}
            isNext={i === completedCount && !isCompleted && !isBefore}
            isDisabled={isBefore}
          />
        ))}
      </div>

      {/* 상태별 메시지 */}
      <div className="text-center">
        {isBefore ? (
          // 시작 전
          <p className="text-lg lg:text-xl xl:text-2xl font-semibold text-blue-600">
            {BEFORE_START_MESSAGES.progress}
          </p>
        ) : isEnded ? (
          // 종료
          <p className="text-lg lg:text-xl xl:text-2xl font-semibold text-gray-500">
            챌린지가 종료되었습니다
          </p>
        ) : (
          // 진행 중
          <>
            <p
              className={`text-lg lg:text-xl xl:text-2xl font-semibold ${
                isCompleted ? "text-green-600" : "text-gray-800"
              }`}
            >
              {isCompleted && "🎉 "}
              {PROGRESS_MESSAGES[completedCount] ?? PROGRESS_MESSAGES[0]}
            </p>
            {isCompleted && (
              <p className="text-sm lg:text-base text-gray-500 mt-1.5 lg:mt-2">
                {COMPLETION_SUB_MESSAGE}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
