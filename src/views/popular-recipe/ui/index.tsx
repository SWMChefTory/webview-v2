import { ResponsiveSwitcher } from "@/src/shared/ui/responsive";
import { PopularRecipeMobile } from "./PopularRecipe.mobile";
import { PopularRecipeTablet } from "./PopularRecipe.tablet";
import { PopularRecipeDesktop } from "./PopularRecipe.desktop";

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
