import { FaCheck } from "react-icons/fa";

interface ChallengeProgressBoxProps {
  index: number;
  isCompleted: boolean;
  isNext?: boolean; // 다음 목표 여부
}

export function ChallengeProgressBox({
  index,
  isCompleted,
  isNext = false,
}: ChallengeProgressBoxProps) {
  return (
    <div
      className={`
        w-16 h-16 rounded-xl flex flex-col items-center justify-center
        transition-all duration-300
        ${
          isCompleted
            ? "bg-linear-to-br from-orange-400 to-orange-500 shadow-md shadow-orange-200"
            : isNext
              ? "bg-white border-2 border-dashed border-orange-300"
              : "bg-gray-100 border-2 border-gray-200"
        }
      `}
    >
      {isCompleted ? (
        <FaCheck className="text-white text-lg mb-0.5" />
      ) : (
        <span
          className={`text-xl font-bold ${isNext ? "text-orange-400" : "text-gray-300"}`}
        >
          {index}
        </span>
      )}
      <span
        className={`text-xs font-medium ${
          isCompleted ? "text-white/90" : isNext ? "text-orange-400" : "text-gray-400"
        }`}
      >
        {index}회
      </span>
    </div>
  );
}
