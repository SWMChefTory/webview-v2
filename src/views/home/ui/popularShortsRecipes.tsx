import { useMediaQuery } from "@/src/shared/hooks/useMediaQuery";
import { MEDIA_QUERIES } from "@/src/shared/constants/breakpoints";
import { PopularShortsRecipesMobile } from "./popularShortsRecipes.mobile";
import { PopularShortsRecipesTablet } from "./popularShortsRecipes.tablet";
import { PopularShortsRecipesDesktop } from "./popularShortsRecipes.desktop";

export function PopularShortsRecipes() {
  const isMobile = useMediaQuery(MEDIA_QUERIES.mobile);
  const isDesktop = useMediaQuery(MEDIA_QUERIES.desktop);

  if (isMobile) return <PopularShortsRecipesMobile />;
  if (isDesktop) return <PopularShortsRecipesDesktop />;
  return <PopularShortsRecipesTablet />;
}
