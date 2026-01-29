import { create } from "zustand";

interface RecipeEnrollModalStore {
  recipeId: string;
  open: (recipeId: string) => void;
  close: () => void;
}

export const useRecipeEnrollModalStore = create<RecipeEnrollModalStore>()(
  (set) => ({
    recipeId: "",
    open: (recipeId) => set({ recipeId }),
    close: () => set({ recipeId: "" }),
  })
);