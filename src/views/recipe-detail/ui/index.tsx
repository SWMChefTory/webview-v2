import { useMediaQuery } from "@/src/shared/hooks/useMediaQuery";
import { MEDIA_QUERIES } from "@/src/shared/constants/breakpoints";
import {
  RecipeDetailPageSkeletonMobile,
  RecipeDetailPageReadyMobile,
  RecipeBottomSheetMobile,
} from "./RecipeDetail.mobile";
import {
  RecipeDetailPageSkeletonTablet,
  RecipeDetailPageReadyTablet,
} from "./RecipeDetail.tablet";

export const RecipeDetailPageSkeleton = () => {
  const isMobile = useMediaQuery(MEDIA_QUERIES.mobile);
  return isMobile ? <RecipeDetailPageSkeletonMobile /> : <RecipeDetailPageSkeletonTablet />;
};

export const RecipeDetailPageReady = ({ id }: { id: string }) => {
  const isMobile = useMediaQuery(MEDIA_QUERIES.mobile);
  return isMobile ? <RecipeDetailPageReadyMobile id={id} /> : <RecipeDetailPageReadyTablet id={id} />;
};

export { RecipeBottomSheetMobile as RecipeBottomSheet };
