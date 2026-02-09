import { ResponsiveSwitcher } from "@/src/shared/ui/responsive";

import {
  SearchResultsContentMobile,
  SearchResultsSkeletonMobile,
} from "./SearchResults.mobile";
import {
  SearchResultsContentTablet,
  SearchResultsSkeletonTablet,
} from "./SearchResults.tablet";
import {
  SearchResultsContentDesktop,
  SearchResultsSkeletonDesktop,
} from "./SearchResults.desktop";

export function SearchResultsSkeleton() {
  return (
    <ResponsiveSwitcher
      mobile={SearchResultsSkeletonMobile}
      tablet={SearchResultsSkeletonTablet}
      desktop={SearchResultsSkeletonDesktop}
      props={{}}
    />
  );
}

export function SearchResultsContent({ keyword }: { keyword: string }) {
  return (
    <ResponsiveSwitcher
      mobile={SearchResultsContentMobile}
      tablet={SearchResultsContentTablet}
      desktop={SearchResultsContentDesktop}
      props={{ keyword }}
    />
  );
}
