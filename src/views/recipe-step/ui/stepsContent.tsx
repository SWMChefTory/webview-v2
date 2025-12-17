import { useEffect } from "react";
import { RecipeStep } from "../type/recipeSteps";
import * as Popover from "@radix-ui/react-popover";
import { Spinner } from "@/components/ui/spinner";
import { IoMdClose } from "react-icons/io";
import {
  useTutorial,
  useTutorialActions,
  StepStatus,
} from "../hooks/useTutorial";
import { useLangcode } from "@/src/shared/translation/useLangCode";

// 다국어 텍스트 상수 정의
const UI_TEXT = {
  LISTENING: {
    ko: "음성을 듣고 있어요",
    en: "Listening...",
  },
  SKIP: {
    ko: "클릭해서 넘어갈게요",
    en: "Click to skip",
  },
};
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";

export function StepsContent({
  currentStepIndex,
  currentDetailStepIndex,
  onChangeStep,
  steps,
  isLandscape,
  recipeId,
  onTrackTouchNavigation,
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
  recipeId: string;
  onTrackTouchNavigation?: () => void;
}) {
  useEffect(() => {
    scrollToStep(currentStepIndex, currentDetailStepIndex);
  }, [currentStepIndex, currentDetailStepIndex]);
  return (
    <>
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
                recipeId={recipeId}
                onTrackTouchNavigation={onTrackTouchNavigation}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

function scrollToStep(stepIndex: number, stepDetailIndex: number) {
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
  isLandscape,
  recipeId,
  onTrackTouchNavigation,
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
  recipeId: string;
  onTrackTouchNavigation?: () => void;
}) {
  return (
    <div
      id={`step-${i}`}
      className={`relative px-3 pb-4 ${isLastChild && "min-h-full shrink-0"}`}
    >
      <VoiceGuideStep
        trigger={
          <div className="text-gray-400 font-bold text-base">
            {i}. {step.subtitle}
          </div>
        }
        isOpen={isSelected}
        recipeId={recipeId}
      />
      <div className={`${isLandscape ? "h-2" : "h-5"}`} />
      <div className={`flex flex-col ${isLandscape ? "gap-1" : "gap-2"} px-2`}>
        {step.details.map((detail, di) => {
          return isSelected ? (
            di >= currentdetailStepIndex - 2 && (
              <>
                <Detail
                  alphabetIndex={indexToLetter(di)}
                  text={step.details[di].text}
                  isSelected={isSelected && di === currentdetailStepIndex}
                  isLandscape={isLandscape}
                  onClick={() => {
                    onTrackTouchNavigation?.();
                    onChangeStep({ stepIndex: i, stepDetailIndex: di });
                  }}
                />
                <div className={`${isLandscape ? "h-1" : "h-4"}`} />
              </>
            )
          ) : (
            <>
              <Detail
                alphabetIndex={indexToLetter(di)}
                text={step.details[di].text}
                isSelected={isSelected && di === currentdetailStepIndex}
                isLandscape={isLandscape}
                onClick={() => {
                  onTrackTouchNavigation?.();
                  onChangeStep({ stepIndex: i, stepDetailIndex: di });
                }}
              />

              <div className={`${isLandscape ? "h-1" : "h-4"}`} />
            </>
          );
        })}
      </div>
    </div>
  );
}

function VoiceGuideStep({
  trigger,
  isOpen,
  recipeId,
}: {
  trigger: React.ReactNode;
  isOpen: boolean;
  recipeId: string;
}) {
  const { handleNextStep, terminate } = useTutorialActions();
  const { steps, currentStepIndex, isInTutorial } = useTutorial();
  const lang = useLangcode(); // 언어 코드 가져오기

  // 현재 튜토리얼 스텝 정보
  const currentStep = steps[currentStepIndex] || { when: "", command: "" };

  // X 버튼 클릭 시 (중도 이탈)
  const handleTerminate = () => {
    track(AMPLITUDE_EVENT.TUTORIAL_HANDSFREE_STEP_END, {
      recipe_id: recipeId,
      completed_steps: currentStepIndex,
      total_steps: steps.length,
      is_completed: false,
    });
    terminate();
  };

  return (
    <Popover.Root
      open={
        isInTutorial &&
        isOpen &&
        steps[currentStepIndex]?.status == StepStatus.CONTENT
      }
      modal={true}
    >
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="flex flex-col bg-white rounded-lg shadow-xl"
          side="bottom"
          align="end"
          sideOffset={10}
          alignOffset={10}
        >
          <Popover.Arrow className="fill-white" />
          <div className="w-[60vw] max-w-md px-4 py-4 pb-6">
            <div className="flex justify-between item-center pb-2">
              <div className="text-gray-500">
                {currentStepIndex + 1}/{steps.length}
              </div>
              <Popover.Close onClick={handleTerminate}>
                <div className="p-1">
                  <IoMdClose className="text-gray-500" size={18} />
                </div>
              </Popover.Close>
            </div>

            <p className="break-keep leading-relaxed font-semibold ">
              {currentStep.when}{" "}
              {/* 언어별 문장 구조 처리 */}
              {lang === "ko" ? (
                <>
                  <span className="font-extrabold whitespace-nowrap text-lg">
                    "{currentStep.command}"
                  </span>{" "}
                  라고 말해보세요!
                </>
              ) : (
                <>
                  Say{" "}
                  <span className="font-extrabold whitespace-nowrap text-lg">
                    "{currentStep.command}"
                  </span>
                  !
                </>
              )}
            </p>
            <div className="flex w-full justify-center pt-2 pb-4 items-center gap-2 text-orange-500">
              {lang === "ko" ? UI_TEXT.LISTENING.ko : UI_TEXT.LISTENING.en}
              <Spinner />
            </div>
            <div className="flex w-full justify-center">
              <Popover.Close
                asChild
                className="px-3 py-1 bg-gray-200 rounded font-semibold"
              >
                <p
                  onClick={() => {
                    // 중간 단계 버튼: 다음 단계로 이동만 하고 종료 이벤트는 발송하지 않음
                    handleNextStep({ index: currentStepIndex });
                  }}
                >
                  {lang === "ko" ? UI_TEXT.SKIP.ko : UI_TEXT.SKIP.en}
                </p>
              </Popover.Close>
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

const Detail = ({
  alphabetIndex,
  text,
  isSelected,
  isLandscape,
  onClick,
}: {
  alphabetIndex: string;
  text: string;
  isSelected: boolean;
  isLandscape: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      className={`relative flex flex-row gap-3 ${
        isSelected ? "text-white" : "text-gray-400"
      } ${isLandscape ? "text-base" : "text-xl"}`}
      onClick={onClick}
    >
      <div>{alphabetIndex}.</div>
      <div className={"font-bold overflow-none"}>{text}</div>
    </div>
  );
};

function indexToLetter(index: number): string {
  if (index < 0 || index > 25) {
    throw new Error("Only 0-25 range supported");
  }
  return String.fromCharCode("A".charCodeAt(0) + index);
}