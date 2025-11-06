import { create } from "zustand";

const useTimerBottomSheetVisibilityStore = create<{
  open: boolean;
  endAt: Date | null;
  timer: NodeJS.Timeout | undefined;
  handleFlip: () => void;
  handleClose: () => void;
  handleOpenTemporarily: ({ seconds }: { seconds: number }) => void;
}>((set, get) => ({
  open: false,
  endAt: null,
  timer: undefined,
  handleFlip: () => set({ open: !get().open }),
  handleClose: () => {
    set({ open: false });
    clearTimeout(get().timer);
    set({ timer: undefined });
    set({ endAt: null });
  },
  handleOpenTemporarily: ({ seconds }: { seconds: number }) => {
    const endAt = new Date(Date.now() + seconds * 1000);
    set({ open: true, endAt });
    function checkAndClose() {
      get().timer = setTimeout(() => {
        if (new Date() >= endAt) {
          get().handleClose();
          return;
        }
        checkAndClose();
      }, 200);
    }
    checkAndClose();
  },
}));

export const useTimerBottomSheetVisibility = () => {
  const { open, endAt, handleFlip, handleClose, handleOpenTemporarily } =
    useTimerBottomSheetVisibilityStore();
  return { open, endAt, handleFlip, handleClose, handleOpenTemporarily };
};
