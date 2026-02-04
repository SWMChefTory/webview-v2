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
  const { t } = useTranslation("onboarding");
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white p-6">
      <div className="max-w-3xl mx-auto">
        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                step <= currentStep
                  ? "bg-orange-500"
                  : "bg-gray-300"
              )}
            />
          ))}
        </div>
        
        {/* Main Content */}
        <div className="min-h-[60vh] flex items-center justify-center">
          {children}
        </div>
        
        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={onPrev}
            disabled={currentStep === 1}
            className={cn(
              "px-6 py-3 rounded-full font-semibold",
              "bg-gray-200 text-gray-700",
              "hover:bg-gray-300 disabled:opacity-50",
              "transition"
            )}
          >
            {t('common.prev')}
          </button>
          
          <button
            onClick={onSkip}
            className={cn(
              "px-6 py-3 rounded-full font-semibold",
              "text-gray-600 hover:text-gray-800",
              "transition"
            )}
          >
            {t('common.skip')}
          </button>
          
          <button
            onClick={onNext}
            className={cn(
              "px-6 py-3 rounded-full font-semibold",
              "bg-orange-500 text-white",
              "hover:bg-orange-600",
              "transition"
            )}
          >
            {t('common.next')}
          </button>
        </div>
      </div>
    </div>
  );
}
