import { useEffect, useRef, useState } from "react";
import Picker from "react-mobile-picker";

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
import { createPortal } from "react-dom";
import { useTimerBottomSheetVisibility } from "./useTimerBottomSheetStore";
import { useInterval } from "@/src/shared/hooks/useInterval";
import { useLangcode, Lang } from "@/src/shared/translation/useLangCode";

// 다국어 메시지 포매터 정의
const formatTimerMessages = (lang: Lang) => {
  switch (lang) {
    case "en":
      return {
        autoClose: (seconds: number) => `Automatically closes in ${seconds}s.`,
        close: "Close",
        reset: "Reset",
        title: "Timer",
        start: "Start",
        units: {
          hour: "Hour",
          minute: "Min",
          second: "Sec",
        },
      };
    default:
      return {
        autoClose: (seconds: number) => `${seconds}초 후에 자동으로 종료돼요.`,
        close: "닫기",
        reset: "재설정",
        title: "타이머",
        start: "시작",
        units: {
          hour: "시간",
          minute: "분",
          second: "초",
        },
      };
  }
};

export function TimerBottomSheet({
  trigger = null,
  recipeId,
  recipeName,
  isDarkMode = false,
  isLandscape = false,
}: {
  trigger?: React.ReactNode;
  recipeId: string;
  recipeName: string;
  isDarkMode?: boolean;
  isLandscape?: boolean;
}) {
  const { open, endAt, handleOpenTemporarily, handleClose, handleOpen } =
    useTimerBottomSheetVisibility();
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
  const [remaingTime, setRemainingTime] = useState<number | null>(null);

  // 1. 언어 설정 및 메시지 가져오기
  const lang = useLangcode();
  const messages = formatTimerMessages(lang);

  useInterval(
    () => {
      if (endAt) {
        setRemainingTime(Math.ceil((endAt.getTime() - Date.now()) / 1000));
      }
    },
    endAt ? 200 : null
  );

  useEffect(() => {
    if (!endAt) {
      setRemainingTime(null);
    }
  }, [endAt]);

  return (
    <div>
      <div
        className="z-[1000] bg-transparent"
        onClick={() => {
          // handleFlip();
          handleOpenTemporarily({ seconds: 5 });
        }}
      >
        {trigger}
      </div>
      {timers.size === 0 &&
        open &&
        createPortal(
          <div
            className={`${
              isLandscape
                ? "fixed bottom-0 top-0 right-0 w-[36vw] z-[1002] bg-gray-200 rounded-l-[20px]"
                : "fixed bottom-0 left-0 right-0 z-[1002] bg-gray-200 rounded-t-[20px]"
            }`}
            onPointerDown={() => handleOpen()}
            onPointerUp={() => handleOpenTemporarily({ seconds: 5 })}
          >
            {endAt && remaingTime && remaingTime > 0 && remaingTime < 4 && (
              <div className="flex w-full justify-center items-center p-2">
                {messages.autoClose(remaingTime)}
              </div>
            )}
            <TimerStarter
              handleClose={handleClose}
              onStartTimer={({ duration, timerName }) => {
                handleStartTimer({ timerName, duration });
              }}
              messages={messages} // 메시지 전달
            />
          </div>,
          document.body
        )}
      {open && timers.size !== 0 && (
        <>
          {createPortal(
            <div
              className={`flex flex-col ${
                isDarkMode ? "bg-gray-200/30" : "bg-gray-200/80"
              }  z-[1002] fixed bottom-0 right-0 px-1 pb-1 ${
                isLandscape
                  ? "top-0 right-0 w-[36vw] rounded-l-[20px]"
                  : "left-0 rounded-t-[20px]"
              }`}
              onPointerDown={() => handleOpen()}
              onPointerUp={() => handleOpenTemporarily({ seconds: 5 })}
            >
              {endAt && remaingTime && remaingTime > 0 && remaingTime < 4 && (
                <div className="w-full px-4 py-4">
                  <div className="flex w-full justify-center items-center p-1 bg-white rounded-md">
                    {messages.autoClose(remaingTime)}
                  </div>
                </div>
              )}
              <div
                data-vaul-no-drag
                className="flex-1 px-1 py-1 overflow-y-auto"
              >
                <div className="flex items-center px-4 justify-between">
                  <button
                    onClick={handleClose}
                    className="text-lg text-orange-500 p-2"
                  >
                    {messages.close}
                  </button>
                  <button
                    onClick={() => {
                      handleDeleteTimer({ id: Array.from(timers.keys())[0] });
                    }}
                    className="text-lg text-orange-500 p-2"
                  >
                    {messages.reset}
                  </button>
                </div>
                <div data-vaul-no-drag className="gap-2 p-1">
                  {[...timers.entries()].map(([id, timer]) => {
                    switch (timer.state) {
                      case TimerState.ACTIVE:
                        return (
                          <ActiveTimerItem
                            timer={timer}
                            onPause={() => handlePauseTimer({ id })}
                            onCancel={() => handleCancelTimer({ id })}
                            onFinish={() =>
                              handleFinishTimerSuccessfully({ id })
                            }
                            key={`active-${id}`}
                          />
                        );
                      case TimerState.PAUSED:
                        return (
                          <PausedTimerItem
                            timer={timer}
                            onCancel={() => handleCancelTimer({ id })}
                            onResume={() => handleResumeTimer({ id })}
                            key={`paused-${id}`}
                          />
                        );
                      case TimerState.IDLE:
                        return (
                          <IdleTimerItem
                            timer={timer}
                            onStart={() => handleReplayTimer({ id })}
                            key={`idle-${id}`}
                          />
                        );
                    }
                  })}
                </div>
              </div>
            </div>,
            document.body
          )}
        </>
      )}
    </div>
  );
}

function TimerStarter({
  handleClose,
  onStartTimer,
  messages,
}: {
  handleClose: () => void;
  onStartTimer: ({
    duration,
    timerName,
  }: {
    duration: number;
    timerName: string;
  }) => void;
  messages: ReturnType<typeof formatTimerMessages>;
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
      <div className="px-4 py-3 flex-shrink-0  rounded-md">
        <div className="flex justify-between items-center p-2">
          <button onClick={handleClose} className="text-lg text-orange-500 p-2">
            {messages.close}
          </button>
          <div className="text-xl font-bold text-gray-900">
            {messages.title}
          </div>
          <button
            className={`text-lg p-2 ${
              isInvalid ? "text-gray-500" : "text-orange-500"
            }`}
            onClick={handleConfirm}
            disabled={isInvalid}
          >
            {messages.start}
          </button>
        </div>
      </div>
      <div className="bg-white pb-4 z-10">
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
            {messages.units.hour}
          </span>
          <span className="text-sm text-gray-500 flex-1 flex justify-center">
            {messages.units.minute}
          </span>
          <span className="text-sm text-gray-500 flex-1 flex justify-center">
            {messages.units.second}
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