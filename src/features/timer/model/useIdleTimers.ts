import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IdleTimersStoreState {
  idleTimers: Map<number, number>; // key: duration(sec), value: lastUpdatedAt(ms)
  addIdleTimer: (duration: number) => void;
  clearIdleTimers: () => void;
  getSortedIdleTimers: () => [number, number][];
}

function toMap(m: unknown): Map<number, number> {
  if (m instanceof Map) return m;
  if (Array.isArray(m)) return new Map(m as [number, number][]);
  return new Map();
}

const useIdleTimersStore = create<IdleTimersStoreState>()(
  persist(
    (set, get) => ({
      idleTimers: new Map(),

      addIdleTimer: (duration: number) => {
        const updated = new Map(get().idleTimers);
        updated.set(duration, Date.now());
        const oldestDuration = (() => {
          if (updated.size <= 10) return -1;
          let oldestTime = new Date(8640000000000000).getTime();
          let oldestDuration = 0;
          updated.entries().forEach(([key, value]) => {
            if (value < oldestTime) {
              oldestTime = value;
              oldestDuration = key;
            }
          });
          return oldestDuration;
        })();
        updated.delete(oldestDuration);
        set({ idleTimers: updated });
      },

      clearIdleTimers: () => set({ idleTimers: new Map() }),

      getSortedIdleTimers: () => {
        return Array.from(get().idleTimers.entries()).sort(
          ([a], [b]) => a - b // duration 기준 오름차순 정렬
        );
      },
    }),
    {
      name: "idle-timer-store-5",

      partialize: (state) => ({
        idleTimers: Array.from(state.idleTimers.entries()),
      }),

      onRehydrateStorage: () => (state) => {
        try {
          if (!state) return;
          const raw = (state as any).idleTimers;
          (state as any).idleTimers = toMap(raw);
        } catch (error) {
          (state as any).idleTimers = new Map();
        }
      },
    }
  )
);
