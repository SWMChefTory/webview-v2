import {
  ActiveTimer,
  PausedTimer,
  TimerState,
  useHandleTimers,
  useTimers,
} from "../model/useInProgressTimers";
import { motion } from "framer-motion";

import { useProgressTimer } from "../model/useProgressTimer";
import { filterActiveTimers } from "../utils/query";
import { useImperativeHandle, useState } from "react";
import { useAnimate } from "motion/react";
import {create} from "zustand";

export function TimerButton({
  recipeId,
  recipeName,
  errorPopoverRef,
}: {
  recipeId: string;
  recipeName: string;
  errorPopoverRef: React.RefObject<popoverHandle | undefined>;
}) {
  const timers = useTimers(recipeId, recipeName);
  const { handleFinishTimerSuccessfully } = useHandleTimers({
    recipeId,
    recipeName,
  });
  const activeTimers = filterActiveTimers(timers);
  const curTimer =
    timers.size > 0 ? Array.from(timers.entries())[0] : undefined;

  if (!curTimer) {
    return (
      <div className="relative">
        <StaticTimerButton />
        <TimerButtonEffect />
      </div>
    );
  }

  return (
    <div className="relative">
      <TimerCommandErrorPopover ref={errorPopoverRef} />
      {curTimer[1].state === TimerState.ACTIVE && (
        <ActiveTimerButton
          timer={[curTimer[0], curTimer[1] as ActiveTimer]}
          remainingCount={activeTimers.length - 1}
          onFinish={handleFinishTimerSuccessfully}
        />
      )}
      {curTimer[1].state === TimerState.PAUSED && (
        <PausedTimerButton time={(curTimer[1] as PausedTimer).remainingTime} />
      )}
      {curTimer[1].state === TimerState.IDLE && <StaticTimerButton />}
      <TimerButtonEffect />
    </div>
  );
}

function PausedTimerButton({ time }: { time: number }) {
  const { important, secondary } = formatTime({ totalSeconds: time });
  return <TimerTemplate important={important} secondary={secondary} />;
}

function ActiveTimerButton({
  timer,
  remainingCount,
  onFinish,
}: {
  timer: [string, ActiveTimer];
  remainingCount: number;
  onFinish: ({ id }: { id: string }) => void;
}) {
  const { time } = useProgressTimer({
    timer: timer[1],
    onFinish: () => onFinish({ id: timer[0] }),
  });

  const { important, secondary } = formatTime({ totalSeconds: time });
  return <TimerTemplate important={important} secondary={secondary} />;
}

function TimerTemplate({
  important,
  secondary,
}: {
  important: string;
  secondary: string;
}) {
  return (
    <button
      className="relative h-[3.75rem] w-[3.75rem] rounded-full bg-orange-500 text-white"
      type="button"
    >
      <div className="flex flex-col absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="text-xl font-medium leading-none tabular-nums z-10">
          {important}
        </span>
        <span className="text-sm leading-none text-gray-200 tabular-nums z-10">
          {secondary}
        </span>
      </div>
    </button>
  );
}

export const useTimerEffectVisibilityStore = create<{
  visible: boolean;
  setVisible: (visible: boolean) => void;
}>((set) => ({
  visible: false,
  setVisible: (visible: boolean) => {
    set({ visible: visible });
  },
}));

function TimerButtonEffect() {
  const { visible } = useTimerEffectVisibilityStore();

  if (!visible) {
    return null;
  }
  return (
    <>
      {/* 1번째 링 */}
      <motion.span
        className="pointer-events-none absolute inset-0 rounded-full border-2 border-orange-300/60 z-[1010]"
        style={{ willChange: "transform, opacity", transformOrigin: "50% 50%" }}
        animate={{
          // 1) 작게 보임 → 2) 크게 사라짐 → 3) 안 보이는 상태로 원래 크기 복귀(루프 대비)
          scale: [1, 2.2, 1],
          opacity: [0.8, 0.0, 0.0],
        }}
        transition={{
          duration: 1.8,
          ease: "easeOut",
          times: [0, 0.85, 1],
          repeat: Infinity,
          repeatType: "loop",
          repeatDelay: 0,
        }}
      />

      {/* 2번째 링 (0.9s 지연 시작) */}
      <motion.span
        className="pointer-events-none absolute inset-0 rounded-full border-2 border-orange-400/40 z-[1010]"
        style={{ willChange: "transform, opacity", transformOrigin: "50% 50%" }}
        animate={{
          scale: [1, 2.2, 1],
          opacity: [0.8, 0.0, 0.0],
        }}
        transition={{
          duration: 1.8,
          ease: "easeOut",
          times: [0, 0.85, 1],
          repeat: Infinity,
          repeatType: "loop",
          repeatDelay: 0,
          delay: 0.9, // ← 시차
        }}
      />
    </>
  );
}

function StaticTimerButton() {
  return (
    <button
      className="flex h-[3.75rem] w-[3.75rem] items-center justify-center rounded-full bg-orange-500 p-2 "
      aria-label="타이머"
      type="button"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="13" r="8" stroke="#FFFFFF" strokeWidth="2" />
        <path
          d="M12 9v4l3 2"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 3h6"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}

function formatTime({ totalSeconds }: { totalSeconds: number }): {
  important: string;
  secondary: string;
} {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return { important: `${hours}`, secondary: `${minutes}:${seconds}` };
  }
  if (minutes > 0) {
    return { important: `${minutes}`, secondary: `${seconds}` };
  }
  return { important: `${seconds}`, secondary: "" };
}

export type popoverHandle = {
  showErrorMessage: (message: string) => void;
};

function TimerCommandErrorPopover({
  ref,
}: {
  ref: React.RefObject<popoverHandle | undefined>;
}) {
  const [scope, animate] = useAnimate();
  const [errorMessage, setErrorMessage] = useState<string>("");

  useImperativeHandle(ref, () => ({
    showErrorMessage: (message: string) => {
      animate(
        scope.current,
        { opacity: [1, 1, 0] },
        { times: [0, 0.5, 1], duration: 2, ease: "easeOut" }
      );
      setErrorMessage(message);
    },
  }));

  return (
    <div
      ref={scope}
      style={{ opacity: 0 }}
      className="absolute left-[2] bottom-full bg-gray-500 text-white text-xs px-3 py-2 rounded-md shadow-md whitespace-nowrap z-[100]"
    >
      {errorMessage}
      <div
        className="absolute left-[8] top-full w-0 h-0 
          border-l-8 border-l-transparent   
          border-r-8 border-r-transparent 
          border-t-8 border-t-gray-500"
      ></div>
    </div>
  );
}
