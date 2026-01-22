import { useMediaQuery } from "@/src/shared/hooks/useMediaQuery";
import { MEDIA_QUERIES } from "@/src/shared/constants/breakpoints";
import { SearchResultsSkeletonMobile, SearchResultsContentMobile } from "./SearchResults.mobile";
import { SearchResultsSkeletonTablet, SearchResultsContentTablet } from "./SearchResults.tablet";

export function SearchResultsSkeleton() {
  const isMobile = useMediaQuery(MEDIA_QUERIES.mobile);
  return isMobile ? <SearchResultsSkeletonMobile /> : <SearchResultsSkeletonTablet />;
}

export function SearchResultsContent({ keyword }: { keyword: string }) {
  const isMobile = useMediaQuery(MEDIA_QUERIES.mobile);
  return isMobile ? (
    <SearchResultsContentMobile keyword={keyword} />
  ) : (
    <SearchResultsContentTablet keyword={keyword} />
  );
}
