import { ResponsiveSwitcher } from "@/src/shared/ui/responsive";
import { SearchResultsSkeletonMobile, SearchResultsContentMobile } from "./SearchResults.mobile";
import { SearchResultsSkeletonTablet, SearchResultsContentTablet } from "./SearchResults.tablet";
import { SearchResultsSkeletonDesktop, SearchResultsContentDesktop } from "./SearchResults.desktop";

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
