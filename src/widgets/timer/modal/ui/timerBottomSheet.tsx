import { useEffect, useRef, useState } from "react";
import Picker from "react-mobile-picker";
import { cn } from "@/lib/utils";

import {
  useHandleTimers,
  useTimers,
  TimerState,
} from "@/src/features/timer/useInProgressTimers";
import {
  ActiveTimerItem,
  PausedTimerItem,
  IdleTimerItem,
} from "@/src/widgets/timer/modal/ui/timerItem";
import { createPortal } from "react-dom";
import { useTimerBottomSheetVisibility } from "../hooks/useTimerBottomSheetStore";
import { useInterval } from "@/src/shared/hooks/useInterval";
import { useTimerTranslation } from "@/src/entities/timer/hooks/useTimerTranslation";
import { HeaderIconButtonTemplate } from "@/src/shared/ui/header/header";
import { LuTimer } from "react-icons/lu";

export function TimerBottomSheet({
  trigger = null,
  recipeId,
  recipeName,
  isDarkMode = false,
  isLandscape = false,
  onTriggerClick,
}: {
  trigger?: React.ReactNode;
  recipeId: string;
  recipeName: string;
  isDarkMode?: boolean;
  isLandscape?: boolean;
  onTriggerClick?: () => void;
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

  const { t } = useTimerTranslation();

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
          onTriggerClick?.();
        }}
      >
        {trigger}
      </div>
      {timers.size === 0 &&
        open &&
        createPortal(
          <div
            className={cn(
              isLandscape
                ? "fixed bottom-0 top-0 right-0 w-[36vw] z-[1002] bg-gray-200 rounded-l-[20px]"
                : "fixed bottom-0 left-0 right-0 z-[1002] bg-gray-200 rounded-t-[20px] md:max-w-[600px] lg:max-w-[700px] md:mx-auto md:rounded-xl md:mb-4 md:shadow-2xl"
            )}
            onPointerDown={() => handleOpen()}
            onPointerUp={() => handleOpenTemporarily({ seconds: 5 })}
          >
            {endAt && remaingTime && remaingTime > 0 && remaingTime < 4 && (
              <div className="flex w-full justify-center items-center p-2">
                {t("autoClose", { seconds: remaingTime })}
              </div>
            )}
            <TimerStarter
              handleClose={handleClose}
              onStartTimer={({ duration, timerName }) => {
                handleStartTimer({ timerName, duration });
              }}
            />
          </div>,
          document.body
        )}
      {open && timers.size !== 0 && (
        <>
          {createPortal(
            <div
              className={cn(
                "flex flex-col z-[1002] fixed bottom-0 right-0 px-1 pb-1",
                isDarkMode ? "bg-gray-200/30" : "bg-gray-200/80",
                isLandscape
                  ? "top-0 right-0 w-[36vw] rounded-l-[20px]"
                  : "left-0 rounded-t-[20px] md:max-w-[600px] lg:max-w-[700px] md:mx-auto md:rounded-xl md:mb-4 md:shadow-2xl"
              )}
              onPointerDown={() => handleOpen()}
              onPointerUp={() => handleOpenTemporarily({ seconds: 5 })}
            >
              {endAt && remaingTime && remaingTime > 0 && remaingTime < 4 && (
                <div className="w-full px-4 py-4">
                  <div className="flex w-full justify-center items-center p-1 bg-white rounded-md">
                    {t("autoClose", { seconds: remaingTime })}
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
                    {t("close")}
                  </button>
                  <button
                    onClick={() => {
                      handleDeleteTimer({ id: Array.from(timers.keys())[0] });
                    }}
                    className="text-lg text-orange-500 p-2"
                  >
                    {t("reset")}
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
}: {
  handleClose: () => void;
  onStartTimer: ({
    duration,
    timerName,
  }: {
    duration: number;
    timerName: string;
  }) => void;
}) {
  const { t } = useTimerTranslation();
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
            {t("close")}
          </button>
          <div className="text-xl font-bold text-gray-900">{t("title")}</div>
          <button
            className={cn(
              "text-lg p-2",
              isInvalid ? "text-gray-500" : "text-orange-500"
            )}
            onClick={handleConfirm}
            disabled={isInvalid}
          >
            {t("start")}
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
            {t("units.hour")}
          </span>
          <span className="text-sm text-gray-500 flex-1 flex justify-center">
            {t("units.minute")}
          </span>
          <span className="text-sm text-gray-500 flex-1 flex justify-center">
            {t("units.second")}
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
              className={cn(
                "text-center py-3 transition-all",
                selected
                  ? "text-orange-500 font-bold text-2xl"
                  : "text-gray-400 text-lg"
              )}
            >
              {String(value).padStart(2, "0")}
            </div>
          )}
        </Picker.Item>
      ))}
    </Picker.Column>
  );
}
