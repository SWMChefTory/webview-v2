
import Header, { BackButton } from "@/src/shared/ui/header/header";
import { useRef, useState, useEffect, useCallback, memo, useMemo } from "react";
import { useRouter } from "next/router";
import { useFetchAutoCompleteData, AutoComplete } from "./entities/auto-complete/model/model";
import { useInvalidateSearchHistories } from "./entities/search-history/model/model";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdCloseCircle } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "use-debounce";
import { DefaultContentOverlay } from "./ui";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { useTranslation } from "next-i18next";

const SearchRecipePage = () => {
  const router = useRouter();
  const invalidateSearchHistories = useInvalidateSearchHistories();
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearchSelect = useCallback((keyword: string) => {
    invalidateSearchHistories();
    router.push(`/search-results?q=${encodeURIComponent(keyword)}`);
  }, [invalidateSearchHistories, router]);
  
  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden">
      <Header
        leftContent={
          <HeaderLeftContent
            onSearchExecute={invalidateSearchHistories}
            onSearchSelect={handleSearchSelect}
            onSearchStateChange={setIsSearching}
          />
        }
      />
      {!isSearching && (
        <div className="flex flex-col w-full h-full overflow-y-scroll">
          <DefaultContentOverlay onSearchSelect={handleSearchSelect} />
        </div>
      )}
    </div>
  );
};

const HeaderLeftContent = memo(({
  onSearchExecute,
  onSearchSelect,
  onSearchStateChange,
}: {
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
  onSearchExecute,
  onSearchSelect,
  onSearchStateChange,
}: {
  onSearchExecute: () => void;
  onSearchSelect: (keyword: string) => void;
  onSearchStateChange: (isSearching: boolean) => void;
}) => {
  const { t } = useTranslation("search-overlay");
  const [isFocused, setIsFocused] = useState(true);
  const [keyboardInput, setKeyboardInput] = useState("");
  const [debouncedSearchKeyword] = useDebounce(keyboardInput, 300);
  const { autoCompleteData, isLoading } = useFetchAutoCompleteData(debouncedSearchKeyword.trim());
  const inputRef = useRef<HTMLInputElement>(null);
  const prevAutocompletesRef = useRef<AutoComplete[]>([]);
  
  // 자동완성 데이터 관리 - 하나의 useEffect로 통합
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
      track(AMPLITUDE_EVENT.SEARCH_EXECUTED, {
        keyword: keyboardInput.trim(),
        search_method: "direct",
      });
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
          placeholder={t("input.placeholder")}
          value={keyboardInput}
          onChange={(e) => setKeyboardInput(e.target.value)}
          onFocus={handleFocus}
          onKeyDown={(e) => e.key === "Enter" && handleEnterKey()}
          autoFocus
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
            onSearchSelect={onSearchSelect}
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
  onSearchSelect,
  onDismiss,
}: {
  hasAutocompletes: boolean;
  autocompletes: AutoComplete[];
  keyboardInput: string;
  onSelect: (keyword: string) => void;
  onSearchSelect: (keyword: string) => void;
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
          {!hasAutocompletes ? (
            <DefaultContentOverlay onSearchSelect={onSearchSelect} />
          ) : (
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
          )}
        </div>
        
        <AnimatePresence>
          {!hasAutocompletes && (
            <motion.div 
              className="fixed left-0 right-0 bottom-0 bg-black/70 z-20"
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
          )}
        </AnimatePresence>
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
    track(AMPLITUDE_EVENT.SEARCH_EXECUTED, {
      keyword: text,
      search_method: "autocomplete",
    });
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

export default SearchRecipePage;