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

const useRecipeCreateToastStore = create<{
  toastInfo: RecipeCreateToastState | undefined;
  closeTimer: NodeJS.Timeout | undefined;
  setCloseTimer: ({ timer }: { timer: NodeJS.Timeout | undefined }) => void;
  setToastInfo: ({
    toastInfo,
  }: {
    toastInfo: RecipeCreateToastState | undefined;
  }) => void;
}>((set) => ({
  toastInfo: undefined,
  closeTimer: undefined,
  setCloseTimer: ({ timer }: { timer: NodeJS.Timeout | undefined }) => {
    set({ closeTimer: timer });
  },
  setToastInfo: ({
    toastInfo,
  }: {
    toastInfo: RecipeCreateToastState | undefined;
  }) => {
    set({ toastInfo: toastInfo });
  },
}));

export const useRecipeCreateToastInfo = () => {
  const { toastInfo } = useRecipeCreateToastStore();
  return { toastInfo };
};

//토스트 열기 혹은 닫기 관리 커스텀 훅
export const useRecipeCreateToastAction = () => {
  const { setToastInfo, closeTimer, setCloseTimer } = useRecipeCreateToastStore();

  function close() {
    setToastInfo({ toastInfo: undefined });
    clearTimeout(closeTimer);
    setCloseTimer({ timer: undefined });
  }

  function scheduleNextOpen({
    toastInfo,
  }: {
    toastInfo: RecipeCreateToastState;
  }) {
    setTimeout(() => {
      setToastInfo({ toastInfo });
      setCloseTimer({
        timer: setTimeout(() => {
          setToastInfo({ toastInfo: undefined });
        }, 2000),
      });
    }, 200);
  }

  function handleOpenToast({
    toastInfo,
  }: {
    toastInfo: RecipeCreateToastState;
  }) {
    close();
    scheduleNextOpen({ toastInfo });
  }

  return { handleOpenToast: handleOpenToast, close };
};
