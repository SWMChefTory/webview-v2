import { useMediaQuery } from "@/src/shared/hooks/useMediaQuery";
import { MEDIA_QUERIES } from "@/src/shared/constants/breakpoints";
import { PopularRecipesMobile } from "./popularRecipes.mobile";
import { PopularRecipesTablet } from "./popularRecipes.tablet";
import { PopularRecipesDesktop } from "./popularRecipes.desktop";

export function PopularRecipes() {
  const isMobile = useMediaQuery(MEDIA_QUERIES.mobile);
  const isDesktop = useMediaQuery(MEDIA_QUERIES.desktop);

  if (isMobile) return <PopularRecipesMobile />;
  if (isDesktop) return <PopularRecipesDesktop />;
  return <PopularRecipesTablet />;
}
