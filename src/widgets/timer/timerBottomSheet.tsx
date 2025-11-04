import { useRef, useState } from "react";
import Picker from "react-mobile-picker";
import { Drawer } from "vaul";
import {
  useHandleTimers,
  useTimers,
  TimerState,
} from "@/src/features/timer/model/useInProgressTimers";
import {
  ActiveTimerItem,
  PausedTimerItem,
  IdleTimerItem,
} from "@/src/features/timer/ui/timerItem";

export function TimerBottomSheet({
  trigger,
  recipeId,
  recipeName,
}: {
  trigger: React.ReactNode;
  recipeId: string;
  recipeName: string;
}) {
  const [open, setOpen] = useState(false);
  const timers = useTimers(recipeId, recipeName);
  const {
    handleStartTimer,
    handlePauseTimer,
    handleResumeTimer,
    handleFinishTimerSuccessfully,
    handleCancelTimer,
    handleDeleteTimer,
    handleReplayTimer,
  } = useHandleTimers({ recipeId, recipeName });

  return (
    <Drawer.Root open={open} onOpenChange={setOpen} repositionInputs={false} >
      <Drawer.Trigger>{trigger}</Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[800]" />
        <Drawer.Content
          className="flex flex-col bg-gray-100 rounded-t-[20px] z-1000 fixed top-16 bottom-0 left-0 right-0 z-[1000]"
          style={{ height: "90dvh" }}
        >
          <TimerHeader
            onStartTimer={({ duration, timerName }) => {
              handleStartTimer({ timerName, duration });
            }}
          />
          <div
            data-vaul-no-drag
            className="flex-1 px-1 py-4 overflow-y-auto transform-gpu will-change-transform
      [backface-visibility:hidden]"
          >
            <div
              data-vaul-no-drag
              className="grid grid-cols-2 auto-rows-max gap-2 p-1"
            >
              {timers.entries().map(([id, timer]) => {
                switch (timer.state) {
                  case TimerState.ACTIVE:
                    return (
                      <ActiveTimerItem
                        timer={timer}
                        onDelete={() => handleDeleteTimer({ id })}
                        onPause={() => handlePauseTimer({ id })}
                        onCancel={() => handleCancelTimer({ id })}
                        onFinish={() => handleFinishTimerSuccessfully({ id })}
                      />
                    );
                  case TimerState.PAUSED:
                    return (
                      <PausedTimerItem
                        timer={timer}
                        onDelete={() => handleDeleteTimer({ id })}
                        onCancel={() => handleCancelTimer({ id })}
                        onResume={() => handleResumeTimer({ id })}
                      />
                    );
                  case TimerState.IDLE:
                    return (
                      <IdleTimerItem
                        timer={timer}
                        onDelete={() => handleDeleteTimer({ id })}
                        onStart={() => handleReplayTimer({ id })}
                      />
                    );
                }
              })}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export function TimerButton() {
  return (
    <button
      className="flex h-[3.75rem] w-[3.75rem] items-center justify-center rounded-full bg-orange-500 p-2 shadow-[0_2px_16px_rgba(0,0,0,0.32)] transition active:scale-95"
      aria-label="타이머"
      type="button"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="13" r="8" stroke="#FFFFFF" strokeWidth="2" />
        <path
          d="M12 9v4l3 2"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 3h6"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}

function TimerHeader({
  onStartTimer,
}: {
  onStartTimer: ({
    duration,
    timerName,
  }: {
    duration: number;
    timerName: string;
  }) => void;
}) {
  const [pickerValue, setPickerValue] = useState({
    hours: 0,
    minutes: 5,
    seconds: 0,
  });
  const selections = {
    hours: Array.from({ length: 6 }, (_, i) => i),
    minutes: Array.from({ length: 60 }, (_, i) => i),
    seconds: Array.from({ length: 60 }, (_, i) => i),
  };
  const [timerName, setTimerName] = useState("");
  const totalSeconds =
    pickerValue.hours * 3600 + pickerValue.minutes * 60 + pickerValue.seconds;
  const isInvalid = totalSeconds === 0 || totalSeconds > 60 * 60 * 7;
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleConfirm = () => {
    if (!isInvalid) {
      onStartTimer({
        timerName: timerName,
        duration: totalSeconds,
      });
      setTimerName("");
    }
  };
  return (
    <>
      <div className="p-4 flex-shrink-0">
        <div className="mx-auto w-12 h-1.5 flex-shrink-0 bg-gray-300 mb-4" />
        <div className="flex justify-between items-center">
          <Drawer.Close asChild>
            <button className="text-lg text-orange-500 p-2">취소</button>
          </Drawer.Close>
          <Drawer.Title className="text-xl font-bold text-gray-900">
            타이머
          </Drawer.Title>
          <button
            className={`text-lg p-2 ${
              isInvalid ? "text-gray-500" : "text-orange-500"
            }`}
            onClick={handleConfirm}
            disabled={isInvalid}
          >
            시작
          </button>
        </div>
      </div>
      <input
        onChange={(e) => setTimerName(e.target.value)}
        type="text"
        value={timerName}
        className="w-full p-4 outline-none focus:outline-none focus:ring-0"
        placeholder="타이머 이름을 입력해주세요."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
          }
        }}
        enterKeyHint="done"
      />
      <div className="bg-white rounded-[20px] pb-4 shadow-md z-10">
        <div
          ref={scrollRef}
          data-vaul-no-drag
          className="py-4 overflow-y-auto flex-shrink-0"
        >
          <Picker
            value={pickerValue}
            onChange={setPickerValue}
            wheelMode="natural"
            height={128}
          >
            <TimeColumn name="hours" values={selections.hours} />
            <TimeColumn name="minutes" values={selections.minutes} />
            <TimeColumn name="seconds" values={selections.seconds} />
          </Picker>
        </div>

        <div className="flex pt-2">
          <span className="text-sm text-gray-500 flex-1 flex justify-center">
            시간
          </span>
          <span className="text-sm text-gray-500 flex-1 flex justify-center">
            분
          </span>
          <span className="text-sm text-gray-500 flex-1 flex justify-center">
            초
          </span>
        </div>
      </div>
    </>
  );
}

function TimeColumn({ values, name }: { values: number[]; name: string }) {
  return (
    <Picker.Column name={name}>
      {values.map((value) => (
        <Picker.Item key={value} value={value}>
          {({ selected }) => (
            <div
              className={`text-center py-3 transition-all ${
                selected
                  ? "text-orange-500 font-bold text-2xl"
                  : "text-gray-400 text-lg"
              }`}
            >
              {String(value).padStart(2, "0")}
            </div>
          )}
        </Picker.Item>
      ))}
    </Picker.Column>
  );
}
