import { useMediaQuery } from "@/src/shared/hooks/useMediaQuery";
import { MEDIA_QUERIES } from "@/src/shared/constants/breakpoints";
import { UserRecipeMobile } from "./UserRecipe.mobile";
import { UserRecipeTablet } from "./UserRecipe.tablet";

export function UserRecipe() {
  const isMobile = useMediaQuery(MEDIA_QUERIES.mobile);
  return isMobile ? <UserRecipeMobile /> : <UserRecipeTablet />;
}
