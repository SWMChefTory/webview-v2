import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RecipeStoreState {
  recipes: Map<string, string>;
}

const useRecipeStore = create<RecipeStoreState>()(
  persist(
    (set, get) => ({
      recipes: new Map(),
      addRecipe: ({recipeId, recipeName}: {recipeId: string, recipeName: string}) => {
        const newRecipes = new Map(get().recipes);
        newRecipes.set(recipeId, recipeName);
        set({ recipes: newRecipes });
      },
      removeRecipe: ({recipeId}: {recipeId: string}) => {
        const newRecipes = new Map(get().recipes);
        newRecipes.delete(recipeId);
        set({ recipes: newRecipes });
      }
    }),
    {
      name: "recipe-store",
      partialize: (state) => ({
        recipes: Array.from(state.recipes.entries()),
      }),
      onRehydrateStorage: () => (state) => {
        if (!state?.recipes) return;
        state.recipes = new Map(state.recipes);
      },
    }
  )
);

export default useRecipeStore;