import { useTimers } from "../model/useInProgressTimers";
import { TimerBottomSheet } from "./timerBottomSheet";
import { useIdleTimersStore } from "../model/useIdleTimers";
import { TimerItem, IdleTimerItem } from "./timerItem";
export { TimerBottomSheet };

export default function TimerList() {
  const { getIdOfAllTimers } = useTimers();
  const { getSortedIdleTimers } = useIdleTimersStore();
  return (
    <div className="w-full h-screen flex flex-col px-4 text-gray-700 font-sans">
      <div className="h-6 w-full shrink-0" />
        <div className="text-lg text-orange-500 px-2">진행 중인 타이머</div>
      <div className="h-2 shrink-0" />
      <div className="flex flex-col gap-4 px-4">
        {getIdOfAllTimers().map((timerId) => (
          <TimerItem key={timerId} timerId={timerId} />
        ))}
      </div>
      <div className="h-6 shrink-0"></div>
      <div className="text-lg text-gray-500 px-2">최근 항목</div>
      <div className="h-2 shrink-0" />
      <div className="flex flex-col gap-4 px-4">
        {getSortedIdleTimers().map(([time]) => (
          <IdleTimerItem key={time} time={time} />
        ))}
      </div>
    </div>
  );
}
