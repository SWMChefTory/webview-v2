import Header, { BackButton } from "@/src/shared/ui/header";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useFetchAutoCompleteData, AutoComplete } from "./entities/auto-complete/model/model";
import { useInvalidateSearchHistories } from "./entities/search-history/model/model";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { HeaderSpacing } from "@/src/shared/ui/header";
import { IoMdCloseCircle } from "react-icons/io";
import { motion } from "framer-motion";
import { useDebounce } from "use-debounce";
import { DefaultContentOverlay } from "./ui";

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
          />
        }
      />
      <div className="flex flex-col w-full h-full overflow-y-scroll">
        <DefaultContentOverlay onSearchSelect={handleSearchSelect} />
      </div>
    </div>
  );
};

const HeaderLeftContent = ({
  onSearchExecute,
  onSearchSelect,
}: {
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
          onSearchExecute={onSearchExecute}
          onSearchSelect={onSearchSelect}
        />
      </div>
    </div>
  );
};

const SearchBar = ({
  onSearchExecute,
  onSearchSelect,
}: {
  onSearchExecute: () => void;
  onSearchSelect: (keyword: string) => void;
}) => {
  const [isFocused, setIsFocused] = useState(true);
  const [keyboardInput, setKeyboardInput] = useState("");
  const [debouncedSearchKeyword] = useDebounce(keyboardInput, 300);
  const router = useRouter();
  const { autoCompleteData, isLoading } = useFetchAutoCompleteData(debouncedSearchKeyword.trim());
  const inputRef = useRef<HTMLInputElement>(null);
  const prevAutocompletesRef = useRef<AutoComplete[]>([]);
  
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
          autoFocus
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

export default SearchRecipePage;