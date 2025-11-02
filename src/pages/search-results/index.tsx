import Header, { BackButton } from "@/src/shared/ui/header/header";
import { useRouter } from "next/router";
import { useEffect, useRef, useState, useCallback, memo, useMemo } from "react";
import { SearchResultsSkeleton, SearchResultsContent } from "./ui";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import { useFetchAutoCompleteData, AutoComplete } from "@/src/pages/search-recipe/entities/auto-complete/model/model";
import { useInvalidateSearchHistories } from "@/src/pages/search-recipe/entities/search-history/model/model";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdCloseCircle } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "use-debounce";

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

  const handleSearchSelect = useCallback((keyword: string) => {
    invalidateSearchHistories();
    setSearchKeyword(keyword);
    router.replace(`/search-results?q=${encodeURIComponent(keyword)}`, undefined, { shallow: true });
  }, [invalidateSearchHistories, router]);

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
          pointerEvents: isSearching ? 'none' : 'auto',
          touchAction: isSearching ? 'none' : 'auto'
        }}
      >
        <SSRSuspense fallback={<SearchResultsSkeleton />}>
          <SearchResultsContent keyword={searchKeyword} />
        </SSRSuspense>
      </div>
    </div>
  );
};

const HeaderLeftContent = memo(({
  initialKeyword,
  onSearchExecute,
  onSearchSelect,
  onSearchStateChange,
}: {
  initialKeyword: string;
  onSearchExecute: () => void;
  onSearchSelect: (keyword: string) => void;
  onSearchStateChange: (isSearching: boolean) => void;
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
          onSearchStateChange={onSearchStateChange}
        />
      </div>
    </div>
  );
});

HeaderLeftContent.displayName = 'HeaderLeftContent';

