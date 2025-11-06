import { ActiveTimer, Timer, TimerState } from "../model/useInProgressTimers";

function filterActiveTimers(
  timers: Map<string, Timer>
): [string, ActiveTimer][] {
  return Array.from(
    timers
      .entries()
      .filter(([_, timer]) => timer.state === TimerState.ACTIVE)
      .map(([id, timer]) => [id, timer] as [string, ActiveTimer])
  );
}

function findEarliestFinishTimer(
  timers: [string, ActiveTimer][]
): [string, ActiveTimer] | null {
  if (timers.length === 0) {
    return null;
  }
  return timers.reduce((min, timer) => {
    return timer[1].endAt < min[1].endAt ? timer : min;
  }, timers[0]);
}

export { filterActiveTimers, findEarliestFinishTimer };
