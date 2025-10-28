import Header, { BackButton } from "@/src/shared/ui/header";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { SearchResultsSkeleton, SearchResultsContent } from "./ui";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { useFetchAutoCompleteData, AutoComplete } from "@/src/pages/search-recipe/entities/auto-complete/model/model";
import { useInvalidateSearchHistories } from "@/src/pages/search-recipe/entities/search-history/model/model";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { HeaderSpacing } from "@/src/shared/ui/header";
import { IoMdCloseCircle } from "react-icons/io";
import { motion } from "framer-motion";
import { useDebounce } from "use-debounce";
import { DefaultContentOverlay } from "@/src/pages/search-recipe/ui";


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
          />
        }
      />
      <div className="flex flex-col w-full h-full overflow-y-scroll">
        <SSRSuspense fallback={<SearchResultsSkeleton />}>
          <SearchResultsContent keyword={searchKeyword} />
        </SSRSuspense>
      </div>
    </div>
  );
};

const HeaderLeftContent = ({
  initialKeyword,
  onSearchExecute,
  onSearchSelect,
}: {
  initialKeyword: string;
  onSearchExecute: () => void;
  onSearchSelect: (keyword: string) => void;
}) => {
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
        />
      </div>
    </div>
  );
};

const SearchBar = ({
  initialKeyword,
  onSearchExecute,
  onSearchSelect,
}: {
  initialKeyword: string;
  onSearchExecute: () => void;
  onSearchSelect: (keyword: string) => void;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [keyboardInput, setKeyboardInput] = useState(initialKeyword);
  const [debouncedSearchKeyword] = useDebounce(keyboardInput, 300);
  const { autoCompleteData, isLoading } = useFetchAutoCompleteData(debouncedSearchKeyword.trim());
  const inputRef = useRef<HTMLInputElement>(null);
  const prevAutocompletesRef = useRef<AutoComplete[]>([]);
  
  // initialKeyword가 변경되면 input 값 업데이트
  useEffect(() => {
    setKeyboardInput(initialKeyword);
  }, [initialKeyword]);

  // 로딩 완료 후 실제 데이터가 있을 때만 이전 값 업데이트
  useEffect(() => {
    if (!isLoading && autoCompleteData.autocompletes.length > 0) {
      prevAutocompletesRef.current = autoCompleteData.autocompletes;
    }
  }, [autoCompleteData.autocompletes, isLoading]);
  
  const displayAutocompletes = 
    autoCompleteData.autocompletes.length > 0 
      ? autoCompleteData.autocompletes 
      : prevAutocompletesRef.current;
  
  const shouldShowDropdown = isFocused && keyboardInput.length > 0;
  const hasAutocompletes = displayAutocompletes.length > 0;
  
  const handleClearInput = () => {
    setKeyboardInput("");
    prevAutocompletesRef.current = [];
  };
  
  const handleKeywordSelect = (keyword: string) => {
    setKeyboardInput(keyword);
    onSearchSelect(keyword);
  };
  
  const handleEnterKey = () => {
    if (keyboardInput.trim()) {
      onSearchExecute();
      onSearchSelect(keyboardInput.trim());
      inputRef.current?.blur();
    }
  };
  
  return (
    <div className="relative flex flex-col justify-center w-full h-full">
      <div className="flex items-center">
        <input
          ref={inputRef}
          className="w-full text-lg outline-none z-10"
          type="text"
          placeholder="검색어를 입력해주세요."
          value={keyboardInput}
          onChange={(e) => setKeyboardInput(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onKeyDown={(e) => e.key === "Enter" && handleEnterKey()}
          enterKeyHint="search"
        />
        {keyboardInput.length > 0 && (
          <motion.button
            className="p-2 z-20"
            whileTap={{ scale: 0.8 }}
            onClick={handleClearInput}
          >
            <IoMdCloseCircle size={24} className="text-gray-500" />
          </motion.button>
        )}
      </div>
      
      {shouldShowDropdown && (
        <AutoCompleteDropdown
          hasAutocompletes={hasAutocompletes}
          autocompletes={displayAutocompletes}
          keyboardInput={keyboardInput}
          onSelect={handleKeywordSelect}
          onSearchSelect={onSearchSelect}
        />
      )}
    </div>
  );
};

const AutoCompleteDropdown = ({
  hasAutocompletes,
  autocompletes,
  keyboardInput,
  onSelect,
  onSearchSelect,
}: {
  hasAutocompletes: boolean;
  autocompletes: AutoComplete[];
  keyboardInput: string;
  onSelect: (keyword: string) => void;
  onSearchSelect: (keyword: string) => void;
}) => {
  return (
    <div className="fixed top-0 left-0 right-0">
      <HeaderSpacing />
      {!hasAutocompletes && (
        <div 
          className="fixed left-0 right-0 bottom-0 bg-black/50 backdrop-blur-sm" 
          style={{ top: 'calc(60px + 56px)' }}
        />
      )}
      
      <div className="flex flex-col w-full bg-white shadow-lg" style={{ height: 'calc(100vh - 60px)' }}>
        {!hasAutocompletes ? (
          <div className="relative z-10 w-full h-full">
            <DefaultContentOverlay onSearchSelect={onSearchSelect} />
          </div>
        ) : (
          <div className="flex flex-col w-full h-full overflow-y-scroll">
            {autocompletes.map((item) => (
              <AutoCompleteKeywordItem
                key={item.autocomplete}
                text={item.autocomplete}
                keyword={keyboardInput}
                onClick={() => onSelect(item.autocomplete)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const AutoCompleteKeywordItem = ({
  keyword,
  text,
  onClick,
}: {
  keyword: string;
  text: string;
  onClick?: () => void;
}) => {
  return (
    <motion.div
      className="flex flex-row gap-3 items-center py-3 px-4 hover:bg-gray-50 cursor-pointer"
      onClick={onClick}
      whileTap={{ backgroundColor: onClick ? "#f3f4f6" : "transparent" }}
      transition={{ duration: 0.2 }}
    >
      <FaMagnifyingGlass size={16} className="shrink-0 text-gray-600" />
      <span className="text-lg flex-1 truncate text-gray-900">
        <HighlightKeywordText text={text} keyword={keyword} />
      </span>
    </motion.div>
  );
};

const HighlightKeywordText = ({
  text,
  keyword,
}: {
  text: string;
  keyword: string;
}) => {
  const keywordIndex = text.toLowerCase().indexOf(keyword.toLowerCase());
  
  if (keywordIndex === -1) {
    return <span>{text}</span>;
  }
  
  const before = text.substring(0, keywordIndex);
  const match = text.substring(keywordIndex, keywordIndex + keyword.length);
  const after = text.substring(keywordIndex + keyword.length);

  return (
    <>
      {before}
      <span className="text-blue-500 font-medium">{match}</span>
      {after}
    </>
  );
};

export default SearchResultsPage;

