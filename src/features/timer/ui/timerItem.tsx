import { IoPlayOutline, IoPauseOutline, IoTimerOutline } from "react-icons/io5";
import { TimerState, useTimers } from "../model/useInProgressTimers";
import { formatTimeKorean, formatTime } from "../utils/time";
import useInterval from "../model/useInterval";
import { useCallback, useState } from "react";
import { IoIosClose } from "react-icons/io";
import router from "next/router";

function useTimerItem(timerId: string) {
  const { getTimerById, handleFinishTimer } = useTimers();
  const timer = getTimerById(timerId);

  const [remainingTime, setRemainingTime] = useState(() => {
    switch (timer.state) {
      case TimerState.ACTIVE:
        const remaining = Math.ceil((timer.endAt.getTime() - new Date().getTime()) / 1000);
        return remaining > 0 ? Math.ceil(remaining) : 0;
      case TimerState.PAUSED:
        return Math.ceil(timer.remainingTime);
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

export function EmptyTimerItem() {
  return (
    <TimerItemTemplate isIdle={true}>
      <div className="flex  flex-col items-center justify-center py-2">
        <div className="bg-gray-100 rounded-full p-4 mb-4">
          <IoTimerOutline className="size-8 text-gray-400" />
        </div>
        <p className="text-gray-600 font-medium text-base mb-1">
          실행 중인 타이머가 없어요
        </p>
      </div>
    </TimerItemTemplate>
  );
}

export function TimerItem({
  timerId,
  isShort = false,
}: {
  timerId: string;
  isShort?: boolean;
}) {
  const { handleCancelTimer } = useTimers();
  const { timer, remainingTime } = useTimerItem(timerId);
  return (
    <TimerItemTemplate isShort={isShort} onClose={() => {
      handleCancelTimer({ id: timerId });
    }} name={timer.recipeName ?? undefined}
    recipeId={timer.recipeId ?? undefined}
    >
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
  onClose,
  recipeId,
  name,
  isIdle = false,
  isShort = false,
}: {
  children: React.ReactNode;
  onClose?: () => void;
  recipeId?: string;
  name?: string;
  isIdle?: boolean;
  isShort?: boolean;
}) {
  return (
    <div
      className={`flex flex-col border border-[2] px-3 py-2  rounded-md ${
        isIdle ? "border-gray-300" : "border-orange-300"
      } ${isShort && "w-[224px]"}` }
    >
      {!isIdle && <IoIosClose className="text-gray-400 size-6 " onClick={onClose} />}
      {!isIdle && <TimerName name={name} recipeId={recipeId} />}
      <div
        className={`flex items-center ${
          isShort ? "justify-start" : "justify-between"
        }  px-2 pt-1 pb-2`}
      >
        {children}
      </div>
    </div>
  );
}

import { IoIosArrowForward } from "react-icons/io";


function TimerName({name, recipeId}: {name?: string, recipeId?: string}) {
  return (
    <div className="flex gap-1 items-center px-2 text-sm font-semibold" onClick={()=>{
      if (recipeId) {
        router.push(`/recipe/${recipeId}/detail`);
      }
    }}>
      <div className="truncate">
      {name ?? "셰프토리 타이머"}
      </div>
      {recipeId && <IoIosArrowForward className="text-gray-400 size-4 shrink-0" />}
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
  //높이 60px
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
          <IoPauseOutline className="text-lg text-orange-400" />
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
