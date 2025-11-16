import { useEffect } from "react";
import { RecipeStep } from "../type/recipeSteps";

export function StepsContent({
  currentStepIndex,
  currentDetailStepIndex,
  onChangeStep,
  steps,
  isLandscape,
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
  isLandscape: boolean;
}) {
  useEffect(() => {
    scrollToStep(currentStepIndex,currentDetailStepIndex);
  }, [currentStepIndex, currentDetailStepIndex]);
  return (
    <>
      {/* <div className="h- overflow-hidden" /> */}
      <div className="flex-1 w-full text-white h-full overflow-scroll">
        <div className="flex flex-col h-full">
          {steps.map((step, i) => {
            return (
              <Step
                i={i}
                isLandscape={isLandscape}
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

function scrollToStep(stepIndex: number, stepDetailIndex: number) {
  const el = document.getElementById(`stepdetail-${stepIndex}-${stepDetailIndex}`);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Step({
  i,
  isSelected,
  isLastChild,
  step,
  onChangeStep,
  currentdetailStepIndex,
  isLandscape,
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
  isLandscape: boolean;
}) {
  return (
    <div
      id={`step-${i}`}
      className={`px-3 pb-4 ${isLastChild && "min-h-full shrink-0"}`}
    >
      <div className="text-gray-400 font-bold text-base">
        {i}. {step.subtitle}
      </div>
      <div className={`${isLandscape ? "h-5" : "h-5"}`} />
      <div className={`flex flex-col ${isLandscape ? "gap-1" : "gap-2"} px-2`}>
        {step.details.map((detail, di) => {
          return (
            <div
              key={`${i}-${di}`}
              id={`stepdetail-${i}-${di}`}
              onClick={() => {
                onChangeStep({ stepIndex: i, stepDetailIndex: di });
              }}
            >
              <div>
                <Detail
                  alphabetIndex={indexToLetter(di)}
                  text={step.details[di].text}
                  isSelected={isSelected && di === currentdetailStepIndex}
                  isLandscape={isLandscape}
                />
              </div>
              <div className="h-4" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

const Detail = ({
  alphabetIndex,
  text,
  isSelected,
  isLandscape,
}: {
  alphabetIndex: string;
  text: string;
  isSelected: boolean;
  isLandscape: boolean;
}) => {
  return (
    <div
      className={`relative flex flex-row gap-3 ${
        isSelected ? "text-white" : "text-gray-400"
      } ${isLandscape ? "text-base" : "text-xl"}`}
    >
      <div>{alphabetIndex}.</div>
      <div className={"font-bold overflow-none"}>{text}</div>
    </div>
  );
};

function indexToLetter(index: number): string {
  if (index < 0 || index > 25) {
    throw new Error("0~25 범위만 지원합니다");
  }
  return String.fromCharCode("A".charCodeAt(0) + index);
}
