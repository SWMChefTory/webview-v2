import { useOnboardingTranslation } from "../../hooks/useOnboardingTranslation";
import { cn } from "@/lib/utils";

interface StepContainerProps {
  children: React.ReactNode;
  currentStep: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  hideNextButton?: boolean; // 마지막 단계에서 "다음" 버튼 숨기기
}

export function StepContainer({
  children,
  currentStep,
  onNext,
  onPrev,
  onSkip,
  hideNextButton,
}: StepContainerProps) {
  const { t } = useOnboardingTranslation();

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
          disabled={currentStep === 1}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-semibold transition-all active:scale-95",
            currentStep === 1
              ? "opacity-0 pointer-events-none"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
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
