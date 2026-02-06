import type { RechargeStep } from "../types";
import { useRechargeTranslation } from "../hooks/useRechargeTranslation";

interface StepProgressProps {
  currentStep: RechargeStep;
}

export function StepProgress({ currentStep }: StepProgressProps) {
  const { t } = useRechargeTranslation();

  const steps: { key: RechargeStep; labelKey: string }[] = [
    { key: 'clipboard', labelKey: 'steps.clipboard' },
    { key: 'kakao', labelKey: 'steps.kakao' },
    { key: 'success', labelKey: 'steps.success' },
  ];

  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="flex items-center justify-between gap-2">
      {steps.map((step, index) => {
        const isActive = step.key === currentStep;
        const isCompleted = index < currentIndex;

        return (
          <div key={step.key} className="flex items-center flex-1">
            {/* Step circle */}
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                isActive
                  ? 'bg-orange-500 text-white'
                  : isCompleted
                    ? 'bg-orange-200 text-orange-600'
                    : 'bg-gray-200 text-gray-500'
              }`}
              aria-current={isActive ? 'step' : undefined}
              aria-label={`${t(step.labelKey)} ${isActive ? '(현재 단계)' : isCompleted ? '(완료됨)' : ''}`}
            >
              {isCompleted ? '✓' : index + 1}
            </div>

            {/* Step label */}
            <span
              className={`ml-2 text-sm font-medium ${
                isActive ? 'text-orange-600' : isCompleted ? 'text-orange-500' : 'text-gray-400'
              }`}
            >
              {t(step.labelKey)}
            </span>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 ${
                  index < currentIndex ? 'bg-orange-300' : 'bg-gray-200'
                }`}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
