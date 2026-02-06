import { useOnboardingTranslation } from "../../hooks/useOnboardingTranslation";
import { cn } from "@/lib/utils";

interface StepContainerProps {
  children: React.ReactNode;
  currentStep: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  hideNextButton?: boolean; // 마지막 단계에서 "다음" 버튼 숨기기
  innerStateIndex?: number; // 내부 상태 인덱스 (0-based): 전역 하위 스텝 계산용
}

/**
 * 전역 하위 스텝 인덱스 계산 (1~9)
 * - Step 1: 4개 하위 스텝 → 1~4
 * - Step 2: 4개 하위 스텝 → 5~8
 * - Step 3: 1개 하위 스텝 → 9
 */
const getGlobalStepIndex = (currentStep: number, innerIndex?: number): number => {
  if (currentStep === 1) return (innerIndex ?? 0) + 1; // 1~4
  if (currentStep === 2) return (innerIndex ?? 0) + 5; // 5~8
  return 9; // Step 3
};

export function StepContainer({
  children,
  currentStep,
  onNext,
  onPrev,
  onSkip,
  hideNextButton,
  innerStateIndex,
}: StepContainerProps) {
  const { t } = useOnboardingTranslation();

  // 전역 하위 스텝 인덱스 (1~9) - 첫 번째 스텝에서만 "이전" 버튼 숨김
  const globalStepIndex = getGlobalStepIndex(currentStep, innerStateIndex);
  const isFirstGlobalStep = globalStepIndex === 1;

  return (
    <div className="h-screen bg-gradient-to-b from-orange-50 via-white to-white p-4 relative flex flex-col">
      {/* Skip Button (Top Right) */}
      <button
        onClick={onSkip}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xs font-medium transition-colors px-2 py-1 rounded-full hover:bg-gray-100 z-50"
      >
        {t('common.skip')}
      </button>

      {/* Progress Dots - 간소화 */}
      <div className="flex justify-center gap-2 pt-2 pb-2">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              step <= currentStep
                ? "bg-orange-500 w-6"
                : "bg-gray-200 w-2"
            )}
          />
        ))}
      </div>

      {/* Main Content - flex-1로 중앙 정렬 */}
      <div className="flex-1 flex items-center justify-center w-full overflow-hidden">
        {children}
      </div>

      {/* Navigation (Bottom) - 고정 위치 */}
      <div className="flex items-center justify-between w-full py-3 border-t border-gray-100">
        <button
          onClick={onPrev}
          disabled={isFirstGlobalStep}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-semibold transition-all active:scale-95",
            isFirstGlobalStep
              ? "opacity-0 pointer-events-none"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
          aria-label={isFirstGlobalStep ? "첫 번째 단계입니다" : "이전 단계로 이동"}
        >
          {t('common.prev')}
        </button>

        {!hideNextButton && (
          <button
            onClick={onNext}
            className="px-6 py-2 rounded-full text-sm font-semibold text-white transition-all shadow-md active:scale-95 bg-orange-500 hover:bg-orange-600 hover:shadow-lg"
          >
            {t('common.next')}
          </button>
        )}
      </div>
    </div>
  );
}
