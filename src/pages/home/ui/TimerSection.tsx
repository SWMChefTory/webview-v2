import { EmptyTimerItem, TimerItem } from "@/src/pages/timer/ui/timerItem";
import { useTimers } from "@/src/pages/timer/model/useInProgressTimers";
import { motion } from "motion/react";
import { IoChevronForwardOutline } from "react-icons/io5";
import Link from "next/link";
import Timer from "@/src/pages/home/ui/assets/schedule.png";

export function TimerSection() {
  const { getIdOfAllTimers } = useTimers();
  const timerIds = getIdOfAllTimers();
  if (timerIds.length === 0) {
    return <>
    <TimerTitle />
    <div className="h-3" />
    <div className="flex flex-row pl-4 overflow-x-auto">
      <EmptyTimerItem />
    </div>
    </>;
  }
  return (
    <>
      <TimerTitle />
      <div className="h-3" />
      <div className="overflow-x-auto">
      <div className="flex flex-row pl-4 gap-2">
        {timerIds.map((timerId) => (
          <TimerItem key={timerId} timerId={timerId} isShort={true} />
        ))}
      </div>
      </div>
    </>
  );
}

const TimerTitle = () => {
  return (
    <Link href="/timer" className="w-full h-full">
      <motion.div
        className="h-[44] flex flex-row items-center pl-4 text-2xl font-semibold"
        whileTap={{ opacity: 0.2 }}
        transition={{ duration: 0.2 }}
      >
        <img src={Timer.src} className="size-6" />
        <div className="pr-1" />
        타이머 기록
        <IoChevronForwardOutline className="size-6" color="black" />
      </motion.div>
    </Link>
  );
};
