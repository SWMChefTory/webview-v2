import { useMediaQuery } from "@/src/shared/hooks/useMediaQuery";
import { MEDIA_QUERIES } from "@/src/shared/constants/breakpoints";
import { MyRecipesMobile } from "./myRecipe.mobile";
import { MyRecipesTablet } from "./myRecipe.tablet";
import { MyRecipesDesktop } from "./myRecipe.desktop";

export const MyRecipes = () => {
  const isMobile = useMediaQuery(MEDIA_QUERIES.mobile);
  const isDesktop = useMediaQuery(MEDIA_QUERIES.desktop);

  if (isMobile) return <MyRecipesMobile />;
  if (isDesktop) return <MyRecipesDesktop />;
  return <MyRecipesTablet />;
};
