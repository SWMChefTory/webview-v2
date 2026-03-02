import type { NextRouter } from "next/router";

export function navigateToRecipeDetail(
  router: NextRouter,
  recipe: {
    recipeId: string;
    recipeTitle: string;
    videoId: string;
    description?: string;
    servings?: number;
    cookingTime?: number;
  }
) {
  router.push({
    pathname: `/recipe/${recipe.recipeId}/detail`,
    query: {
      title: recipe.recipeTitle,
      videoId: recipe.videoId,
      description: recipe.description,
      servings: recipe.servings,
      cookingTime: recipe.cookingTime,
    },
  });
}
