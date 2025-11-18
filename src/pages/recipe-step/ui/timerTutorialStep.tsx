import * as Popover from "@radix-ui/react-popover";
import { Spinner } from "@/components/ui/spinner";
import { IoMdClose } from "react-icons/io";
import {
  useTutorial,
  useTutorialActions,
  StepStatus,
} from "../hooks/useTutorial";

export function VoiceGuideTimerStep({ trigger }: { trigger: React.ReactNode }) {
  const { handleNextStep,terminate } = useTutorialActions();
  const { steps, currentStepIndex, isInTutorial } = useTutorial();
  return (
    <Popover.Root
      open={isInTutorial && steps[currentStepIndex].status == StepStatus.TIMER}
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
              <Popover.Close onClick={terminate}>
                <div className="p-1">
                  <IoMdClose className="text-gray-500" size={18} />
                </div>
              </Popover.Close>
            </div>

            <p className="break-keep leading-relaxed font-semibold ">
              {steps[currentStepIndex].when}{" "}
              <span className="font-extrabold whitespace-nowrap text-lg">
                "{steps[currentStepIndex].command}"
              </span>{" "}
              라고 말해보세요!
            </p>
            <div className="flex w-full justify-center pt-2 pb-4 items-center gap-2 text-orange-500">
              음성을 듣고 있어요
              <Spinner />
            </div>
            <div className="flex w-full justify-center">
              <Popover.Close
                asChild
                className="px-3 py-1 bg-gray-200 rounded font-semibold"
              >
                <p
                  onClick={() => {
                    handleNextStep({ index: currentStepIndex });
                  }}
                >
                  클릭해서 넘어갈게요
                </p>
              </Popover.Close>
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
