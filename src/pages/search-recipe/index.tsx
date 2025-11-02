import Header from "@/src/shared/ui/header/header";
import { useRouter } from "next/router";
import { useInvalidateSearchHistories } from "./entities/search-history/model/model";
import { SearchRecipeContent } from "./ui";
import { HeaderLeftContent } from "@/src/widgets/recipe-search-view";

const SearchRecipePage = () => {
  const router = useRouter();
  const invalidateSearchHistories = useInvalidateSearchHistories();
  
  const handleSearchSelect = (keyword: string) => {
    invalidateSearchHistories();
    router.push(`/search-results?q=${encodeURIComponent(keyword)}`);
  };
  
  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden">
      <Header
        leftContent={
          <HeaderLeftContent
            onSearchExecute={invalidateSearchHistories}
            onSearchSelect={handleSearchSelect}
            autoFocus={true}
            fallbackContent={<SearchRecipeContent onSearchSelect={handleSearchSelect} />}
          />
        }
      />
      <div className="flex flex-col w-full h-full overflow-y-auto">
        <SearchRecipeContent onSearchSelect={handleSearchSelect} />
      </div>
    </div>
  );
};

export default SearchRecipePage;