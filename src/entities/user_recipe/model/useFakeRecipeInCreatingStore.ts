import { create } from "zustand";
import {
  RecipeCreateToastStatus,
  useRecipeCreateToastAction,
} from "./useToast";

const _useRecipeInCreatingStore = create<{
  recipeIdsInCreating: Map<String, { recipeTitle: string, timer: NodeJS.Timeout }>;
  addRecipeIdInCreating: (recipeId: string, recipeTitle: string, timer: NodeJS.Timeout) => void;
  deleteRecipeIdInCreating: (recipeId: String) => void;
  isInCreating: (recipeId: String) => boolean;
}>((set, get) => ({
  recipeIdsInCreating: new Map(),
  addRecipeIdInCreating: (recipeId: string, recipeTitle: string, timer: NodeJS.Timeout) => {
    set((state) => ({
      recipeIdsInCreating: new Map(state.recipeIdsInCreating).set(
        recipeId,
        { recipeTitle, timer },
      ),
    }));
  },
  deleteRecipeIdInCreating: (recipeId: String) => {
    const nextMap = new Map(get().recipeIdsInCreating);
    nextMap.delete(recipeId);
    clearTimeout(nextMap.get(recipeId)?.timer);
    set({ recipeIdsInCreating: nextMap });
  },
  isInCreating: (recipeId: String) => get().recipeIdsInCreating.has(recipeId),
}));

export const useFakeRecipeInCreatingStore = () => {
  const { handleOpenToast } = useRecipeCreateToastAction();
  const { isInCreating, addRecipeIdInCreating, deleteRecipeIdInCreating } =
    _useRecipeInCreatingStore();

  function handleAddFakeCreating({ recipeId, recipeTitle }: { recipeId: string, recipeTitle: string }) {
    const timer = setTimeout(() => {
      deleteRecipeIdInCreating(recipeId);
      handleOpenToast({
        toastInfo: {
          status: RecipeCreateToastStatus.SUCCESS,
          recipeId: recipeId,
          recipeTitle: recipeTitle,
        },  
      });
    }, 3000);
    addRecipeIdInCreating(recipeId, recipeTitle, timer);
  }

  return {
    isInCreating,
    handleAddFakeCreating,
    deleteRecipeIdInCreating,
  };
};
