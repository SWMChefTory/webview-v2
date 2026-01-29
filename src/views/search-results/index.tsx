import { useRouter } from "next/router";
import { useEffect, useState, useCallback, memo } from "react";
import Header, { BackButton } from "@/src/shared/ui/header/header";
import { SearchResultsSkeleton, SearchResultsContent } from "./ui";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { useInvalidateSearchHistories } from "@/src/views/search-recipe/entities/search-history/model/model";
import { SearchBar } from "./ui/components";

const SearchResultsPage = () => {
  const router = useRouter();
  const queryParam = router.query.q as string;
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const invalidateSearchHistories = useInvalidateSearchHistories();

  useEffect(() => {
    if (router.isReady) {
      if (!queryParam || queryParam.trim() === "") {
        router.replace("/search-recipe");
      } else {
        setSearchKeyword(queryParam);
      }
    }
  }, [router.isReady, queryParam, router]);

  const handleSearchSelect = useCallback(
    (keyword: string) => {
      invalidateSearchHistories();
      setSearchKeyword(keyword);
      router.replace(`/search-results?q=${encodeURIComponent(keyword)}`, undefined, {
        shallow: true,
      });
    },
    [invalidateSearchHistories, router]
  );

  if (!router.isReady || !queryParam || queryParam.trim() === "") {
    return null;
  }

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden">
      <Header
        leftContent={
          <HeaderLeftContent
            initialKeyword={searchKeyword}
            onSearchExecute={invalidateSearchHistories}
            onSearchSelect={handleSearchSelect}
            onSearchStateChange={setIsSearching}
          />
        }
      />
      <div
        className="flex flex-col w-full h-full overflow-y-scroll"
        style={{
          pointerEvents: isSearching ? "none" : "auto",
          touchAction: isSearching ? "none" : "auto",
        }}
      >
        <SSRSuspense fallback={<SearchResultsSkeleton />}>
          <SearchResultsContent keyword={searchKeyword} />
        </SSRSuspense>
      </div>
    </div>
  );
};

interface HeaderLeftContentProps {
  initialKeyword: string;
  onSearchExecute: () => void;
  onSearchSelect: (keyword: string) => void;
  onSearchStateChange: (isSearching: boolean) => void;
}

const HeaderLeftContent = memo(function HeaderLeftContent({
  initialKeyword,
  onSearchExecute,
  onSearchSelect,
  onSearchStateChange,
}: HeaderLeftContentProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-row gap-2 w-full h-full items-center justify-start pr-6">
        <div className="z-10">
          <BackButton onClick={() => router.back()} />
        </div>
        <SearchBar
          initialKeyword={initialKeyword}
          onSearchExecute={onSearchExecute}
          onSearchSelect={onSearchSelect}
          onSearchStateChange={onSearchStateChange}
        />
      </div>
    </div>
  );
});

export default SearchResultsPage;
