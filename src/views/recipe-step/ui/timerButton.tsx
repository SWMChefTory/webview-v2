import { TimerBottomSheet } from "@/src/widgets/timer/modal/ui/timerBottomSheet";
import {
  TimerState,
  useTimers,
} from "@/src/features/timer/useInProgressTimers";
import { LuTimer } from "react-icons/lu";
import { HeaderIconButtonTemplate } from "@/src/shared/ui/header/header";

export const HeaderTimerButton = ({
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
        trigger={<TimerButtonDefault waitingCount={timerActveCount} />}
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
            <div className="absolute top-0.5 -right-0.5 bg-red-400 text-sm w-4 h-4 flex items-center justify-center font-semibold text-white z-1 rounded-full">
              !
            </div>
          )}
          <LuTimer color="#ffffff" className="!w-6 !h-6" />
        </div>
      }
      onClick={() => {}}
    />
  );
};
