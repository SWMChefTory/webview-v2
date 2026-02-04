import { useOnboardingTranslation } from "../../hooks/useOnboardingTranslation";
import { cn } from "@/lib/utils";

interface StepContainerProps {
  children: React.ReactNode;
  currentStep: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
}

export function StepContainer({
  children,
  currentStep,
  onNext,
  onPrev,
  onSkip
}: StepContainerProps) {
  const { t } = useOnboardingTranslation();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-white p-6 relative">
      {/* Skip Button (Top Right) */}
      <button
        onClick={onSkip}
        className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors px-3 py-1 rounded-full hover:bg-gray-100 z-50"
      >
        {t('common.skip')}
      </button>

      <div className="max-w-md mx-auto pt-12 h-full flex flex-col min-h-[80vh]">
        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                step <= currentStep
                  ? "bg-orange-500 w-8" // Active/Passed steps are wider
                  : "bg-gray-200 w-2"
              )}
            />
          ))}
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center w-full">
          {children}
        </div>
        
        {/* Navigation (Bottom) */}
        <div className="mt-8 flex items-center justify-between w-full pb-8">
          <button
            onClick={onPrev}
            disabled={currentStep === 1}
            className={cn(
              "px-6 py-3 rounded-full font-semibold transition-all active:scale-95",
              currentStep === 1
                ? "opacity-0 pointer-events-none" // Hide prev button on first step
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {t('common.prev')}
          </button>
          
          <button
            onClick={onNext}
            className={cn(
              "px-8 py-3 rounded-full font-semibold text-white transition-all shadow-md active:scale-95",
              "bg-orange-500 hover:bg-orange-600 hover:shadow-lg"
            )}
          >
            {t('common.next')}
          </button>
        </div>
      </div>
    </div>
  );
}
