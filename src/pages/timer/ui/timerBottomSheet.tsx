import { AddButton } from "@/src/shared/ui/header";
import { useRef, useState } from "react";
import Picker from "react-mobile-picker";
import { Drawer } from "vaul";
import {
  TimerLimitExceededError,
  useTimers,
} from "../model/useInProgressTimers";
import { useIdleTimersStore } from "../model/useIdleTimers";
import { TimerItem, IdleTimerItem } from "./timerItem";
import { toast } from "sonner";

function TimerButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="flex h-[3.75rem] w-[3.75rem] items-center justify-center rounded-full bg-orange-500 p-2 shadow-[0_2px_16px_rgba(0,0,0,0.32)] transition active:scale-95"
      onClick={onClick}
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

export function TimerBottomSheet({
  type = "plus",
  recipeId,
  recipeName,
}: {
  type?: "plus" | "button";
  recipeId?: string;
  recipeName?: string;
}) {
  const [open, setOpen] = useState(false);
  const { handleStartTimer } = useTimers();
  const { addIdleTimer } = useIdleTimersStore();
  const { getIdOfAllTimers } = useTimers();
  const { getSortedIdleTimers } = useIdleTimersStore();
  const [pickerValue, setPickerValue] = useState({
    hours: 0,
    minutes: 5,
    seconds: 0,
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  const totalSeconds =
    pickerValue.hours * 3600 + pickerValue.minutes * 60 + pickerValue.seconds;

  const isInvalid = totalSeconds === 0 || totalSeconds > 60 * 60 * 7;

  const selections = {
    hours: Array.from({ length: 6 }, (_, i) => i),
    minutes: Array.from({ length: 60 }, (_, i) => i),
    seconds: Array.from({ length: 60 }, (_, i) => i),
  };

  const handleConfirm = () => {
    if (!isInvalid) {
      try {
        handleStartTimer({
          recipeId: recipeId ?? null,
          name: recipeName ?? null,
          duration: totalSeconds,
        });
      } catch (error) {
        if (error instanceof TimerLimitExceededError) {
          toast.error(error.message);
        }
      }
      addIdleTimer(totalSeconds);
      setOpen(false);
    }
  };

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        {type === "plus" ? (
          <AddButton onClick={() => setOpen(true)} />
        ) : (
          <TimerButton
            onClick={() => {
              setOpen(true);
            }}
          />
        )}
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-1000" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[20px] z-1000 h-[80vh] mt-24 fixed bottom-0 left-0 right-0">
          <div className="p-4 bg-white rounded-t-[20px] flex-shrink-0">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-4" />
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

          <div
            ref={scrollRef}
            data-vaul-no-drag
            className="px-6 py-4 overflow-y-auto "
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
            <div data-vaul-no-drag className="flex flex-col pt-6 gap-2">
              {getIdOfAllTimers().map((timerId) => (
                <TimerItem key={timerId} timerId={timerId} />
              ))}
              {getSortedIdleTimers().map(([time]) => (
                <IdleTimerItem key={time} time={time} />
              ))}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
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
