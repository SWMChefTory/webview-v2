import { ResponsiveSwitcher } from "@/src/shared/ui/responsive";
import {
  RecipeDetailPageSkeletonMobile,
  RecipeDetailPageReadyMobile,
} from "./RecipeDetail.mobile";
import {
  RecipeDetailPageSkeletonTablet,
  RecipeDetailPageReadyTablet,
} from "./RecipeDetail.tablet";
import {
  RecipeDetailPageSkeletonDesktop,
  RecipeDetailPageReadyDesktop,
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
