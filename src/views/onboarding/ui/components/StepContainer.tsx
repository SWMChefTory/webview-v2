import { useOnboardingTranslation } from "../../hooks/useOnboardingTranslation";
import { cn } from "@/lib/utils";

/** 각 스텝의 내부 하위 스텝 수 (그룹핑용) */
const STEP_GROUPS = [4, 4, 1] as const;
const TOTAL_STEPS = STEP_GROUPS.reduce((a, b) => a + b, 0); // 9

interface StepContainerProps {
  children: React.ReactNode;
  currentStep: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  hideSkipButton?: boolean;
  hideNextButton?: boolean;
  innerStateIndex?: number;
  /** 하단 네비게이션 가운데에 표시할 커스텀 콘텐츠 (예: 마이크 버튼) */
  bottomCenter?: React.ReactNode;
}

/**
 * 전역 하위 스텝 인덱스 계산 (1~9)
 * - Step 1: 4개 하위 스텝 → 1~4
 * - Step 2: 4개 하위 스텝 → 5~8
 * - Step 3: 1개 하위 스텝 → 9
 */
const getGlobalStepIndex = (currentStep: number, innerIndex?: number): number => {
  if (currentStep === 1) return (innerIndex ?? 0) + 1;
  if (currentStep === 2) return (innerIndex ?? 0) + 5;
  return 9;
};

export function StepContainer({
  children,
  currentStep,
  onNext,
  onPrev,
  onSkip,
  hideSkipButton,
  hideNextButton,
  innerStateIndex,
  bottomCenter,
}: StepContainerProps) {
  const { t } = useOnboardingTranslation();

  const globalStepIndex = getGlobalStepIndex(currentStep, innerStateIndex);
  const isFirstGlobalStep = globalStepIndex === 1;

  return (
    <div className="h-dvh bg-gradient-to-b from-orange-50 via-white to-white p-4 relative flex flex-col">
      {/* Skip Button (Top Right) */}
      {!hideSkipButton && (
        <button
          onClick={onSkip}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-xs font-medium transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-gray-100 z-50"
          aria-label="온보딩 건너뛰기"
        >
          {t('common.skip')}
        </button>
      )}

      {/* Segmented Progress Bar (4+4+1 그룹핑) */}
      <div
        className="flex justify-center items-center gap-3 pt-2 pb-2"
        role="progressbar"
        aria-label="온보딩 진행률"
        aria-valuemin={1}
        aria-valuemax={TOTAL_STEPS}
        aria-valuenow={globalStepIndex}
      >
        {STEP_GROUPS.map((count, groupIdx) => {
          const groupStart = STEP_GROUPS.slice(0, groupIdx).reduce((a, b) => a + b, 0);
          return (
            <div key={groupIdx} className="flex gap-1">
              {Array.from({ length: count }).map((_, segIdx) => {
                const globalIdx = groupStart + segIdx;
                return (
                  <div
                    key={globalIdx}
                    className={cn(
                      "h-1 rounded-full transition-all duration-300 w-5",
                      globalIdx < globalStepIndex
                        ? "bg-orange-500"
                        : "bg-gray-200"
                    )}
                  />
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center w-full overflow-hidden">
        {children}
      </div>

      {/* Navigation (Bottom) */}
      <div className="flex items-center justify-between w-full py-3">
        <button
          onClick={onPrev}
          disabled={isFirstGlobalStep}
          className={cn(
            "min-h-[44px] min-w-[44px] px-4 py-2 rounded-full text-sm font-semibold transition-all active:scale-95",
            isFirstGlobalStep
              ? "opacity-0 pointer-events-none"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
          aria-label={isFirstGlobalStep ? "첫 번째 단계입니다" : "이전 단계로 이동"}
        >
          {t('common.prev')}
        </button>

        {/* Center: 커스텀 콘텐츠 (마이크 등) 또는 빈 공간 */}
        {bottomCenter && (
          <div className="flex flex-col items-center">
            {bottomCenter}
          </div>
        )}

        {!hideNextButton && !bottomCenter && (
          <button
            onClick={onNext}
            className="min-h-[44px] px-6 py-2 rounded-full text-sm font-semibold text-white transition-all shadow-md active:scale-95 bg-orange-500 hover:bg-orange-600 hover:shadow-lg"
            aria-label="다음 단계로 이동"
          >
            {t('common.next')}
          </button>
        )}

        {/* hideNextButton && !bottomCenter: 빈 공간으로 이전 버튼만 보이게 */}
        {hideNextButton && !bottomCenter && <div className="min-w-[44px]" />}
      </div>
    </div>
  );
}
