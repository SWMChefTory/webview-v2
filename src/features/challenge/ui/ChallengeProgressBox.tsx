import { FaCheck } from "react-icons/fa";

interface ChallengeProgressBoxProps {
  index: number;
  isCompleted: boolean;
  isNext?: boolean; // 다음 목표 여부
  isDisabled?: boolean; // 시작 전 비활성 상태
}

export function ChallengeProgressBox({
  index,
  isCompleted,
  isNext = false,
  isDisabled = false,
}: ChallengeProgressBoxProps) {
  // 스타일 결정
  const getBoxStyle = () => {
    if (isCompleted) {
      return "bg-linear-to-br from-orange-400 to-orange-500 shadow-md shadow-orange-200";
    }
    if (isDisabled) {
      // 시작 전: 파란색 테두리 + 연한 배경
      return "bg-blue-50/50 border-2 border-dashed border-blue-200";
    }
    if (isNext) {
      return "bg-white border-2 border-dashed border-orange-300";
    }
    return "bg-gray-100 border-2 border-gray-200";
  };

  // 숫자 색상 결정
  const getNumberColor = () => {
    if (isCompleted) return "text-white";
    if (isDisabled) return "text-blue-300";
    if (isNext) return "text-orange-400";
    return "text-gray-300";
  };

  // 라벨 색상 결정
  const getLabelColor = () => {
    if (isCompleted) return "text-white/90";
    if (isDisabled) return "text-blue-300";
    if (isNext) return "text-orange-400";
    return "text-gray-400";
  };

  return (
    <div
      className={`
        w-16 h-16 rounded-xl flex flex-col items-center justify-center
        transition-all duration-300
        ${getBoxStyle()}
      `}
    >
      {isCompleted ? (
        <FaCheck className="text-white text-lg mb-0.5" />
      ) : (
        <span className={`text-xl font-bold ${getNumberColor()}`}>{index}</span>
      )}
      <span className={`text-xs font-medium ${getLabelColor()}`}>
        {index}회
      </span>
    </div>
  );
}
