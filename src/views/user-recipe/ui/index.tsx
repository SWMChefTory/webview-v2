import { ResponsiveSwitcher } from "@/src/shared/ui/responsive";

import { UserRecipeDesktop } from "./UserRecipe.desktop";
import { UserRecipeMobile } from "./UserRecipe.mobile";
import { UserRecipeTablet } from "./UserRecipe.tablet";

export function UserRecipe() {
  return (
    <ResponsiveSwitcher
      mobile={UserRecipeMobile}
      tablet={UserRecipeTablet}
      desktop={UserRecipeDesktop}
      props={{}}
    />
  );
}
