import { useEffect } from "react";
import { RecipeStep } from "../type/recipeSteps";

export function StepsContent({
  currentStepIndex,
  currentDetailStepIndex,
  onChangeStep,
  steps,
}: {
  currentStepIndex: number;
  currentDetailStepIndex: number;
  onChangeStep: ({
    stepIndex,
    stepDetailIndex,
  }: {
    stepIndex: number;
    stepDetailIndex: number;
  }) => void;
  steps: RecipeStep[];
}) {
  useEffect(() => {
    scrollToStep(currentStepIndex);
  }, [currentStepIndex]);
  return (
    <>
      <div className="h-8 overflow-hidden" />
      <div className="flex-1 w-full text-white h-full overflow-scroll">
        <div className="flex flex-col h-full">
          {steps.map((step, i) => {
            return (
              <Step
                i={i}
                isSelected={i == currentStepIndex}
                isLastChild={steps.length - 1 === i}
                currentdetailStepIndex={currentDetailStepIndex}
                step={step}
                onChangeStep={onChangeStep}
                key={i}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

function scrollToStep(stepIndex: number) {
  const el = document.getElementById(`step-${stepIndex}`);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Step({
  i,
  isSelected,
  isLastChild,
  step,
  onChangeStep,
  currentdetailStepIndex,
}: {
  i: number;
  isSelected: boolean;
  isLastChild: boolean;
  step: RecipeStep;
  onChangeStep: ({
    stepIndex,
    stepDetailIndex,
  }: {
    stepIndex: number;
    stepDetailIndex: number;
  }) => void;
  currentdetailStepIndex: number;
}) {
  return (
    <div
      id={`step-${i}`}
      className={`px-3 pb-4 ${isLastChild && "min-h-full shrink-0"}`}
    >
      <div className="text-gray-400 font-bold text-base">
        {i}. {step.subtitle}
      </div>
      <div className="h-2" />
      <div className="flex flex-col gap-1 px-2">
        {step.details.map((detail, di) => {
          return (
            <div
              key={`${i}-${di}`}
              onClick={() => {
                onChangeStep({ stepIndex: i, stepDetailIndex: di });
              }}
            >
              <div
                className={`flex flex-row text-2xl gap-3 ${
                  isSelected && currentdetailStepIndex === di
                    ? "text-white"
                    : "text-gray-400"
                }`}
              >
                <div>{indexToLetter(di)}.</div>
                <div
                  className={`font-bold overflow-none ${
                    isSelected && currentdetailStepIndex === di
                      ? "text-white"
                      : "text-gray-400"
                  }`}
                >
                  {detail.text}
                </div>
              </div>
              <div className="h-4" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function indexToLetter(index: number): string {
  if (index < 0 || index > 25) {
    throw new Error("0~25 범위만 지원합니다");
  }
  return String.fromCharCode("A".charCodeAt(0) + index);
}
