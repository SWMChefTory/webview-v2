import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useIsInTutorialStore = create<{
  isInTutorial: boolean;
  finishTutorial: () => void;
  startTutorial: () => void;
  isTutorialRecipeCardCreated: boolean;
  setIsTutorialRecipeCardCreated: (
    isTutorialRecipeCardCreated: boolean
  ) => void;
}>()(
  persist(
    (set) => ({
      isInTutorial: true,
      finishTutorial: () =>
        set({ isInTutorial: false, isTutorialRecipeCardCreated: true }),
      startTutorial: () => {
        set({ isInTutorial: true, isTutorialRecipeCardCreated: false });
      },
      isTutorialRecipeCardCreated: false,
      setIsTutorialRecipeCardCreated: (isTutorialRecipeCardCreated: boolean) =>
        set({ isTutorialRecipeCardCreated }),
    }),
    {
      name: "is-in-tutorial-store2",
      partialize: (state) => ({
        isInTutorial: state.isInTutorial,
        isTutorialRecipeCardCreated: state.isTutorialRecipeCardCreated,
      }),
    }
  )
);
