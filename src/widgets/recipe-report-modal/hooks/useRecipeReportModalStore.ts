import { create } from "zustand";

interface RecipeReportModalState {
  isOpen: boolean;
  recipeId: string | null;
  open: (recipeId: string) => void;
  close: () => void;
}

export const useRecipeReportModalStore = create<RecipeReportModalState>(
  (set) => ({
    isOpen: false,
    recipeId: null,
    open: (recipeId: string) => set({ isOpen: true, recipeId }),
    close: () => set({ isOpen: false, recipeId: null }),
  })
);
