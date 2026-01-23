import { RecipeStep } from "../type/recipeSteps";
import { motion } from "framer-motion";

export function ProgressBar({
  steps,
  currentStepIndex,
  currentDetailStepIndex,
  onClick,
  isLandscape,
  onTrackTouchNavigation,
}: {
  steps: RecipeStep[];
  currentStepIndex: number;
  currentDetailStepIndex: number;
  onClick: ({
    stepIndex,
    stepDetailIndex,
  }: {
    stepIndex: number;
    stepDetailIndex: number;
  }) => void;
  isLandscape: boolean;
  onTrackTouchNavigation?: () => void;
}) {
  if(isLandscape){
    return null;
  }
  const progressBarWidth =
    (currentStepIndex / steps.length) * 100 +
    ((currentDetailStepIndex + 1) /
      steps[currentStepIndex].details.length /
      steps.length) *
      100;
  return (
    <div className="w-full">
      <div className="h-2 lg:h-3" />
      <div className="relative bg-white/30 w-full h-[9px] lg:h-[12px]">
        <motion.div
          className="bg-white/80 h-[9px] lg:h-[12px]"
          initial={{ width: 0 }}
          animate={{ width: `${progressBarWidth}%` }}
          transition={{ duration: 0.2 }}
        />
        <div className="absolute left-[0] right-[0] -top-[0.5px] flex">
          {Array.from({ length: steps.length }).map((_, stepIndex) => {
            return (
              <Step
                onClick={({ stepDetailIndex }: { stepDetailIndex: number }) => {
                  onTrackTouchNavigation?.();
                  onClick({ stepIndex, stepDetailIndex });
                }}
                detailCount={steps[stepIndex].details.length}
                key={stepIndex}
              />
            );
          })}
        </div>
      </div>
      <div className="h-4 lg:h-5" />
    </div>
  );
}

function Step({
  onClick,
  detailCount,
}: {
  onClick: ({ stepDetailIndex }: { stepDetailIndex: number }) => void;
  detailCount: number;
}) {
  if (detailCount <= 0) {
    throw new Error("0보다 작은 값은 detailCount가 될 수 없습니다.");
  }
  return (
    <div
      className="flex-1 relative h-[10] justify-between z-[100] items-center"
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();

        if (rect.width === 0 || detailCount === 0) return;

        const ratio = Math.max(
          0,
          Math.min(1, (e.clientX - rect.left) / rect.width)
        );
        const oneRatio = 1 / detailCount;
        const stepDetailIndex = Math.min(
          Math.floor(ratio / oneRatio),
          detailCount - 1
        );

        onClick({ stepDetailIndex });
      }}
    >
      <div
        className="absolute left-[0px] z-[100px]"
        style={{ top: 0, height: "10px", lineHeight: 0 }}
      >
        <StepIntervalStart />
      </div>
      <div
        className="absolute right-[0px] z-[100px]"
        style={{ top: 0, height: "10px", lineHeight: 0 }}
      >
        <StepIntervalEnd />
      </div>
    </div>
  );
}

function StepIntervalEnd() {
  return (
    <svg
      viewBox="0 0 4 10"
      style={{
        display: "block",
        width: "4px",
        height: "10px",
        minHeight: "10px",
        maxHeight: "10px",
        overflow: "visible",
      }}
    >
      <path d="M 0,0 A 3,5 0 0 1 0,10 L 4,10 L 4,0 Z" fill="#000" />
    </svg>
  );
}

function StepIntervalStart() {
  return (
    <svg
      viewBox="0 0 4 10"
      style={{
        display: "block",
        width: "4px",
        height: "10px",
        minHeight: "10px",
        maxHeight: "10px",
        overflow: "visible",
      }}
    >
      <path d="M 0,0 L 4,0 A 3,5 0 0 0 4,10 L 0,10 Z" fill="#000" />
    </svg>
  );
}
