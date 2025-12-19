import { ChallengeProgressBox } from "./ChallengeProgressBox";
import {
  PROGRESS_MESSAGES,
  COMPLETION_SUB_MESSAGE,
} from "../model/messages";
import { calculateDday } from "../lib/formatDate";

interface ChallengeProgressSectionProps {
  completedCount: number;
  totalCount: number;
  endDate: string;
}

export function ChallengeProgressSection({
  completedCount,
  totalCount,
  endDate,
}: ChallengeProgressSectionProps) {
  const isCompleted = completedCount >= totalCount;
  const isEnded = calculateDday(endDate) === "종료";

  return (
    <div
      className={`px-4 pt-4 pb-2 transition-colors duration-500 ${
        isCompleted ? "bg-linear-to-b from-green-50 to-white" : ""
      }`}
    >
      {/* 3개 박스 */}
      <div className="flex justify-center gap-3 mb-4">
        {Array.from({ length: totalCount }, (_, i) => (
          <ChallengeProgressBox
            key={i}
            index={i + 1}
            isCompleted={i < completedCount}
            isNext={i === completedCount && !isCompleted}
          />
        ))}
      </div>

      {/* 상태별 메시지 */}
      <div className="text-center">
        {isEnded ? (
          <p className="text-lg font-semibold text-gray-500">
            챌린지가 종료되었습니다
          </p>
        ) : (
          <>
            <p
              className={`text-lg font-semibold ${
                isCompleted ? "text-green-600" : "text-gray-800"
              }`}
            >
              {isCompleted && "🎉 "}
              {PROGRESS_MESSAGES[completedCount] ?? PROGRESS_MESSAGES[0]}
            </p>
            {isCompleted && (
              <p className="text-sm text-gray-500 mt-1.5">{COMPLETION_SUB_MESSAGE}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
