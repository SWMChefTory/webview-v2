import * as Dialog from "@radix-ui/react-dialog";
import { MicButtonPopover, popoverHandle } from "./micButtonPopover";
import * as Popover from "@radix-ui/react-popover";
import { IoMdClose } from "react-icons/io";
import {
  useTutorial,
  useTutorialActions,
  StepStatus,
} from "../hooks/useTutorial";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { useVoiceGuideTranslation } from "../hooks/useVoiceGuideTranslation";

export const VoiceGuideModal = ({ onClick }: { onClick: () => void }) => {
  const { t } = useVoiceGuideTranslation();

  return (
    <>
      <Dialog.Root open={true}>
        <Dialog.Portal>
          <Dialog.Content className="absolute inset-0 z-[1200] flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm">
            <div className="flex flex-col max-h-[90vh] w-full w-[80vw] lg:max-w-[600px] xl:max-w-[700px] animate-[slideUp_.3s_ease-out] overflow-hidden rounded-2xl lg:rounded-3xl bg-white shadow-2xl">
              <Dialog.Title className="text-2xl lg:text-3xl pt-6 lg:pt-8 pb-2 lg:pb-3 font-bold pl-8 lg:pl-10">
                {t("modal.title")}
              </Dialog.Title>
              <VoiceGuide />
              <div className="w-full flex items-center justify-center">
                <VoiceGuideCloseButton
                  onClick={onClick}
                  label={t("modal.button")}
                />
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

export function VoiceGuideMicStep({
  trigger,
  recipeId,
}: {
  trigger: React.ReactNode;
  recipeId: string;
}) {
  const { handleNextStep, terminate } = useTutorialActions();
  const { steps, currentStepIndex, isInTutorial } = useTutorial();
  const { t } = useVoiceGuideTranslation();

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

  // 마지막 단계 완료 버튼 클릭 시
  const handleComplete = () => {
    track(AMPLITUDE_EVENT.TUTORIAL_HANDSFREE_STEP_END, {
      recipe_id: recipeId,
      completed_steps: steps.length, // 모든 단계 완료
      total_steps: steps.length,
      is_completed: true,
    });
    handleNextStep({ index: currentStepIndex }); // 내부에서 terminate() 호출됨
  };

  return (
    <Popover.Root
      open={isInTutorial && steps[currentStepIndex].status == StepStatus.GUIDE}
      modal={true}
    >
      <Popover.Trigger onClick={() => {}}>{trigger}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="flex flex-col bg-white rounded-lg lg:rounded-xl shadow-xl lg:shadow-2xl z-[2000]"
          side="top"
          align="start"
          sideOffset={10}
          alignOffset={10}
        >
          <Popover.Arrow className="fill-white" />
          <div className="w-[60vw] max-w-md lg:max-w-lg lg:w-[400px] px-4 py-4 pb-6 lg:px-5 lg:py-5 lg:pb-7 z-[2000]">
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
              {t("tutorial.thankYou")}
            </p>
            <div className="h-1 lg:h-2" />
            <p className="break-keep leading-relaxed font-semibold lg:text-lg lg:leading-relaxed">
              {t("tutorial.detailInfo")}
            </p>
            <div className="flex w-full justify-center pt-4 lg:pt-5">
              <Popover.Close
                asChild
                className="px-3 py-1 lg:px-4 lg:py-1.5 bg-gray-200 rounded lg:rounded-md font-semibold lg:text-base"
              >
                <p onClick={handleComplete}>{t("tutorial.checkLater")}</p>
              </Popover.Close>
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export function MicButton({
  isActive,
  onClick,
  ref,
}: {
  isActive: boolean;
  onClick: () => void;
  ref: React.RefObject<undefined | popoverHandle>;
}) {
  const { t } = useVoiceGuideTranslation();

  return (
    <button
      className={[
        "relative flex h-[3.75rem] w-[3.75rem] lg:h-[4.5rem] lg:w-[4.5rem] items-center justify-center rounded-full transition active:scale-95 lg:hover:scale-105",
        isActive
          ? "bg-orange-500 shadow-[0_2px_24px_rgba(251,146,60,0.8)]"
          : "bg-orange-500 shadow-[0_2px_16px_rgba(0,0,0,0.32)]",
      ].join(" ")}
      aria-label={t("accessibility.buttonLabel")}
      type="button"
      onClick={onClick}
    >
      <MicButtonPopover ref={ref} />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-8 w-8 lg:h-10 lg:w-10"
      >
        <path d="M12 1a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V4a3 3 0 0 1 3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
      {isActive && (
        <>
          <span className="pointer-events-none absolute inset-0 rounded-full border-2 border-orange-300/60 animate-[listening_1.8s_ease-out_infinite]" />
          <span className="pointer-events-none absolute inset-0 rounded-full border-2 border-orange-400/40 animate-[listening_1.8s_ease-out_infinite_0.9s]" />
          <style jsx>{`
            @keyframes listening {
              0% {
                transform: scale(1);
                opacity: 0.8;
              }
              70% {
                transform: scale(1.8);
                opacity: 0.2;
              }
              100% {
                transform: scale(2.2);
                opacity: 0;
              }
            }
          `}</style>
        </>
      )}
    </button>
  );
}

function VoiceGuide() {
  const { t } = useVoiceGuideTranslation();

  const commands = t("commands", { returnObjects: true }) as Array<{
    command: string;
    description: string;
    icon: string;
  }>;

  const tipItems = t("tip.items", { returnObjects: true }) as string[];

  return (
    <div className="max-h-[calc(90vh-150px)] overflow-y-auto px-6 py-5 lg:px-8 lg:py-6">
      {/* Voice Commands List */}
      <div className="mb-6 lg:mb-8 space-y-3 lg:space-y-4">
        {commands.map((command, index) => (
          <div
            key={index}
            className="flex items-start gap-3 lg:gap-4 rounded-xl bg-gray-50 p-4 lg:p-5 transition hover:bg-gray-100"
          >
            <div className="text-2xl lg:text-3xl">{command.icon}</div>
            <div className="flex-1">
              <div className="mb-1 font-semibold text-gray-800 lg:text-lg">
                {command.command}
              </div>
              <div className="text-sm lg:text-base text-gray-600">{command.description}</div>
            </div>
          </div>
        ))}
      </div>

      {/* TIP Section */}
      <div className="rounded-xl lg:rounded-2xl border border-orange-100 bg-orange-50 p-4 lg:p-5">
        <h3 className="mb-2 text-sm lg:text-base font-bold text-orange-700">
          {t("tip.title")}
        </h3>
        <ul className="list-disc space-y-1 lg:space-y-2 pl-5 text-sm lg:text-base text-orange-800 break-keep">
          {tipItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function VoiceGuideCloseButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <div className="flex w-full items-center justify-center border-t border-gray-100 px-6 py-4 lg:px-8 lg:py-5">
      <button
        className="w-full rounded-md lg:rounded-lg bg-orange-600 px-6 py-3 lg:py-4 text-sm lg:text-base font-semibold text-white shadow lg:hover:bg-orange-700 lg:transition-colors"
        type="button"
        onClick={onClick}
      >
        {label}
      </button>
    </div>
  );
}
