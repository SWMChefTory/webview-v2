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
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { useRecipeStepTranslation } from "../hooks/useRecipeStepTranslation";

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
      className={`relative px-3 lg:px-4 pb-4 lg:pb-5 ${isLastChild && "min-h-full shrink-0"}`}
    >
      <VoiceGuideStep
        trigger={
          <div className="text-gray-400 font-bold text-base lg:text-lg">
            {i}. {step.subtitle}
          </div>
        }
        isOpen={isSelected}
        recipeId={recipeId}
      />
      <div className={`${isLandscape ? "h-2" : "h-5"} lg:h-6`} />
      <div className={`flex flex-col ${isLandscape ? "gap-1" : "gap-2"} lg:gap-3 px-2 lg:px-3`}>
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
  const lang = useLangcode(); // 언어 코드 가져오기 (복잡한 문장 구조용)
  const { t } = useRecipeStepTranslation();

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
          className="flex flex-col bg-white rounded-lg lg:rounded-xl shadow-xl lg:shadow-2xl"
          side="bottom"
          align="end"
          sideOffset={10}
          alignOffset={10}
        >
          <Popover.Arrow className="fill-white" />
          <div className="w-[60vw] max-w-md lg:max-w-lg lg:w-[400px] px-4 py-4 pb-6 lg:px-5 lg:py-5 lg:pb-7">
            <div className="flex justify-between item-center pb-2 lg:pb-3">
              <div className="text-gray-500 lg:text-base">
                {currentStepIndex + 1}/{steps.length}
              </div>
              <Popover.Close onClick={handleTerminate}>
                <div className="p-1 lg:p-1.5">
                  <IoMdClose className="text-gray-500 lg:w-5 lg:h-5" size={18} />
                </div>
              </Popover.Close>
            </div>

            <p className="break-keep leading-relaxed font-semibold lg:text-lg lg:leading-relaxed">
              {currentStep.when}{" "}
              {/* 언어별 문장 구조 처리 */}
              {lang === "ko" ? (
                <>
                  <span className="font-extrabold whitespace-nowrap text-lg lg:text-xl">
                    "{currentStep.command}"
                  </span>{" "}
                  라고 말해보세요!
                </>
              ) : (
                <>
                  Say{" "}
                  <span className="font-extrabold whitespace-nowrap text-lg lg:text-xl">
                    "{currentStep.command}"
                  </span>
                  !
                </>
              )}
            </p>
            <div className="flex w-full justify-center pt-2 pb-4 lg:pt-3 lg:pb-5 items-center gap-2 text-orange-500 lg:text-base">
              {t("voice.listening")}
              <Spinner className="lg:w-5 lg:h-5" />
            </div>
            <div className="flex w-full justify-center">
              <Popover.Close
                asChild
                className="px-3 py-1 lg:px-4 lg:py-1.5 bg-gray-200 rounded lg:rounded-md font-semibold lg:text-base"
              >
                <p
                  onClick={() => {
                    // 중간 단계 버튼: 다음 단계로 이동만 하고 종료 이벤트는 발송하지 않음
                    handleNextStep({ index: currentStepIndex });
                  }}
                >
                  {t("voice.skip")}
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
      className={`relative flex flex-row gap-3 lg:gap-4 ${
        isSelected ? "text-white" : "text-gray-400"
      } ${isLandscape ? "text-base lg:text-lg" : "text-xl lg:text-2xl"}`}
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