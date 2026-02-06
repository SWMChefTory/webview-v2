interface StepProgressDotsProps {
  currentIndex: number;
  totalCount: number;
  ariaLabel?: string;
}

/**
 * 온보딩 진행률 점 인디케이터 컴포넌트
 * 현재 단계는 길게 표시하고, 완료된 단계와 미진행 단계를 구분합니다.
 */
export function StepProgressDots({
  currentIndex,
  totalCount,
  ariaLabel = "온보딩 진행률",
}: StepProgressDotsProps) {
  return (
    <div
      className="flex gap-1.5"
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuemin={1}
      aria-valuemax={totalCount}
      aria-valuenow={currentIndex + 1}
    >
      {Array.from({ length: totalCount }).map((_, idx) => (
        <div
          key={idx}
          className={`h-2.5 rounded-full transition-all duration-300 ${
            idx === currentIndex
              ? "bg-orange-500 w-6"
              : idx < currentIndex
                ? "bg-orange-500 w-2.5"
                : "bg-gray-300 w-2.5"
          }`}
          aria-label={`${idx + 1}단계 ${
            idx === currentIndex ? "현재" : idx < currentIndex ? "완료" : "미진행"
          }`}
          aria-current={idx === currentIndex ? "true" : undefined}
        />
      ))}
    </div>
  );
}
