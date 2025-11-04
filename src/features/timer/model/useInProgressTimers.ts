// import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import {
  cancelNotification,
  scheduleNotification,
} from "../utils/notification";
import { startLiveActivity, endLiveActivity } from "../utils/liveActivity";
import { createStore, StoreApi } from "zustand/vanilla";
import { useStoreWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";

export enum TimerState {
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED",
  IDLE = "IDLE",
}

export interface TimerBase {
  timerName: string;
  state: TimerState;
  createdAt: Date;
  duration: number;
}

export interface ActiveTimer extends TimerBase {
  state: TimerState.ACTIVE;
  endAt: Date;
}

export interface PausedTimer extends TimerBase {
  state: TimerState.PAUSED;
  remainingTime: number;
}

export interface IdleTimer extends TimerBase {
  state: TimerState.IDLE;
}

export type Timer = ActiveTimer | PausedTimer | IdleTimer;

interface TimersStoreState {
  recipeId: string;
  recipeName: string;
  timers: Map<string, Timer>;
  addTimer: ({ id, timer }: { id: string; timer: Timer }) => void;
  getTimerById: (id: string) => Timer;
  getIdOfAllTimers: () => string[];
  deleteTimer: (id: string) => void;
}

export class TimerLimitExceededError extends Error {
  constructor() {
    super("타이머는 1개만 실행 할 수 있습니다. ");
    this.name = "TimerLimitExceededError";
  }
}

const createTimerStore = ({
  recipeId,
  recipeName,
}: {
  recipeId: string;
  recipeName: string;
}) =>
  createStore<TimersStoreState>()(
    persist(
      (set, get) => ({
        recipeId,
        recipeName,
        timers: new Map(),
        addTimer: ({ id, timer }: { id: string; timer: Timer }) => {
          if (!get().timers.has(id) && get().timers.size >= 1) {
            throw new TimerLimitExceededError();
          }
          set({ timers: new Map([...get().timers, [id, timer]]) });
        },
        deleteTimer: (id: string) => {
          const newTimers = new Map(get().timers);
          newTimers.delete(id);
          set({ timers: newTimers });
        },
        getTimerById: (id: string) => {
          const timer = get().timers.get(id);
          if (!timer) {
            throw new Error("Timer not found");
          }
          return timer;
        },
        getIdOfAllTimers: () => {
          const timers = Array.from(get().timers.entries());

          return timers
            .sort(([, a], [, b]) => {
              const order = (t: Timer) => {
                if (t.state !== TimerState.IDLE) return 1;
                return 0;
              };
              const stateDiff = order(a) - order(b);
              if (stateDiff !== 0) return stateDiff;
              return b.createdAt.getTime() - a.createdAt.getTime();
            })
            .map(([id]) => id);
        },
      }),
      {
        name: `timer-store-${recipeId}-1`,
        partialize: (state) => ({
          recipeId,
          recipeName,
          timers: [...state.timers].map(([id, timer]) => {
            const base = {
              ...timer,
              createdAt: timer.createdAt.getTime(),
            };
            switch (timer.state) {
              case TimerState.ACTIVE:
                return [id, { ...base, endAt: timer.endAt.getTime() }];
              default:
                return [id, base];
            }
          }),
        }),
        onRehydrateStorage: () => (state) => {
          if (!state?.timers) return;
          const newTimers = new Map();
          for (const [id, timer] of state.timers) {
            const base = {
              ...timer,
              createdAt: new Date(timer.createdAt),
            };
            if (base.state === TimerState.ACTIVE) {
              newTimers.set(id, {
                ...base,
                endAt: new Date(base.endAt),
              });
            } else {
              newTimers.set(id, base);
            }
          }
          state.timers = newTimers;
        },
      }
    )
  );

//clear하는 함수도 차후에 구현해야 함.

const registry = new Map<string, StoreApi<TimersStoreState>>();

function getOrCreateRecipeStore(recipeId: string, recipeName: string) {
  const store = registry.get(recipeId);
  if (store) {
    return store;
  }
  const newStore = createTimerStore({ recipeId, recipeName });
  registry.set(recipeId, newStore);
  return newStore;
}

// function disposeRecipeStore(recipeId: string) {
//   const store = registry.get(recipeId);
//   if (store) {
//     registry.delete(recipeId);
//   }
// }

// function listRecipeStores() {
//   return Array.from(registry.keys());
// }

export function useTimers(recipeId: string, recipeName: string) {
  const store = getOrCreateRecipeStore(recipeId, recipeName);
  return useStoreWithEqualityFn(store, (state) => state.timers, shallow);
}

/**
 * @throws TimerLimitExceededError 타이머를 5개 이상 실행 시키려 하면 발생하는 에러
 */
export const useHandleTimers = ({
  recipeId,
  recipeName,
}: {
  recipeId: string;
  recipeName: string;
}) => {
  const timersStore = getOrCreateRecipeStore(recipeId, recipeName);
  const { addTimer, getIdOfAllTimers, getTimerById, deleteTimer } =
    timersStore.getState();

  const handleStartTimer = ({
    timerName,
    duration,
  }: {
    timerName: string;
    duration: number;
  }) => {
    const timerId = uuidv4();
    const activeTimer = createStartTimer({ timerName, duration });
    addTimer({ id: timerId, timer: activeTimer });

    startLiveActivity({
      timerId,
      activityName: createTitle({ timerName, recipeName }),
      endAt: activeTimer.endAt.getTime(),
      recipeId: recipeId,
      validTimerIds: getIdOfAllTimers(),
    });
    scheduleNotification({
      timerId,
      recipeId: recipeId,
      recipeTitle: createTitle({ timerName, recipeName }),
      remainingSeconds: activeTimer.duration,
    });
    return timerId;
  };

  const handlePauseTimer = ({ id }: { id: string }) => {
    const timer = getTimerById(id);
    if (!timer) {
      throw new Error("Timer not found");
    }
    if (timer.state !== TimerState.ACTIVE) {
      throw new Error("타이머를 중지시키려면 ACTIVE 상태여야 합니다.");
    }
    const pausedTimer: PausedTimer = createPauseTimer(timer as ActiveTimer);
    endLiveActivity({
      timerId: id,
    });
    addTimer({ id, timer: pausedTimer });
    cancelNotification({ timerId: id });
    return id;
  };

  const handleResumeTimer = ({ id }: { id: string }) => {
    const timer = getTimerById(id);
    if (!timer) {
      throw new Error("Timer not found");
    }
    if (timer.state !== TimerState.PAUSED) {
      throw new Error("타이머를 재개시키려면 PAUSED 상태여야 합니다.");
    }
    const activeTimer = createResumeTimer(timer as PausedTimer);
    addTimer({ id, timer: activeTimer });
    startLiveActivity({
      timerId: id,
      activityName: createTitle({ timerName: timer.timerName, recipeName }),
      endAt: activeTimer.endAt.getTime(),
      recipeId: recipeId,
      validTimerIds: getIdOfAllTimers(),
    });
    scheduleNotification({
      timerId: id,
      recipeId: recipeId,
      recipeTitle: createTitle({ timerName: timer.timerName, recipeName }),
      remainingSeconds: timer.remainingTime,
    });

    return id;
  };

  //티이머가 완료되었을 때 호출하는 함수
  const handleFinishTimerSuccessfully = ({ id }: { id: string }) => {
    const timer = getTimerById(id);
    if (!timer) {
      throw new Error("Timer not found");
    }
    if (timer.state !== TimerState.ACTIVE) {
      throw new Error("타이머를 완료시키려면 ACTIVE 상태여야 합니다.");
    }
    const idleTimer: IdleTimer = createIdleTimer(
      timer as ActiveTimer | PausedTimer
    );
    addTimer({ id, timer: idleTimer });
    endLiveActivity({
      timerId: id,
    });
    cancelNotification({ timerId: id });
    return id;
  };

  const handleReplayTimer = ({ id }: { id: string }) => {
    const timer = getTimerById(id);
    if (!timer) {
      throw new Error("Timer not found");
    }
    if (timer.state !== TimerState.IDLE) {
      throw new Error("타이머를 재생시키려면 IDLE 상태여야 합니다.");
    }
    const activeTimer = createStartTimer({
      timerName: timer.timerName,
      duration: timer.duration,
    });
    addTimer({ id, timer: activeTimer });
    startLiveActivity({
      timerId: id,
      activityName: timer.timerName,
      endAt: activeTimer.endAt.getTime(),
      recipeId: recipeId,
      validTimerIds: getIdOfAllTimers(),
    });
    scheduleNotification({
      timerId: id,
      recipeId: recipeId,
      recipeTitle: timer.timerName,
      remainingSeconds: activeTimer.duration,
    });
    return id;
  };

  //티이머를 취소했을 때 호출하는 함수
  const handleCancelTimer = ({ id }: { id: string }) => {
    const timer = getTimerById(id);
    if (!timer) {
      throw new Error("Timer not found");
    }
    const finishedTimer: IdleTimer = createIdleTimer(
      timer as ActiveTimer | PausedTimer
    );
    addTimer({ id, timer: finishedTimer });
    cancelNotification({ timerId: id });
    endLiveActivity({ timerId: id });
    return id;
  };

  //티이머를 삭제했을 때 호출하는 함수
  const handleDeleteTimer = ({ id }: { id: string }) => {
    const timer = getTimerById(id);
    if (!timer) {
      throw new Error("Timer not found");
    }
    deleteTimer(id);
    cancelNotification({ timerId: id });
    endLiveActivity({ timerId: id });
    return id;
  };

  return {
    getIdOfAllTimers,
    getTimerById,
    handleDeleteTimer,
    handleStartTimer,
    handlePauseTimer,
    handleResumeTimer,
    handleFinishTimerSuccessfully,
    handleCancelTimer,
    handleReplayTimer,
  };
};

function createStartTimer({
  timerName,
  duration,
}: {
  timerName: string;
  duration: number;
}): ActiveTimer {
  if (duration <= 0) {
    throw new Error("Duration must be greater than 0");
  }
  const now = new Date();
  const endAt = new Date(now.getTime() + duration * 1000);

  return {
    state: TimerState.ACTIVE,
    duration,
    timerName,
    createdAt: now,
    endAt,
  };
}

function createResumeTimer(pausedTimer: PausedTimer): ActiveTimer {
  const endAt = new Date(Date.now() + pausedTimer.remainingTime * 1000);
  return {
    state: TimerState.ACTIVE,
    duration: pausedTimer.duration,
    timerName: pausedTimer.timerName,
    createdAt: pausedTimer.createdAt,
    endAt,
  };
}

function createPauseTimer(activeTimer: ActiveTimer): PausedTimer {
  const now = Date.now();
  const remainingMs = activeTimer.endAt.getTime() - now;
  const remainingTime = Math.max(0, Math.round(remainingMs / 1000));

  return {
    state: TimerState.PAUSED,
    duration: activeTimer.duration,
    timerName: activeTimer.timerName,
    createdAt: activeTimer.createdAt,
    remainingTime: remainingTime,
  };
}

function createIdleTimer(activeTimer: ActiveTimer | PausedTimer): IdleTimer {
  return {
    state: TimerState.IDLE,
    duration: activeTimer.duration,
    timerName: activeTimer.timerName,
    createdAt: activeTimer.createdAt,
  };
}

function createTitle({
  timerName,
  recipeName,
}: {
  timerName: string;
  recipeName: string;
}): string {
  return `${timerName} - ${recipeName}`;
}
