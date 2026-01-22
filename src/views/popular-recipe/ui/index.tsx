import { useMediaQuery } from "@/src/shared/hooks/useMediaQuery";
import { MEDIA_QUERIES } from "@/src/shared/constants/breakpoints";
import { PopularRecipeMobile } from "./PopularRecipe.mobile";
import { PopularRecipeTablet } from "./PopularRecipe.tablet";

function PopularRecipeContent() {
  const isMobile = useMediaQuery(MEDIA_QUERIES.mobile);
  return isMobile ? <PopularRecipeMobile /> : <PopularRecipeTablet />;
}

export default PopularRecipeContent;
