import { CategoryType } from "@/src/entities/category/type/cuisineType";
import { ResponsiveSwitcher } from "@/src/shared/ui/responsive";
import {
  CategoryResultsSkeletonMobile,
  CategoryResultsContentMobile,
} from "./CategoryResults.mobile";
import {
  CategoryResultsSkeletonTablet,
  CategoryResultsContentTablet,
} from "./CategoryResults.tablet";
import {
  CategoryResultsSkeletonDesktop,
  CategoryResultsContentDesktop,
} from "./CategoryResults.desktop";

export function CategoryResultsSkeleton() {
  return (
    <ResponsiveSwitcher
      mobile={CategoryResultsSkeletonMobile}
      tablet={CategoryResultsSkeletonTablet}
      desktop={CategoryResultsSkeletonDesktop}
      props={{}}
    />
  );
}

export function CategoryResultsContent({
  categoryType,
}: {
  categoryType: CategoryType;
}) {
  return (
    <ResponsiveSwitcher
      mobile={CategoryResultsContentMobile}
      tablet={CategoryResultsContentTablet}
      desktop={CategoryResultsContentDesktop}
      props={{ categoryType }}
    />
  );
}
