import { ResponsiveSwitcher } from "@/src/shared/ui/responsive";

import {
  CategoryResultsContentMobile,
  CategoryResultsSkeletonMobile,
} from "./CategoryResults.mobile";
import {
  CategoryResultsContentTablet,
  CategoryResultsSkeletonTablet,
} from "./CategoryResults.tablet";
import {
  CategoryResultsContentDesktop,
  CategoryResultsSkeletonDesktop,
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
  categoryType: string;
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
