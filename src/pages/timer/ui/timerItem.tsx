import { IoPlayOutline, IoPauseOutline } from "react-icons/io5";
import { TimerState, useTimers } from "../model/useInProgressTimers";
import { formatTimeKorean, formatTime } from "../utils/time";
import useInterval from "../model/useInterval";
import { useCallback, useState } from "react";

function useTimerItem(timerId: string) {
  const { getTimerById, handleFinishTimer } = useTimers();
  const timer = getTimerById(timerId);

  const [remainingTime, setRemainingTime] = useState(() => {
    switch (timer.state) {
      case TimerState.ACTIVE:
        const remaining = (timer.endAt.getTime() - new Date().getTime()) / 1000;
        return remaining > 0 ? Math.ceil(remaining) : 0;
      case TimerState.PAUSED:
        return timer.remainingTime;
      case TimerState.FINISHED:
        return 0;
    }
  });

  const tick = useCallback(() => {
    if (timer.state === TimerState.ACTIVE) {
      const remaining = (timer.endAt.getTime() - new Date().getTime()) / 1000;
      if (remaining <= 0) {
        handleFinishTimer({ id: timerId });
        setRemainingTime(0);
        return;
      }
      setRemainingTime(Math.ceil(remaining));
    }
  }, [timer, timerId]);

  useInterval(tick, timer.state === TimerState.ACTIVE ? 200 : null);

  return {
    timer,
    remainingTime,
  };
}

export function TimerItem({
  timerId,
  isShort = false,
}: {
  timerId: string;
  isShort?: boolean;
}) {
  const { timer, remainingTime } = useTimerItem(timerId);
  return (
    <TimerItemTemplate isShort={isShort}>
      <TimerItemTime duration={timer.duration} remaining={remainingTime} />
      <div className="w-8" />
      <TimerItemButton timerId={timerId} />
    </TimerItemTemplate>
  );
}

export function IdleTimerItem({ time }: { time: number }) {
  const { handleStartTimer } = useTimers();
  return (
    <TimerItemTemplate isIdle={true}>
      <TimerItemTime duration={time} remaining={time} />
      <TimerButtonTemplate
        isOrange={false}
        onClick={() => {
          handleStartTimer({ recipeId: null, name: null, duration: time });
        }}
      >
        <div className="pl-0.5">
          <IoPlayOutline className="text-lg text-gray-500" />
        </div>
      </TimerButtonTemplate>
    </TimerItemTemplate>
  );
}

function TimerItemTemplate({
  children,
  isIdle = false,
  isShort = false,
}: {
  children: React.ReactNode;
  isIdle?: boolean;
  isShort?: boolean;
}) {
  return (
    <div className="px-2 py-1">
      <div
        className={`flex items-center border border-[2] px-8 py-5 ${
          isShort ? "justify-start" : "justify-between"
        } rounded-md ${isIdle ? "border-gray-300" : "border-orange-300"}`}
      >
        {children}
      </div>
    </div>
  );
}

export function TimerItemTime({
  duration,
  remaining,
}: {
  duration: number;
  remaining: number;
}) {
  return (
    <div className="flex flex-col">
      <span className={`text-sm`}>{formatTimeKorean(duration)}</span>
      <span className={`text-4xl font-semibold tabular-nums`}>
        {formatTime(Math.ceil(remaining))}
      </span>
    </div>
  );
}

function TimerItemButton({ timerId }: { timerId: string }) {
  const {
    handleDeleteTimer,
    handlePauseTimer,
    handleResumeTimer,
    getTimerById,
  } = useTimers();
  const timer = getTimerById(timerId);
  if (!timer) {
    return null;
  }
  switch (timer.state) {
    case TimerState.ACTIVE:
      return (
        <TimerButtonTemplate
          onClick={() => {
            handlePauseTimer({ id: timerId });
          }}
        >
            <IoPauseOutline  className="text-lg text-orange-400" />
        </TimerButtonTemplate>
      );
    case TimerState.PAUSED:
      return (
        <TimerButtonTemplate
          onClick={() => {
            handleResumeTimer({ id: timerId });
          }}
        >
          <div className="pl-0.5">
            <IoPlayOutline className="text-lg text-orange-400 " />
          </div>
        </TimerButtonTemplate>
      );
    case TimerState.FINISHED:
      return (
        <TimerButtonTemplate
          onClick={() => {
            handleDeleteTimer(timerId);
          }}
        >
          <div className="text-sm text-orange-500">확인</div>
        </TimerButtonTemplate>
      );
  }
}

function TimerButtonTemplate({
  children,
  onClick,
  isOrange = true,
}: {
  children: React.ReactNode;
  onClick: () => void;
  isOrange?: boolean;
}) {
  const borderColor = isOrange ? "border-orange-300" : "border-gray-300";
  return (
    <button
      className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${borderColor}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
