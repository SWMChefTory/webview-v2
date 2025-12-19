import { ChallengeProgressBox } from "./ChallengeProgressBox";
import {
  PROGRESS_MESSAGES,
  COMPLETION_SUB_MESSAGE,
} from "../model/messages";

interface ChallengeProgressSectionProps {
  completedCount: number;
  totalCount: number;
}

export function ChallengeProgressSection({
  completedCount,
  totalCount,
}: ChallengeProgressSectionProps) {
  const isCompleted = completedCount >= totalCount;

  return (
    <div
      className={`px-4 py-6 transition-colors duration-500 ${
        isCompleted ? "bg-linear-to-b from-green-50 to-white" : ""
      }`}
    >
      <h2 className="text-lg font-bold mb-5 text-center">이번 주 진행 상황</h2>

      {/* 3개 박스 */}
      <div className="flex justify-center gap-3 mb-5">
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
      </div>
    </div>
  );
}
