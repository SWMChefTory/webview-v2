import { TimerBottomSheet } from "@/src/widgets/timer/timerBottomSheet";
import { TimerButton as TimerButtonDefault } from "@/src/shared/ui/header/header";
import { TimerState, useTimers } from "@/src/features/timer/model/useInProgressTimers";

export const TimerButton = ({
  recipeId,
  recipeName,
}: {
  recipeId: string;
  recipeName: string;
}) => {
  const timers = useTimers(recipeId, recipeName);
  const timerActveCount = Array.from(timers.entries().filter(([_, timer]) => timer.state === TimerState.ACTIVE)).length;
  return (
    <TimerBottomSheet
      trigger={
        <TimerButtonDefault
          waitingCount={timerActveCount}
          onClick={() => {}}
        />
      }
      recipeId={recipeId}
      recipeName={recipeName}
    />
  );
};
