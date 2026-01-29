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

  // ✅ open(200ms)도 관리해야 “옛날 SUCCESS” 같은 유령 호출 막힘
  openTimer: Timer | undefined;
  closeTimer: Timer | undefined;

  // ✅ stale timeout 무시용 버전
  seq: number;

  setToastInfo: (toastInfo: RecipeCreateToastState | undefined) => void;
  setOpenTimer: (timer: Timer | undefined) => void;
  setCloseTimer: (timer: Timer | undefined) => void;
  bumpSeq: () => number;
}>((set, get) => ({
  toastInfo: undefined,
  openTimer: undefined,
  closeTimer: undefined,
  seq: 0,

  setToastInfo: (toastInfo) => set({ toastInfo }),
  setOpenTimer: (timer) => set({ openTimer: timer }),
  setCloseTimer: (timer) => set({ closeTimer: timer }),

  bumpSeq: () => {
    const next = get().seq + 1;
    set({ seq: next });
    return next;
  },
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
    bumpSeq,
  } = useRecipeCreateToastStore();

  function close() {
    setToastInfo(undefined);

    if (openTimer) clearTimeout(openTimer);
    if (closeTimer) clearTimeout(closeTimer);

    setOpenTimer(undefined);
    setCloseTimer(undefined);

    toastStartTimeStore.setState({ startTime: null });

    bumpSeq();
  }

  function scheduleNextOpen(toastInfo: RecipeCreateToastState) {
    const mySeq = bumpSeq();

    const ot = setTimeout(() => {
      if (useRecipeCreateToastStore.getState().seq !== mySeq) return;

      setToastInfo(toastInfo);
      toastStartTimeStore.setState({ startTime: new Date() });

      const ct = setTimeout(() => {
        if (useRecipeCreateToastStore.getState().seq !== mySeq) return;
        setToastInfo(undefined);
      }, 2000);

      setCloseTimer(ct);
    }, 200);

    setOpenTimer(ot);
  }

  function handleOpenToast({ toastInfo }: { toastInfo: RecipeCreateToastState }) {
    close();
    scheduleNextOpen(toastInfo);
  }

  return { handleOpenToast, close };
};