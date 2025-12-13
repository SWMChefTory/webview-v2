import {
  TimerLimitExceededError,
  TimerState,
  useHandleTimers,
  useTimers,
} from "@/src/features/timer/model/useInProgressTimers";
import {
  findEarliestFinishTimer,
  filterActiveTimers,
} from "@/src/features/timer/utils/query";
import { useTimerBottomSheetVisibility } from "@/src/widgets/timer/useTimerBottomSheetStore";
import { useTimerEffectVisibilityStore } from "@/src/features/timer/ui/timerButton";
import { useEffect, useRef } from "react";

export function useHandleTimerVoiceIntent({
  recipeId,
  recipeName,
}: {
  recipeId: string;
  recipeName: string;
}) {
  const {
    handleStartTimer,
    handlePauseTimer,
    handleResumeTimer,
    handleReplayTimer,
  } = useHandleTimers({ recipeId, recipeName });
  const timers = useTimers(recipeId, recipeName);
  const activeTimers = filterActiveTimers(timers);
  const earliestFinishTimer = findEarliestFinishTimer(activeTimers);
  const { handleOpenTemporarily } = useTimerBottomSheetVisibility();
  const { setVisible, visible } = useTimerEffectVisibilityStore();

  const timerEffectVisibilityRef = useRef<NodeJS.Timeout | undefined>(
    undefined
  );

  function handleTimerEffectVisibility() {
    if (!visible) {
      setVisible(true);
      timerEffectVisibilityRef.current = setTimeout(() => {
        setVisible(false);
      }, 2000);
    }
  }

  useEffect(() => {
    return () => {
      if (timerEffectVisibilityRef.current) {
        clearTimeout(timerEffectVisibilityRef.current);
      }
    };
  }, []);

  function handleTimerIntent(
    parsedIntent: string,
    onError: (error: string) => void
  ) {
    if (parsedIntent.startsWith("TIMER")) {
      const [_, commandRaw, secondsRaw] = parsedIntent.split(/\s+/);
      const seconds = secondsRaw ? Number(secondsRaw) : undefined;
      if (!commandRaw) {
        return;
      }
      const command = commandRaw;
      switch (command) {
        case "SET":
          if (seconds) {
            try {
              handleStartTimer({
                timerName: "",
                duration: seconds,
              });
            } catch (error) {
              if (error instanceof TimerLimitExceededError) {
                onError("타이머는 하나만 실행할 수 있어요!");
              }
              return;
            }
          } else {
            onError("시간을 입력해주세요.");
          }
          return;
        case "STOP":
          if (earliestFinishTimer) {
            console.log("STOP2", earliestFinishTimer[0]);
            handlePauseTimer({ id: earliestFinishTimer[0] });
            return;
          }
          onError("타이머가 실행되지 않았어요");
          return;
        case "START":
          const curTimer =
            timers.size > 0 ? Array.from(timers.entries())[0] : undefined;
          if (curTimer && curTimer[1].state === TimerState.PAUSED) {
            handleResumeTimer({ id: curTimer[0] });
            return;
          } else if (curTimer && curTimer[1].state === TimerState.IDLE) {
            handleReplayTimer({ id: curTimer[0] });
            return;
          }
          handleOpenTemporarily({ seconds: 5 });
          return;
        default:
          handleOpenTemporarily({ seconds: 5 });
          return;
      }
    }
  }
  return { handleTimerIntent };
}
