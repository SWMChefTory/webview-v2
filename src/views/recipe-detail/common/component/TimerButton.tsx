import { TimerBottomSheet } from "@/src/widgets/timer/modal/ui/timerBottomSheet";
import {
  TimerState,
  useTimers,
} from "@/src/features/timer/useInProgressTimers";
import { LuTimer } from "react-icons/lu";
import { HeaderIconButtonTemplate } from "@/src/shared/ui/header/header";

export const TimerButton = ({
  recipeId,
  recipeName,
  onTimerClick,
}: {
  recipeId: string;
  recipeName: string;
  onTimerClick?: () => void;
}) => {
  const timers = useTimers(recipeId, recipeName);
  const timerActveCount = Array.from(
    timers.entries().filter(([_, timer]) => timer.state === TimerState.ACTIVE)
  ).length;

  return (
    // Amplitude: wrapper div로 클릭 이벤트 캡처 (이벤트 버블링)
    <div onClick={onTimerClick}>
      <TimerBottomSheet
        trigger={
          <TimerButtonDefault
            waitingCount={timerActveCount}
          />
        }
        recipeId={recipeId}
        recipeName={recipeName}
      />
    </div>
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
            <div className="absolute top-0.5 -right-0.5 bg-red-400 text-sm w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 flex items-center justify-center font-semibold text-white z-1 rounded-full">
              !
            </div>
          )}
          <LuTimer className="!w-6 !h-6 md:!w-7 md:!h-7 lg:!w-8 lg:!h-8" />
        </div>
      }
      onClick={() => {}}
    />
  );
};
