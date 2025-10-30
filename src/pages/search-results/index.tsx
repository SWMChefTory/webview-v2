import Header from "@/src/shared/ui/header";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SearchResultsSkeleton, SearchResultsContent } from "./ui";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { useInvalidateSearchHistories } from "@/src/pages/search-recipe/entities/search-history/model/model";
import { HeaderLeftContent } from "@/src/widgets/recipe-search-view";

const SearchResultsPage = () => {
  const router = useRouter();
  const queryParam = router.query.q as string;
  const [searchKeyword, setSearchKeyword] = useState("");
  const invalidateSearchHistories = useInvalidateSearchHistories();

  // URL의 query 파라미터를 초기 검색어로 설정
  useEffect(() => {
    if (router.isReady) {
      if (!queryParam || queryParam.trim() === "") {
        // 검색어가 없으면 검색 페이지로 리다이렉트
        router.replace("/search-recipe");
      } else {
        setSearchKeyword(queryParam);
      }
    }
  }, [router.isReady, queryParam, router]);

  const handleSearchSelect = (keyword: string) => {
    invalidateSearchHistories();
    setSearchKeyword(keyword);
  };

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
            autoFocus={false}
          />
        }
      />
      <div className="flex flex-col w-full h-full overflow-y-auto">
        <SSRSuspense fallback={<SearchResultsSkeleton />}>
          <SearchResultsContent keyword={searchKeyword} />
        </SSRSuspense>
      </div>
    </div>
  );
};

export default SearchResultsPage;

