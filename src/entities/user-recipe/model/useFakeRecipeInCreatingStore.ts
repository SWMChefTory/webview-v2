import { create } from "zustand";

type Timer = ReturnType<typeof setTimeout>;

const _useRecipeInCreatingStore = create<{
  recipeIdsInCreating: Map<string, { recipeTitle: string; timer: Timer }>;
  addRecipeIdInCreating: (recipeId: string, recipeTitle: string, timer: Timer) => void;
  deleteRecipeIdInCreating: (recipeId: string) => void;
  isInCreating: (recipeId: string) => boolean;
}>((set, get) => ({
  recipeIdsInCreating: new Map(),

  addRecipeIdInCreating: (recipeId, recipeTitle, timer) => {
    set((state) => {
      const next = new Map(state.recipeIdsInCreating);

      // ✅ 같은 id가 이미 있으면 기존 타이머 정리
      const prev = next.get(recipeId);
      if (prev) clearTimeout(prev.timer);

      next.set(recipeId, { recipeTitle, timer });
      return { recipeIdsInCreating: next };
    });
  },

  deleteRecipeIdInCreating: (recipeId) => {
    const nextMap = new Map(get().recipeIdsInCreating);

    // ✅ delete 전에 clearTimeout 해야 함 (기존 코드 버그)
    const entry = nextMap.get(recipeId);
    if (entry) clearTimeout(entry.timer);

    nextMap.delete(recipeId);
    set({ recipeIdsInCreating: nextMap });
  },

  isInCreating: (recipeId) => get().recipeIdsInCreating.has(recipeId),
}));

export const useFakeRecipeInCreatingStore = () => {
  const { isInCreating, addRecipeIdInCreating, deleteRecipeIdInCreating } =
    _useRecipeInCreatingStore();

  function handleAddFakeCreating({
    recipeId,
    recipeTitle,
  }: {
    recipeId: string;
    recipeTitle: string;
  }) {
    // ✅ 안전장치: 너무 오래 남아있지 않게만 cleanup (예: 10분)
    const timer = setTimeout(() => {
      deleteRecipeIdInCreating(recipeId);
    }, 10 * 60 * 1000);

    addRecipeIdInCreating(recipeId, recipeTitle, timer);
  }

  return {
    isInCreating,
    handleAddFakeCreating,
    deleteRecipeIdInCreating,
  };
};