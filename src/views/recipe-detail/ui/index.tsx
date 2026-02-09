import { ResponsiveSwitcher } from "@/src/shared/ui/responsive";

import {
  RecipeDetailPageReadyMobile,
  RecipeDetailPageSkeletonMobile,
} from "./RecipeDetail.mobile";
import {
  RecipeDetailPageReadyTablet,
  RecipeDetailPageSkeletonTablet,
} from "./RecipeDetail.tablet";
import {
  RecipeDetailPageReadyDesktop,
  RecipeDetailPageSkeletonDesktop,
} from "./RecipeDetail.desktop";

export const RecipeDetailPageSkeleton = () => {
  return (
    <ResponsiveSwitcher
      mobile={RecipeDetailPageSkeletonMobile}
      tablet={RecipeDetailPageSkeletonTablet}
      desktop={RecipeDetailPageSkeletonDesktop}
      props={{}}
    />
  );
};

export const RecipeDetailPageReady = ({ id }: { id: string }) => {
  return (
    <ResponsiveSwitcher
      mobile={RecipeDetailPageReadyMobile}
      tablet={RecipeDetailPageReadyTablet}
      desktop={RecipeDetailPageReadyDesktop}
      props={{ id }}
    />
  );
};
