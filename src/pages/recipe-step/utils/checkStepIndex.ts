import { RecipeStep } from "../type/recipeSteps";

export function checkStepIndex({
  steps,
  stepIndex,
  stepDetailIndex,
}: {
  steps: RecipeStep[];
  stepIndex: number;
  stepDetailIndex: number;
}) {
  if (stepIndex < 0 || stepIndex >= steps.length) {
    console.warn("잘못된 stepIndex");
    return false;
  }
  if (
    stepDetailIndex < 0 ||
    stepDetailIndex >= steps[stepIndex].details.length
  ) {
    console.warn("잘못된 stepDetailIndex");
    return false;
  }
  return true;
}
