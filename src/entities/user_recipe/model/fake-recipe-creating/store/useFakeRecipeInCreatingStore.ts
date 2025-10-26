import { create } from "zustand";

const _useRecipeInCreatingStore = create<{
  recipeIdsInCreating: Set<String>;
  addRecipeIdInCreating: (recipeId: String) => void;
  deleteRecipeIdInCreating: (recipeId: String) => void;
  isInCreating: (recipeId: String) => boolean;
}>((set, get) => ({
  recipeIdsInCreating: new Set(),
  addRecipeIdInCreating: (recipeId: String) =>
    set((state) => ({
      recipeIdsInCreating: new Set(state.recipeIdsInCreating).add(recipeId),
    })),
  deleteRecipeIdInCreating: (recipeId: String) =>
    set((state) => ({
      recipeIdsInCreating: new Set(
        [...state.recipeIdsInCreating].filter((id) => id !== recipeId)
      ),
    })),
  isInCreating: (recipeId: String) => get().recipeIdsInCreating.has(recipeId),
}));

export const useFakeRecipeInCreatingStore = () => {
  const { isInCreating, addRecipeIdInCreating, deleteRecipeIdInCreating } =
    _useRecipeInCreatingStore();

  function handleAddFakeCreating(recipeId: string) {
    addRecipeIdInCreating(recipeId);
    setTimeout(() => {
      deleteRecipeIdInCreating(recipeId);
    }, 3000);
  }

  return {
    isInCreating,
    handleAddFakeCreating,
  };
};
