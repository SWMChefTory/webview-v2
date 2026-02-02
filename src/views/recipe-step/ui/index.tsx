import { GlobalNoBounce } from "./globalNoBounce";
import { useOrientation } from "../hooks/useOrientation";
import { useRecipeStepPageController } from "./RecipeStep.controller";
import { RecipeStepDesktop } from "./RecipeStep.desktop";
import { RecipeStepMobile } from "./RecipeStep.mobile";
import { RecipeStepSkeleton } from "./RecipeStep.skeleton";

function RecipeStepPageReady({ id }: { id: string }) {
  const orientation = useOrientation();
  const controller = useRecipeStepPageController(id);

  if (orientation === "portrait") {
    return <RecipeStepMobile controller={controller} />;
  }

  return <RecipeStepDesktop controller={controller} />;
}

export { GlobalNoBounce, RecipeStepPageReady, RecipeStepSkeleton as RecipeStepPageSkeleton };
