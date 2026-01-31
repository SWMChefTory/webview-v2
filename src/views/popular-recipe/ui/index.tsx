import { ResponsiveSwitcher } from "@/src/shared/ui/responsive";

import { PopularRecipeDesktop } from "./PopularRecipe.desktop";
import { PopularRecipeMobile } from "./PopularRecipe.mobile";
import { PopularRecipeTablet } from "./PopularRecipe.tablet";

function PopularRecipeContent() {
  return (
    <ResponsiveSwitcher
      mobile={PopularRecipeMobile}
      tablet={PopularRecipeTablet}
      desktop={PopularRecipeDesktop}
      props={{}}
    />
  );
}

export default PopularRecipeContent;
