import { FaCheck } from "react-icons/fa";

interface ChallengeProgressBoxProps {
  index: number;
  isCompleted: boolean;
}

export function ChallengeProgressBox({
  index,
  isCompleted,
}: ChallengeProgressBoxProps) {
  return (
    <div
      className={`
        w-16 h-16 rounded-lg border-2 flex flex-col items-center justify-center
        ${
          isCompleted
            ? "bg-orange-100 border-orange-500"
            : "bg-gray-100 border-gray-300"
        }
      `}
    >
      {isCompleted && <FaCheck className="text-orange-500 mb-1" />}
      <span
        className={`text-sm ${isCompleted ? "text-orange-600" : "text-gray-500"}`}
      >
        {index}회
      </span>
    </div>
  );
}
