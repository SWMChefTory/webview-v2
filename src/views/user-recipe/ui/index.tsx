import { ResponsiveSwitcher } from "@/src/shared/ui/responsive";
import { UserRecipeMobile } from "./UserRecipe.mobile";
import { UserRecipeTablet } from "./UserRecipe.tablet";
import { UserRecipeDesktop } from "./UserRecipe.desktop";

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
