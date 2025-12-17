import { create } from "zustand";

export enum RecipeCreateToastStatus {
  PREPARE = "PREPARE",
  FAILED = "FAILED",
  IN_PROGRESS = "IN_PROGRESS",
  SUCCESS = "SUCCESS",
}

export type RecipePrePareState = {
  status: RecipeCreateToastStatus.PREPARE;
  url: string;
};

export type RecipeFailedState = {
  status: RecipeCreateToastStatus.FAILED;
  errorMessage: string;
};

export type RecipeInProgressState = {
  status: RecipeCreateToastStatus.IN_PROGRESS;
  recipeTitle: string;
};

export type RecipeSuccessState = {
  status: RecipeCreateToastStatus.SUCCESS;
  recipeId: string;
  recipeTitle: string;
};

export type RecipeCreateToastState =
  | RecipePrePareState
  | RecipeFailedState
  | RecipeInProgressState
  | RecipeSuccessState;

type Timer = ReturnType<typeof setTimeout>;

const toastStartTimeStore = create<{
  startTime: Date | null;
  setStartTime: (startTime: Date | null) => void;
}>((set) => ({
  startTime: null,
  setStartTime: (startTime) => set({ startTime }),
}));

const useRecipeCreateToastStore = create<{
  toastInfo: RecipeCreateToastState | undefined;
  openTimer: Timer | undefined;
  closeTimer: Timer | undefined;

  setOpenTimer: (timer: Timer | undefined) => void;
  setCloseTimer: (timer: Timer | undefined) => void;
  setToastInfo: (toastInfo: RecipeCreateToastState | undefined) => void;
}>((set) => ({
  toastInfo: undefined,
  openTimer: undefined,
  closeTimer: undefined,

  setOpenTimer: (timer) => set({ openTimer: timer }),
  setCloseTimer: (timer) => set({ closeTimer: timer }),
  setToastInfo: (toastInfo) => set({ toastInfo }),
}));

export const useRecipeCreateToastInfo = () => {
  const { toastInfo } = useRecipeCreateToastStore();
  const { startTime } = toastStartTimeStore();
  return { toastInfo, startTime };
};

export const useRecipeCreateToastAction = () => {
  const {
    setToastInfo,
    openTimer,
    closeTimer,
    setOpenTimer,
    setCloseTimer,
  } = useRecipeCreateToastStore();

  function clearTimers() {
    if (openTimer) clearTimeout(openTimer);
    if (closeTimer) clearTimeout(closeTimer);
    setOpenTimer(undefined);
    setCloseTimer(undefined);
  }

  function close() {
    clearTimers();
    setToastInfo(undefined);
    toastStartTimeStore.setState({ startTime: null });
  }

  function scheduleNextOpen(toastInfo: RecipeCreateToastState) {
    clearTimers();

    const ot = setTimeout(() => {
      setToastInfo(toastInfo);
      toastStartTimeStore.setState({ startTime: new Date() });

      const ct = setTimeout(() => {
        setToastInfo(undefined);
        setCloseTimer(undefined);
      }, 2000);

      setCloseTimer(ct);
      setOpenTimer(undefined);
    }, 200);

    setOpenTimer(ot);
  }

  function handleOpenToast(toastInfo: RecipeCreateToastState) {
    close();
    scheduleNextOpen(toastInfo);
  }

  return { handleOpenToast, close };
};
