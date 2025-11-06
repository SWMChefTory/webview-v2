import { TimerBottomSheet } from "@/src/widgets/timer/timerBottomSheet";
import {
  TimerState,
  useTimers,
} from "@/src/features/timer/model/useInProgressTimers";
import { LuTimer } from "react-icons/lu";
import { HeaderIconButtonTemplate } from "@/src/shared/ui/header/header";

export const TimerButton = ({
  recipeId,
  recipeName,
}: {
  recipeId: string;
  recipeName: string;
}) => {
  const timers = useTimers(recipeId, recipeName);
  const timerActveCount = Array.from(
    timers.entries().filter(([_, timer]) => timer.state === TimerState.ACTIVE)
  ).length;

  return (
    <TimerBottomSheet
      trigger={
        <TimerButtonDefault
          waitingCount={timerActveCount}
        />
      }
      recipeId={recipeId}
      recipeName={recipeName}
    />
  );
};


const TimerButtonDefault = ({
  waitingCount = 0,
}: {
  waitingCount?: number;
}) => {
  return (
    <HeaderIconButtonTemplate
      icon={
        <div className="relative bg-transparent">
          {waitingCount > 0 && (
            <div className="absolute top-0.5 -right-0.5 bg-red-400 text-sm w-4 h-4 flex items-center justify-center font-semibold text-white z-1 rounded-full">
              !
            </div>
          )}
          <LuTimer className="!w-6 !h-6" />
        </div>
      }
      onClick={() => {}}
    />
  );
};
