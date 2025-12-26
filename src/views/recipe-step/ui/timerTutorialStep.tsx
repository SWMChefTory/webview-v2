import * as Popover from "@radix-ui/react-popover";
import { Spinner } from "@/components/ui/spinner";
import { IoMdClose } from "react-icons/io";
import {
  useTutorial,
  useTutorialActions,
  StepStatus,
} from "../hooks/useTutorial";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { useLangcode } from "@/src/shared/translation/useLangCode";
import { useRecipeStepTranslation } from "../hooks/useRecipeStepTranslation";

export function VoiceGuideTimerStep({
  trigger,
  recipeId,
}: {
  trigger: React.ReactNode;
  recipeId: string;
}) {
  const { handleNextStep, terminate } = useTutorialActions();
  const { steps, currentStepIndex, isInTutorial } = useTutorial();
  const lang = useLangcode(); // 언어 설정 가져오기 (복잡한 문장 구조용)
  const { t } = useRecipeStepTranslation();

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

  // 현재 스텝 데이터 안전하게 접근
  const currentStep = steps[currentStepIndex] || {
    when: "",
    command: "",
    status: null,
  };

  return (
    <Popover.Root
      open={isInTutorial && currentStep.status == StepStatus.TIMER}
      modal={true}
    >
      <Popover.Trigger>{trigger}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="flex flex-col bg-white rounded-lg shadow-xl z-[2000]"
          side="top"
          align="start"
          sideOffset={10}
          alignOffset={10}
        >
          <Popover.Arrow className="fill-white" />
          <div className="w-[60vw] max-w-md px-4 py-4 pb-6 z-[2000]">
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
              {currentStep.when} {/* 언어별 명령어 문장 구조 분기 처리 */}
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
              {t("voice.listening")}
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