const SearchBar = memo(({
  initialKeyword,
  onSearchExecute,
  onSearchSelect,
  onSearchStateChange,
}: {
  initialKeyword: string;
  onSearchExecute: () => void;
  onSearchSelect: (keyword: string) => void;
  onSearchStateChange: (isSearching: boolean) => void;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [keyboardInput, setKeyboardInput] = useState(initialKeyword);
  const [debouncedSearchKeyword] = useDebounce(keyboardInput, 300);
  const { autoCompleteData, isLoading } = useFetchAutoCompleteData(debouncedSearchKeyword.trim());
  const inputRef = useRef<HTMLInputElement>(null);
  const prevAutocompletesRef = useRef<AutoComplete[]>([]);
  
  // initialKeyword 변경 시 keyboardInput 동기화
  useEffect(() => {
    setKeyboardInput(initialKeyword);
  }, [initialKeyword]);

  // 자동완성 데이터 관리 - 통합된 useEffect
  useEffect(() => {
    if (keyboardInput.length === 0) {
      prevAutocompletesRef.current = [];
      return;
    }
    
    if (!isLoading) {
      if (autoCompleteData.autocompletes.length > 0) {
        prevAutocompletesRef.current = autoCompleteData.autocompletes;
      } else if (debouncedSearchKeyword.trim().length > 0) {
        prevAutocompletesRef.current = [];
      }
    }
  }, [keyboardInput, autoCompleteData.autocompletes, isLoading, debouncedSearchKeyword]);
  
  // useMemo로 displayAutocompletes 계산 최적화
  const displayAutocompletes = useMemo(
    () => autoCompleteData.autocompletes.length > 0 
      ? autoCompleteData.autocompletes 
      : prevAutocompletesRef.current,
    [autoCompleteData.autocompletes]
  );
  
  const shouldShowDropdown = isFocused && keyboardInput.length > 0;
  const hasAutocompletes = displayAutocompletes.length > 0;
  
  useEffect(() => {
    onSearchStateChange(shouldShowDropdown);
  }, [shouldShowDropdown, onSearchStateChange]);
  
  const handleClearInput = useCallback(() => {
    setKeyboardInput("");
  }, []);
  
  const handleKeywordSelect = useCallback((keyword: string) => {
    inputRef.current?.blur();
    setIsFocused(false);
    onSearchSelect(keyword);
  }, [onSearchSelect]);
  
  const handleEnterKey = useCallback(() => {
    if (keyboardInput.trim()) {
      onSearchExecute();
      inputRef.current?.blur();
      setIsFocused(false);
      onSearchSelect(keyboardInput.trim());
    }
  }, [keyboardInput, onSearchExecute, onSearchSelect]);
  
  const handleDismiss = useCallback(() => {
    inputRef.current?.blur();
    setIsFocused(false);
  }, []);
  
  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);
  
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
          onFocus={handleFocus}
          onKeyDown={(e) => e.key === "Enter" && handleEnterKey()}
          enterKeyHint="search"
        />
        {keyboardInput.length > 0 && (
          <motion.button
            className="p-3 z-20"
            whileTap={{ scale: 0.8 }}
            onClick={handleClearInput}
          >
            <IoMdCloseCircle size={24} className="text-gray-500" />
          </motion.button>
        )}
      </div>
      
      <AnimatePresence>
        {shouldShowDropdown && (
          <AutoCompleteDropdown
            hasAutocompletes={hasAutocompletes}
            autocompletes={displayAutocompletes}
            keyboardInput={keyboardInput}
            onSelect={handleKeywordSelect}
            onDismiss={handleDismiss}
          />
        )}
      </AnimatePresence>
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

const AutoCompleteDropdown = memo(({
  hasAutocompletes,
  autocompletes,
  keyboardInput,
  onSelect,
  onDismiss,
}: {
  hasAutocompletes: boolean;
  autocompletes: AutoComplete[];
  keyboardInput: string;
  onSelect: (keyword: string) => void;
  onDismiss?: () => void;
}) => {
  return (
    <motion.div 
      className="fixed left-0 right-0 z-50"
      style={{ top: '44px' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <div className="relative">
        <div 
          className="relative flex flex-col w-full bg-white z-10"
          style={{ 
            minHeight: hasAutocompletes ? 'calc(100vh - 44px)' : '0',
            maxHeight: 'calc(100vh - 44px)',
            overflowY: 'auto',
          }}
        >
          <div className="flex flex-col w-full">
            {autocompletes.map((item) => (
              <AutoCompleteKeywordItem
                key={item.autocomplete}
                text={item.autocomplete}
                keyword={keyboardInput}
                onClick={onSelect}
              />
            ))}
          </div>
        </div>
        
        <motion.div 
          className="fixed left-0 right-0 bottom-0 bg-black/70 z-0"
          style={{ top: '44px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            e.stopPropagation();
            onDismiss?.();
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            onDismiss?.();
          }}
        />
      </div>
    </motion.div>
  );
});

AutoCompleteDropdown.displayName = 'AutoCompleteDropdown';

const AutoCompleteKeywordItem = memo(({
  keyword,
  text,
  onClick,
}: {
  keyword: string;
  text: string;
  onClick?: (keyword: string) => void;
}) => {
  const handleClick = useCallback(() => {
    onClick?.(text);
  }, [onClick, text]);

  return (
    <motion.div
      className="flex flex-row gap-3 items-center py-3 px-4 hover:bg-gray-50 cursor-pointer"
      onClick={handleClick}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
    >
      <FaMagnifyingGlass size={16} className="shrink-0 text-gray-600" />
      <span className="text-lg flex-1 truncate text-gray-900">
        <HighlightKeywordText text={text} keyword={keyword} />
      </span>
    </motion.div>
  );
}, (prevProps, nextProps) => {
  return prevProps.text === nextProps.text && 
         prevProps.keyword === nextProps.keyword;
});

AutoCompleteKeywordItem.displayName = 'AutoCompleteKeywordItem';

const HighlightKeywordText = memo(({
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
      <span className="text-orange-600 font-semibold">{match}</span>
      {after}
    </>
  );
});

HighlightKeywordText.displayName = 'HighlightKeywordText';

export default SearchResultsPage;