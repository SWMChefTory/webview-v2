import { useCallback, useEffect, useRef, useState } from "react";
import { TimerState, ActiveTimer } from "./useInProgressTimers";
import { useInterval } from "@/src/shared/hooks/useInterval";

export function useProgressTimer({
  timer,
  onFinish,
}: {
  timer: ActiveTimer;
  onFinish: () => void;
}) {
  const [time, setRemainingTime] = useState(() => {
    return Math.ceil((timer.endAt.getTime() - new Date().getTime()) / 1000);
  });

  const tick = useCallback(() => {
    if (timer.state === TimerState.ACTIVE) {
      const remaining = (timer.endAt.getTime() - new Date().getTime()) / 1000;
      if (remaining <= 0) {
        onFinish();
        setRemainingTime(0);
        return;
      }
      setRemainingTime(Math.ceil(remaining));
    }
  }, [timer]);

  useInterval(tick, timer.state === TimerState.ACTIVE ? 200 : null);

  return {
    time,
  };
}

