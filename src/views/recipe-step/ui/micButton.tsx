import * as Dialog from "@radix-ui/react-dialog";
import { MicButtonPopover, popoverHandle } from "./micButtonPopover";
import * as Popover from "@radix-ui/react-popover";
import { IoMdClose } from "react-icons/io";
import {
  useTutorial,
  useTutorialActions,
  StepStatus,
} from "../hooks/useTutorial";
import { useLangcode, Lang } from "@/src/shared/translation/useLangCode";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";

// 다국어 메시지 포매터 정의
const formatVoiceGuideMessages = (lang: Lang) => {
  switch (lang) {
    case "en":
      return {
        modal: {
          title: "Voice Command Guide",
          button: "Got it!",
        },
        tutorial: {
          thankYou: "Thanks for completing the tutorial!",
          detailInfo: "Tap the button below for more details.",
          checkLater: "Check later",
        },
        commands: [
          {
            command: '"Next Step"',
            description: "Go to the next cooking step",
            icon: "➡️",
          },
          {
            command: '"Previous Step"',
            description: "Go back to the previous cooking step",
            icon: "⬅️",
          },
          {
            command: '"Go to step 3"',
            description: "Jump directly to a specific step",
            icon: "🔢",
          },
          {
            command: '"Go to chopping onions"',
            description: "Jump to a specific scene by description",
            icon: "🎯",
          },
          {
            command: '"Start/Stop 3 min timer"',
            description: "Start or stop a cooking timer",
            icon: "⏰",
          },
          {
            command: '"Pause/Play video"',
            description: "Pause or play the video",
            icon: "⏯️",
          },
        ],
        tip: {
          title: "TIP",
          items: [
            "Speaking loudly and clearly improves recognition.",
            "Continuous commands may not be recognized.",
          ],
        },
      };
    default:
      return {
        modal: {
          title: "음성명령 가이드",
          button: "알겠어요!",
        },
        tutorial: {
          thankYou: "튜토리얼을 진행해주셔서 감사해요!",
          detailInfo: "아래 버튼을 누르면 더 상세한 정보를 얻을 수 있어요",
          checkLater: "다음에 확인할게요",
        },
        commands: [
          {
            command: '"다음 단계"',
            description: "다음 요리 단계로 이동합니다",
            icon: "➡️",
          },
          {
            command: '"이전 단계"',
            description: "이전 요리 단계로 돌아갑니다",
            icon: "⬅️",
          },
          {
            command: '"세 번째 단계로 가줘"',
            description: "특정 단계로 바로 이동합니다",
            icon: "🔢",
          },
          {
            command: '"양파 써는 장면으로 가줘"',
            description: "원하는 장면으로 바로 이동합니다",
            icon: "🎯",
          },
          {
            command: '"타이머 3분 시작/정지"',
            description: "요리 타이머를 시작/정지합니다",
            icon: "⏰",
          },
          {
            command: '"동영상 정지/재생"',
            description: "동영상을 정지/재생합니다",
            icon: "⏯️",
          },
        ],
        tip: {
          title: "TIP",
          items: [
            "큰 목소리로 또박또박 말하면 인식률이 높아져요",
            "연속으로 음성 명령을 내리면 인식하지 못할 수 있어요",
          ],
        },
      };
  }
};

export const VoiceGuideModal = ({ onClick }: { onClick: () => void }) => {
  const lang = useLangcode();
  const messages = formatVoiceGuideMessages(lang);

  return (
    <>
      <Dialog.Root open={true}>
        <Dialog.Portal>
          <Dialog.Content className="absolute inset-0 z-[1200] flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm">
            <div className="flex flex-col max-h-[90vh] w-full w-[80vw] animate-[slideUp_.3s_ease-out] overflow-hidden rounded-2xl bg-white shadow-2xl">
              <Dialog.Title className="text-2xl pt-6 pb-2 font-bold pl-8">
                {messages.modal.title}
              </Dialog.Title>
              <VoiceGuide messages={messages} />
              <div className="w-full flex items-center justify-center">
                <VoiceGuideCloseButton
                  onClick={onClick}
                  label={messages.modal.button}
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

  const lang = useLangcode();
  const messages = formatVoiceGuideMessages(lang);

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
              {messages.tutorial.thankYou}
            </p>
            <div className="h-1" />
            <p className="break-keep leading-relaxed font-semibold ">
              {messages.tutorial.detailInfo}
            </p>
            <div className="flex w-full justify-center pt-4">
              <Popover.Close
                asChild
                className="px-3 py-1 bg-gray-200 rounded font-semibold"
              >
                <p onClick={handleComplete}>{messages.tutorial.checkLater}</p>
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
  return (
    <button
      className={[
        "relative flex h-[3.75rem] w-[3.75rem] items-center justify-center rounded-full transition active:scale-95",
        isActive
          ? "bg-orange-500 shadow-[0_2px_24px_rgba(251,146,60,0.8)]"
          : "bg-orange-500 shadow-[0_2px_16px_rgba(0,0,0,0.32)]",
      ].join(" ")}
      aria-label="음성 명령 가이드"
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
        className="h-8 w-8"
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

function VoiceGuide({
  messages,
}: {
  messages: ReturnType<typeof formatVoiceGuideMessages>;
}) {
  return (
    <div className="max-h-[calc(90vh-150px)] overflow-y-auto px-6 py-5">
      {/* Voice Commands List */}
      <div className="mb-6 space-y-3">
        {messages.commands.map((command, index) => (
          <div
            key={index}
            className="flex items-start gap-3 rounded-xl bg-gray-50 p-4 transition hover:bg-gray-100"
          >
            <div className="text-2xl">{command.icon}</div>
            <div className="flex-1">
              <div className="mb-1 font-semibold text-gray-800">
                {command.command}
              </div>
              <div className="text-sm text-gray-600">{command.description}</div>
            </div>
          </div>
        ))}
      </div>

      {/* TIP Section */}
      <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
        <h3 className="mb-2 text-sm font-bold text-orange-700">
          {messages.tip.title}
        </h3>
        <ul className="list-disc space-y-1 pl-5 text-sm text-orange-800 break-keep">
          {messages.tip.items.map((item, index) => (
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
    <div className="flex w-full items-center justify-center border-t border-gray-100 px-6 py-4">
      <button
        className="w-full rounded-md bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow "
        type="button"
        onClick={onClick}
      >
        {label}
      </button>
    </div>
  );
}
