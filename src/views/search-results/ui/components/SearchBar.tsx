import { memo, useRef, useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IoMdCloseCircle } from "react-icons/io";
import { useDebounce } from "use-debounce";
import {
  useFetchAutoCompleteData,
  AutoComplete,
} from "@/src/views/search-recipe/entities/auto-complete/model/model";
import { useSearchResultsTranslation } from "../../hooks/useSearchResultsTranslation";
import { AutoCompleteDropdown } from "./AutoCompleteDropdown";

interface SearchBarProps {
  initialKeyword: string;
  onSearchExecute: () => void;
  onSearchSelect: (keyword: string) => void;
  onSearchStateChange: (isSearching: boolean) => void;
}

export const SearchBar = memo(function SearchBar({
  initialKeyword,
  onSearchExecute,
  onSearchSelect,
  onSearchStateChange,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [keyboardInput, setKeyboardInput] = useState(initialKeyword);
  const [debouncedSearchKeyword] = useDebounce(keyboardInput, 300);
  const { autoCompleteData, isLoading } = useFetchAutoCompleteData(
    debouncedSearchKeyword.trim()
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const prevAutocompletesRef = useRef<AutoComplete[]>([]);
  const { t } = useSearchResultsTranslation();

  useEffect(() => {
    setKeyboardInput(initialKeyword);
  }, [initialKeyword]);

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
  }, [
    keyboardInput,
    autoCompleteData.autocompletes,
    isLoading,
    debouncedSearchKeyword,
  ]);

  const displayAutocompletes = useMemo(
    () =>
      autoCompleteData.autocompletes.length > 0
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

  const handleKeywordSelect = useCallback(
    (keyword: string) => {
      inputRef.current?.blur();
      setIsFocused(false);
      onSearchSelect(keyword);
    },
    [onSearchSelect]
  );

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
          placeholder={t("placeholder")}
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
