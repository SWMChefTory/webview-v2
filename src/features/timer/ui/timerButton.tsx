import {
  ActiveTimer,
  useHandleTimers,
  useTimers,
} from "../model/useInProgressTimers";
import { useProgressTimer } from "../model/useProgressTimer";
import { filterActiveTimers, findEarliestFinishTimer } from "../utils/query";
import { motion, useSpring, useTransform } from "framer-motion";

export function TimerButton({
  recipeId,
  recipeName,
}: {
  recipeId: string;
  recipeName: string;
}) {
  const timers = useTimers(recipeId, recipeName);
  const { handleFinishTimerSuccessfully } = useHandleTimers({
    recipeId,
    recipeName,
  });
  const activeTimers = filterActiveTimers(timers);
  const earliestFinishTimer = findEarliestFinishTimer(activeTimers);

  if (earliestFinishTimer === null) {
    return <StaticTimerButton />;
  }

  return (
    <ActiveTimerButton
      timer={earliestFinishTimer}
      remainingCount={activeTimers.length - 1}
      onFinish={handleFinishTimerSuccessfully}
    />
  );
}

function TimerButtonIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="13" r="8" stroke="#FFFFFF" strokeWidth="2" />
      <path
        d="M12 9v4l3 2"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
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

  const radius = (3.75 - 0.25) / 2;
  const circumference = 2 * Math.PI * radius;

  const totalDuration = timer[1].duration;
  const progressPercentage = (time / totalDuration) * 100;

  const spring = useSpring(progressPercentage, { stiffness: 120, damping: 20 });
  const dashOffset = useTransform(spring, (v) => circumference * (1 - v / 100));

  const { important, secondary } = formatTime({ totalSeconds: time });
  return (
    <button
      className=" relative h-[3.75rem] w-[3.75rem] items-center justify-center rounded-full bg-orange-500 text-white"
      type="button"
    >
      <svg className="w-full h-full" viewBox="0 0 3.75 3.75">
        <circle
          cx={3.75 / 2}
          cy={3.75 / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={0.25}
        />
      </svg>
      <motion.circle
          cx={3.75 / 2}
          cy={3.75 / 2}
          r={radius}
          fill="none"
          stroke="gray"
          strokeWidth={0.25}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: dashOffset }}
        />
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
{
  /* <button
      className="flex flex-col gap-0 h-[3.75rem] w-[3.75rem] items-center justify-center rounded-full bg-orange-500 p-2 text-white "
      type="button"
    >
        <circle cx={3.75/2} cy={3.75/2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={0.25}/>
        <span className="text-xl font-medium leading-none tabular-nums">{important}</span>
        <span className="text-sm leading-none text-gray-200 tabular-nums">{secondary}</span>
    </button> */
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
