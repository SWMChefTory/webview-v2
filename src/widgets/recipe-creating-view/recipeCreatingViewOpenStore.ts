import { create } from "zustand";

interface RecipeCreatingViewOpenStore {
  isOpen: boolean;
  videoUrl: string;
  open: (videoUrl: string) => void;
  close: () => void;
  setIsOpen: (isOpen: boolean) => void;
  setUrl: (url: string) => void;
}

export const useRecipeCreatingViewOpenStore = create<RecipeCreatingViewOpenStore>((set) => ({
  isOpen: false,
  videoUrl: "",
  open: (videoUrl) => set({ isOpen: true, videoUrl }),
  close: () => set({ isOpen: false, videoUrl: "" }),
  setIsOpen: (isOpen) => set({ isOpen }),
  setUrl: (url) => set({ videoUrl: url }),
}));