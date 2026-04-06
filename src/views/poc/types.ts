export interface PocIngredientAmount {
  value: number | null;
  unit: string | null;
}

export interface PocIngredient {
  name: string;
  amount: PocIngredientAmount;
  substitute?: string | null;
  selectionTip?: string | null;
}

export interface PocTool {
  name: string;
}

export interface PocScene {
  label: string;
  start: string;
  end: string;
}

export interface PocDescriptionItem {
  content: string;
  start: string;
}

export interface PocStep {
  order: number;
  title: string;
  description: string | PocDescriptionItem[];
  tip: string | string[] | null;
  knowledge: string | string[] | null;
  scenes: PocScene[] | null;
  timerSeconds: number | null;
  heatLevel?: string | null;
}

export interface PocRecipe {
  title: string;
  description: string | null;
  servings: number | null;
  cookingTimeMinutes: number | null;
  difficulty: string;
  category: string;
  ingredients: PocIngredient[];
  tools: PocTool[];
  steps: PocStep[];
  servingTip?: string | null;
}
