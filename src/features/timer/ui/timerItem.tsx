import { IoPlayOutline, IoPauseOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import {
  ActiveTimer,
  IdleTimer,
  PausedTimer,
} from "../model/useInProgressTimers";
import { formatTime } from "../utils/time";
import { useProgressTimer } from "../model/useProgressTimer";

export function ActiveTimerItem(props: {
  timer: ActiveTimer;
  onPause: () => void;
  onCancel: () => void;
  onFinish: () => void;
}) {
  const { timer, onPause, onCancel, onFinish } = props;
  const { time } = useProgressTimer({ timer, onFinish });

  return (
    <div className="flex flex-col bg-white rounded-md lg:rounded-lg shadow-xs p-6 lg:p-8 pt-8 lg:pt-10">
      {/* <TimerItemHeader  title={timer.timerName} /> */}
      <TimerItemTime duration={timer.duration} remaining={time} />
      <TimerButtonTemplate
        leftButton={
          <div className="pl-0.5">
            <IoMdClose className="text-2xl text-bold " />
          </div>
        }
        onClickLeft={() => {
          onCancel();
        }}
        rightButton={
          <div className="pl-0.5">
            <IoPauseOutline className="text-2xl text-bold text-orange-400" />
          </div>
        }
        onClickRight={() => {
          onPause();
        }}
      />
    </div>
  );
}

export function PausedTimerItem(props: {
  timer: PausedTimer;
  onCancel: () => void;
  onResume: () => void;
}) {
  const { timer, onCancel, onResume } = props;
  return (
    <div className="flex flex-col bg-white rounded-md lg:rounded-lg shadow-xs p-6 lg:p-8 pt-8 lg:pt-10">
      {/* <TimerItemHeader title={timer.timerName} /> */}
      <TimerItemTime
        duration={timer.duration}
        remaining={timer.remainingTime}
      />
      <TimerButtonTemplate
        onClickLeft={() => {
          onCancel();
        }}
        leftButton={
          <div className="pl-0.5">
            <IoMdClose className="text-2xl text-bold" />
          </div>
        }
        rightButton={
          <div className="pl-0.5">
            <IoPlayOutline className="text-2xl text-bold text-orange-400" />
          </div>
        }
        onClickRight={() => {
          onResume();
        }}
      />
    </div>
  );
}

export function IdleTimerItem({
  timer,
  onStart,
}: {
  timer: IdleTimer;
  onStart: () => void;
}) {
  return (
    <div className="flex flex-col bg-white rounded-md lg:rounded-lg shadow-xs p-6 lg:p-8 pt-8 lg:pt-10">
      {/* <TimerItemHeader title={timer.timerName} /> */}
      <TimerItemTime duration={timer.duration} remaining={timer.duration} />
      <TimerButtonTemplate
        onClickLeft={() => {
          onStart();
        }}
        leftButton={
          <div className="pl-0.5">
            <IoPlayOutline className="text-2xl text-bold text-orange-400" />
          </div>
        }
      ></TimerButtonTemplate>
    </div>
  );
}

function TimerItemHeader({
  title,
}: {
  title: string;
}) {
  return (
    <div className="flex flex-col px-3 py-2">
      <div className="flex flex-row justify-between items-center">
        <span
          className={`${title ? "text-black" : "text-gray-400"} line-clamp-1`}
        >
          {title || "이름 없음"}
        </span>
        
      </div>
      <div className="h-2" />
    </div>
  );
}

export function TimerItemTime({
  remaining,
}: {
  duration?: number;
  remaining: number;
}) {
  //높이 60px
  return (
    <div className="flex flex-col">
      <span className={`pl-3 lg:pl-4 text-6xl lg:text-7xl xl:text-8xl font-semibold tabular-nums`}>
        {formatTime(Math.ceil(remaining))}
      </span>
    </div>
  );
}

function TimerButtonTemplate({
  leftButton,
  rightButton,
  onClickLeft,
  onClickRight,
}: {
  leftButton: React.ReactNode;
  rightButton?: React.ReactNode;
  onClickLeft: () => void;
  onClickRight?: () => void;
}) {
  return (
    <div className="flex flex-col w-full justify-between items-center pt-[24px] lg:pt-[32px]">
      <div className="w-full border" />
      <div className="flex flex-row justify-evenly w-full h-10 lg:h-12 items-center">
        <div onClick={onClickLeft} className="flex-1 flex justify-center">
          {leftButton}
        </div>
        {onClickRight && (
          <>
            <div className="w-px h-full border" />
            <div onClick={onClickRight} className="flex-1 flex justify-center">
              {rightButton}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
