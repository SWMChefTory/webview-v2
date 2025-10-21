import Header, { BackButton } from "@/src/shared/ui/header";
import TimerPageContent from "./ui";
import { useRouter } from "next/router";
import { TimerBottomSheet } from "./ui/timerBottomSheet";
import HydrationZustand from "@/src/shared/hydration_zustand/hydrationZustand";

function TimerPage() {
  const router = useRouter();
  return (
    <HydrationZustand>
      <Header
        leftContent={<div className="z-10">
            <BackButton onClick={() => {
            router.back();
            console.log("back");
        }} />
        </div>}
        centerContent={<div className="text-lg font-bold">타이머 설정</div>}
        rightContent={<TimerBottomSheet />}
        color="bg-white"
      />
      <TimerPageContent />
    </HydrationZustand>
  );
}

export default TimerPage;
