import {
  ActiveTimer,
  Timer,
  TimerState,
  useTimers,
} from "@/src/features/timer/model/useInProgressTimers";
import { useProgressTimer } from "@/src/features/timer/model/useProgressTimer";
import { formatTime } from "@/src/features/timer/utils/time";
import { useHandleTimers } from "@/src/features/timer/model/useInProgressTimers";
import { LuTimer } from "react-icons/lu";
import { filterActiveTimers, findEarliestFinishTimer } from "../utils/query";

export function TimerTag({
  recipeId,
  recipeName,
}: {
  recipeId: string;
  recipeName: string;
}) {
  const timers = useTimers(recipeId, recipeName);
  const activeTimers = filterActiveTimers(timers);
  const { handleFinishTimerSuccessfully } = useHandleTimers({
    recipeId,
    recipeName,
  });
  if (activeTimers.length === 0) {
    return null;
  }
  return (
    <ActiveTimerTag
      timers={activeTimers}
      onFinish={handleFinishTimerSuccessfully}
    ></ActiveTimerTag>
  );
}

function ActiveTimerTag({
  timers: activeTimers,
  onFinish,
}: {
  timers: [string, ActiveTimer][];
  onFinish: ({ id }: { id: string }) => void;
}) {
  const earliestFinishTimer = findEarliestFinishTimer(activeTimers);
  if (earliestFinishTimer === null) {
    return null;
  }
  return (
    <Progress
      timer={earliestFinishTimer[1]}
      onFinish={() => onFinish({ id: earliestFinishTimer[0] })}
      remainingTimerCount={activeTimers.length - 1}
    ></Progress>
  );
}

function Progress({
  timer,
  onFinish,
  remainingTimerCount,
}: {
  timer: ActiveTimer;
  onFinish: () => void;
  remainingTimerCount: number;
}) {
  const { time } = useProgressTimer({
    timer,
    onFinish: onFinish,
  });

  return (
    <div className="flex flex-row gap-1 bg-stone-800 text-white rounded-md p-2 tabular-nums items-center">
      <LuTimer className="w-4 h-4" />
      <span>{formatTime(time)}</span>
      {remainingTimerCount > 0 && (
        <span className="text-xs text-stone-400">+{remainingTimerCount}</span>
      )}
    </div>
  );
}
