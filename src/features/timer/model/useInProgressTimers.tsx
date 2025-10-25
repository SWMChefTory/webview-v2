import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import {
  cancelNotification,
  scheduleNotification,
} from "../utils/notification";
import {
  startLiveActivity,
  pauseLiveActivity,
  resumeLiveActivity,
  endLiveActivity,
} from "../utils/liveActivity";

export enum TimerState {
  WAITING = "WAITING",
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED",
  FINISHED = "FINISHED",
}

export interface TimerBase {
  state: TimerState;
  recipeId: string | null;
  recipeName: string | null;
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

export interface FinishedTimer extends TimerBase {
  state: TimerState.FINISHED;
}

export type Timer = ActiveTimer | PausedTimer | FinishedTimer;

interface TimersStoreState {
  timers: Map<string, Timer>;
  addActiveTimer: ({ id, timer }: { id: string; timer: Timer }) => void;
  getTimerById: (id: string) => Timer;
  getIdOfAllTimers: () => string[];
  deleteTimer: (id: string) => void;
}

export class TimerLimitExceededError extends Error {
  constructor() {
    super("타이머는 최대 5개 까지 실행 할 수 있습니다. ");
    this.name = "TimerLimitExceededError";
  }
}

const useTimersStore = create<TimersStoreState>()(
  persist(
    (set, get) => ({
      timers: new Map(),
      // 같은 id로 추가하면 기존 타이머를 덮어씌우기 때문에 굳이 delete 해줄 필요 없음.
      addActiveTimer: ({ id, timer }: { id: string; timer: Timer }) => {
        if (!get().timers.has(id) && get().timers.size >= 5) {
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
              if (t.state === TimerState.FINISHED) return 1;
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
      name: "timer-store-4",

      partialize: (state) => ({
        timers: Array.from(state.timers.entries()),
      }),

      onRehydrateStorage: () => (state) => {
        if (!state?.timers) return;

        // 1) 배열 → Map으로
        const raw = new Map(state.timers as unknown as [string, any][]);

        // 2) 각 타이머의 날짜 필드 복원
        const revived = new Map<string, Timer>();
        for (const [id, t] of raw) {
          const base = { ...t, createdAt: new Date(t.createdAt) };
          if (t.state === TimerState.ACTIVE) {
            revived.set(id, {
              ...base,
              endAt: new Date(t.endAt),
            } as ActiveTimer);
          } else {
            revived.set(id, base as Timer);
          }
        }

        state.timers = revived;
      },
    }
  )
);

/**
 * @throws TimerLimitExceededError 타이머를 5개 이상 실행 시키려 하면 발생하는 에러
 */
export const useTimers = () => {
  const { addActiveTimer, getTimerById, getIdOfAllTimers, deleteTimer } =
    useTimersStore();

  const handleStartTimer = ({
    recipeId,
    name,
    duration,
  }: {
    recipeId: string | null;
    name: string | null;
    duration: number;
  }) => {
    const id = uuidv4();
    const timer: ActiveTimer = startTimer({ name, recipeId, duration });
    addActiveTimer({ id, timer: timer });
    startLiveActivity({
      timerId: id,
      activityName: name || "셰프토리 타이머",
      endAt: timer.endAt.getTime(),
      recipeId: recipeId || "",
      validTimerIds: getIdOfAllTimers(),
    });
    scheduleNotification({
      timerId: id,
      recipeId: recipeId || "",
      recipeTitle: name || "",
      remainingSeconds: timer.duration,
    });
    return id;
  };

  const handlePauseTimer = ({ id }: { id: string }) => {
    const timer = getTimerById(id);
    if (!timer) {
      throw new Error("Timer not found");
    }
    if (timer.state !== TimerState.ACTIVE) {
      throw new Error("타이머를 중지시키려면 ACTIVE 상태여야 합니다.");
    }
    const pausedTimer: PausedTimer = pauseTimer(timer as ActiveTimer);
    pauseLiveActivity({
      timerId: id,
      startedAt: timer.createdAt.getTime(),
      pausedAt: Date.now(),
      duration: timer.duration,
      remainingTime: pausedTimer.remainingTime,
    });

    addActiveTimer({ id, timer: pausedTimer });
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
    const resumedTimer: ActiveTimer = resumeTimer(timer as PausedTimer);
    addActiveTimer({ id, timer: resumedTimer });
    resumeLiveActivity({
      timerId: id,
      startedAt: timer.createdAt.getTime(),
      endAt: resumedTimer.endAt.getTime(),
      duration: resumedTimer.duration,
    });
    scheduleNotification({
      timerId: id,
      recipeId: "",
      recipeTitle: "",
      remainingSeconds: timer.remainingTime,
    });

    return id;
  };

  const handleFinishTimer = ({ id }: { id: string }) => {
    const timer = getTimerById(id);
    if (!timer) {
      throw new Error("Timer not found");
    }
    if (timer.state !== TimerState.ACTIVE) {
      throw new Error("타이머를 완료시키려면 ACTIVE 상태여야 합니다.");
    }
    const finishedTimer: FinishedTimer = finishTimer(timer as ActiveTimer);
    addActiveTimer({ id, timer: finishedTimer });
    endLiveActivity({
      timerId: id,
    });
    cancelNotification({ timerId: id });
    return id;
  };

  const handleCancelTimer = ({ id }: { id: string }) => {
    const timer = getTimerById(id);
    if (!timer) {
      throw new Error("Timer not found");
    }
    deleteTimer(id);
    cancelNotification({ timerId: id });
    endLiveActivity({ timerId: id });
  };

  const handleDeleteTimerByRecipeId = ({ recipeId }: { recipeId: string }) => {
    const timerIds = getIdOfAllTimers();
    for (const timerId of timerIds) {
      const timer = getTimerById(timerId);
      if (timer?.recipeId === recipeId) {
        deleteTimer(timerId);
      }
    }
  };

  return {
    getIdOfAllTimers,
    getTimerById,
    handleDeleteTimer: deleteTimer,
    handleStartTimer,
    handlePauseTimer,
    handleResumeTimer,
    handleFinishTimer,
    handleCancelTimer,
    handleDeleteTimerByRecipeId,
  };
};

function startTimer({
  recipeId,
  name,
  duration,
}: {
  recipeId: string | null;
  name: string | null;
  duration: number;
}): ActiveTimer {
  if (duration <= 0) {
    throw new Error("Duration must be greater than 0");
  }
  const now = new Date();
  const endAt = new Date(now.getTime() + duration * 1000);

  return {
    createdAt: now,
    state: TimerState.ACTIVE,
    recipeId,
    recipeName: name,
    duration,
    endAt,
  };
}

function resumeTimer(pausedTimer: PausedTimer): ActiveTimer {
  const endAt = new Date(Date.now() + pausedTimer.remainingTime * 1000);

  return {
    state: TimerState.ACTIVE,
    recipeId: pausedTimer.recipeId,
    recipeName: pausedTimer.recipeName,
    duration: pausedTimer.duration,
    createdAt: pausedTimer.createdAt,
    endAt,
  };
}

function pauseTimer(activeTimer: ActiveTimer): PausedTimer {
  const now = Date.now();
  const remainingMs = activeTimer.endAt.getTime() - now;
  const remainingTime = Math.max(0, Math.round(remainingMs / 1000));

  return {
    state: TimerState.PAUSED,
    recipeId: activeTimer.recipeId,
    recipeName: activeTimer.recipeName,
    duration: activeTimer.duration,
    createdAt: activeTimer.createdAt,
    remainingTime: remainingTime,
  };
}

function finishTimer(activeTimer: ActiveTimer): FinishedTimer {
  return {
    state: TimerState.FINISHED,
    recipeId: activeTimer.recipeId,
    recipeName: activeTimer.recipeName,
    duration: activeTimer.duration,
    createdAt: activeTimer.createdAt,
  };
}

export interface TimerStoreState {
  state: TimerState;
  recipeId: string | null;
  name: string | null;
  duration: number;
  remainingTime: number;
  startedAt: number | null;
  pausedAt: number | null;
  deadlineAt: number | null;

  setName: (v: string) => void;
  setRecipeId: (id: string | null) => void;
  setDuration: (sec: number) => void;
  setRemaining: (sec: number) => void;
  hasActiveTimer: () => boolean;

  start: (params: { name: string; recipeId: string; duration: number }) => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  finish: () => void;
  isRunning: () => boolean;
  syncAfterRestore: () => void;
}

export const useTimerStore = create<TimerStoreState>()(
  persist(
    (set, get) => ({
      state: TimerState.WAITING,
      name: null,
      duration: 0,
      remainingTime: 0,
      startedAt: null,
      pausedAt: null,
      deadlineAt: null,
      recipeId: null,

      setName: (v) => set({ name: v }),
      setRecipeId: (id) => set({ recipeId: id }),

      //duration은 처음에만 설정
      setDuration: (sec) => {
        const next = Math.max(0, sec || 0);
        const s = get();
        if (s.state === TimerState.WAITING) {
          set({ duration: next, remainingTime: next });
          return;
        }
        throw new Error("Timer is not waiting");
      },

      setRemaining: (sec) => {
        set({ remainingTime: Math.max(0, sec || 0) });
      },

      getTimerStatus: () => {
        return get().state;
      },

      start: (params) => {
        const now = Date.now();
        const nextDuration = Math.max(0, params.duration);

        set({
          name: params.name,
          recipeId: params.recipeId,
          duration: nextDuration,
          remainingTime: nextDuration,
        });

        if (nextDuration <= 0) {
          set({
            state: TimerState.FINISHED,
            startedAt: null,
            pausedAt: null,
            deadlineAt: null,
            remainingTime: 0,
          });
          return;
        }

        set({
          state: TimerState.ACTIVE,
          startedAt: now,
          pausedAt: null,
          deadlineAt: now + nextDuration * 1000,
          remainingTime: nextDuration,
        });
      },

      pause: () => {
        const now = Date.now();
        const s = get();
        if (s.state !== TimerState.ACTIVE) return;

        let remain = s.remainingTime;
        if (s.deadlineAt) {
          const remainingMs = s.deadlineAt - now;
          remain = Math.max(0, Math.round(remainingMs / 100) / 10);
        }

        set({
          state: TimerState.PAUSED,
          pausedAt: now,
          deadlineAt: null,
          remainingTime: remain,
        });
      },

      resume: () => {
        const now = Date.now();
        const s = get();
        if (s.state !== TimerState.PAUSED) return;

        const remain = Math.max(0, s.remainingTime);
        if (remain <= 0) {
          set({
            state: TimerState.FINISHED,
            startedAt: null,
            pausedAt: null,
            deadlineAt: null,
            remainingTime: 0,
          });
          return;
        }

        set({
          state: TimerState.ACTIVE,
          startedAt: now,
          pausedAt: null,
          deadlineAt: now + remain * 1000,
          remainingTime: remain,
        });
      },

      reset: () => {
        const dur = Math.max(0, get().duration);
        set({
          state: TimerState.WAITING,
          startedAt: null,
          pausedAt: null,
          deadlineAt: null,
          remainingTime: dur,
          recipeId: null,
          name: null,
        });
      },

      isRunning: () => get().state === TimerState.ACTIVE,

      finish: () => {
        set({
          state: TimerState.FINISHED,
          startedAt: null,
          pausedAt: null,
          deadlineAt: null,
          remainingTime: 0,
        });
      },

      syncAfterRestore: () => {
        const s = get();
        const now = Date.now();

        if (s.state === TimerState.ACTIVE && s.deadlineAt) {
          const remainingMs = s.deadlineAt - now;

          if (remainingMs <= 0) {
            set({
              state: TimerState.FINISHED,
              startedAt: null,
              pausedAt: null,
              deadlineAt: null,
              remainingTime: 0,
            });
          } else {
            const remainingSec = Math.round(remainingMs / 100) / 10;
            set({ remainingTime: remainingSec });
          }
        }
      },

      hasActiveTimer: () => {
        const s = get();
        return s.state === TimerState.ACTIVE && s.deadlineAt !== null;
      },
    }),
    {
      name: "timer-store6",

      partialize: (state) => ({
        state: state.state,
        name: state.name,
        duration: state.duration,
        remainingTime: state.remainingTime,
        startedAt: state.startedAt,
        pausedAt: state.pausedAt,
        deadlineAt: state.deadlineAt,
        recipeId: state.recipeId,
      }),

      onRehydrateStorage: () => (state) => {
        if (state) {
          state.syncAfterRestore();
        }
      },
    }
  )
);
