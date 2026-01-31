import { useMediaQuery } from "@/src/shared/hooks/useMediaQuery";
import { MEDIA_QUERIES } from "@/src/shared/constants/breakpoints";
import { SearchRecipeMobile } from "./ui/SearchRecipe.mobile";
import { SearchRecipeTablet } from "./ui/SearchRecipe.tablet";
import { SearchRecipeDesktop } from "./ui/SearchRecipe.desktop";

const SearchRecipePage = () => {
  const isMobile = useMediaQuery(MEDIA_QUERIES.mobile);
  const isTablet = useMediaQuery(MEDIA_QUERIES.tablet);

  if (isMobile) {
    return <SearchRecipeMobile />;
  }
  if (isTablet) {
    return <SearchRecipeTablet />;
  }
  return <SearchRecipeDesktop />;
};

export default SearchRecipePage;
