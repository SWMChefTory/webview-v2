import { useRef, useState, useEffect, ReactNode } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { motion } from "framer-motion";
import { useDebounce } from "use-debounce";
import { useFetchAutoCompleteData, AutoComplete } from "@/src/pages/search-recipe/entities/auto-complete/model/model";
import { AutoCompleteDropdown } from "./AutoCompleteDropdown";

interface SearchBarProps {
  initialKeyword?: string;
  onSearchExecute: () => void;
  onSearchSelect: (keyword: string) => void;
  autoFocus?: boolean;
  fallbackContent?: ReactNode;
}

export const SearchBar = ({
  initialKeyword = "",
  onSearchExecute,
  onSearchSelect,
  autoFocus = false,
  fallbackContent,
}: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(autoFocus);
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
          autoFocus={autoFocus}
          enterKeyHint="search"
        />
        {keyboardInput.length > 0 && (
          <motion.button
            className="p-1 z-20"
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
          fallbackContent={fallbackContent}
        />
      )}
    </div>
  );
};

