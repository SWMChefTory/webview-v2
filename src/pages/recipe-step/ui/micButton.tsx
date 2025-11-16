import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { MicButtonPopover, popoverHandle } from "./micButtonPopover";

export const MicInteractionButton = ({
  isActive,
  ref,
}: {
  isActive: boolean;
  ref: React.RefObject<undefined | popoverHandle>;
}) => {
  return (
    <>
      <Dialog.Root>
        <Dialog.Trigger>
          <MicButton isActive={isActive} ref={ref} />
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Content className="absolute inset-0 z-[1200] flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm">
            <div className="flex flex-col max-h-[90vh] w-full w-[80vw] animate-[slideUp_.3s_ease-out] overflow-hidden rounded-2xl bg-white shadow-2xl">
              <Dialog.Title className="text-2xl pt-6 pb-2 font-bold pl-8">
                음성명령 가이드
              </Dialog.Title>
              <VoiceGuide />
              <div className="w-full flex items-center justify-center">
                <Dialog.Close className="w-full">
                  <VoiceGuideCloseButton />
                </Dialog.Close>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

function MicButton({
  isActive,
  ref,
}: {
  isActive: boolean;
  ref: React.RefObject<undefined | popoverHandle>;
}) {
  return (
    <button
      className={[
        "relative flex h-[3.75rem] w-[3.75rem] items-center justify-center rounded-full p-2 transition active:scale-95",
        isActive
          ? "bg-orange-500 shadow-[0_2px_24px_rgba(251,146,60,0.8)]"
          : "bg-orange-500 shadow-[0_2px_16px_rgba(0,0,0,0.32)]",
      ].join(" ")}
      aria-label="음성 명령 가이드"
      type="button"
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

function VoiceGuide() {
  const voiceCommands = [
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
  ];

  return (
    <div className="max-h-[calc(90vh-150px)] overflow-y-auto px-6 py-5">
      {/* Voice Commands List */}
      <div className="mb-6 space-y-3">
        {voiceCommands.map((command, index) => (
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
        <h3 className="mb-2 text-sm font-bold text-orange-700">TIP</h3>
        <ul className="list-disc space-y-1 pl-5 text-sm text-orange-800 break-keep">
          <li>큰 목소리로 또박또박 말하면 인식률이 높아져요</li>
          <li>연속으로 음성 명령을 내리면 인식하지 못할 수 있어요</li>
        </ul>
      </div>
    </div>
  );
}

function VoiceGuideCloseButton() {
  return (
    <div className="flex w-full items-center justify-center border-t border-gray-100 px-6 py-4">
      <button
        className="w-full rounded-md bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow "
        type="button"
      >
        알겠어요!
      </button>
    </div>
  );
}
