import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import {
  useFetchAutoCompleteData,
  AutoComplete,
  useInitialAutoCompleteData,
} from "../entities/auto-complete/model/model";
import {
  useInvalidateSearchHistories,
  useSearchHistories,
  useDeleteSearchHistory,
  useDeleteAllSearchHistories,
} from "../entities/search-history/model/model";
import { useDebounce } from "use-debounce";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { useTranslation } from "next-i18next";
import { useSearchOverlayTranslation } from "../hooks/useSearchOverlayTranslation";

export type SearchRecipeVariant = "mobile" | "tablet" | "desktop";

export interface SearchRecipeControllerProps {
  isSearching: boolean;
  setIsSearching: (value: boolean) => void;
  handleSearchSelect: (keyword: string) => void;
  
  isFocused: boolean;
  setIsFocused: (value: boolean) => void;
  keyboardInput: string;
  setKeyboardInput: (value: string) => void;
  displayAutocompletes: AutoComplete[];
  shouldShowDropdown: boolean;
  hasAutocompletes: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  
  handleClearInput: () => void;
  handleKeywordSelect: (keyword: string) => void;
  handleEnterKey: () => void;
  handleDismiss: () => void;
  handleFocus: () => void;
  
  autoCompleteData: { autocompletes: AutoComplete[] };
  searchHistories: { histories: string[] };
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  
  deleteSearchHistory: ReturnType<typeof useDeleteSearchHistory>;
  deleteAllSearchHistories: ReturnType<typeof useDeleteAllSearchHistories>;
  handleRecentSearchClick: (keyword: string) => void;
  handlePopularSearchClick: (keyword: string) => void;
  
  t: (key: string, options?: Record<string, unknown>) => string;
  searchBarT: (key: string) => string;
  
  router: ReturnType<typeof useRouter>;
}

export function useSearchRecipeController(
  _variant: SearchRecipeVariant
): SearchRecipeControllerProps {
  const router = useRouter();
  const invalidateSearchHistories = useInvalidateSearchHistories();
  const [isSearching, setIsSearching] = useState(false);
  
  const { t: searchBarT } = useTranslation("search-overlay");
  const [isFocused, setIsFocused] = useState(true);
  const [keyboardInput, setKeyboardInput] = useState("");
  const [debouncedSearchKeyword] = useDebounce(keyboardInput, 300);
  const { autoCompleteData: searchAutoComplete, isLoading } = useFetchAutoCompleteData(debouncedSearchKeyword.trim());
  const inputRef = useRef<HTMLInputElement>(null);
  const prevAutocompletesRef = useRef<AutoComplete[]>([]);
  
  const { autoCompleteData } = useInitialAutoCompleteData();
  const { searchHistories } = useSearchHistories();
  const deleteSearchHistory = useDeleteSearchHistory();
  const deleteAllSearchHistories = useDeleteAllSearchHistories();
  const [isExpanded, setIsExpanded] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { t } = useSearchOverlayTranslation();
  
  useEffect(() => {
    if (keyboardInput.length === 0) {
      prevAutocompletesRef.current = [];
      return;
    }
    
    if (!isLoading) {
      if (searchAutoComplete.autocompletes.length > 0) {
        prevAutocompletesRef.current = searchAutoComplete.autocompletes;
      } else if (debouncedSearchKeyword.trim().length > 0) {
        prevAutocompletesRef.current = [];
      }
    }
  }, [keyboardInput, searchAutoComplete.autocompletes, isLoading, debouncedSearchKeyword]);
  
  const displayAutocompletes = useMemo(
    () => searchAutoComplete.autocompletes.length > 0 
      ? searchAutoComplete.autocompletes 
      : prevAutocompletesRef.current,
    [searchAutoComplete.autocompletes]
  );
  
  const shouldShowDropdown = isFocused && keyboardInput.length > 0;
  const hasAutocompletes = displayAutocompletes.length > 0;
  
  useEffect(() => {
    setIsSearching(shouldShowDropdown);
  }, [shouldShowDropdown]);
  
  useEffect(() => {
    if (
      !isExpanded &&
      scrollContainerRef.current &&
      autoCompleteData.autocompletes.length > 0
    ) {
      const container = scrollContainerRef.current;
      const itemHeight = 60;
      let currentIndex = 0;

      const scrollToNext = () => {
        currentIndex = (currentIndex + 1) % autoCompleteData.autocompletes.length;
        container.scrollTo({
          top: currentIndex * itemHeight,
          behavior: "smooth",
        });
      };

      const scrollInterval = setInterval(scrollToNext, 2500);
      return () => clearInterval(scrollInterval);
    }
  }, [isExpanded, autoCompleteData.autocompletes.length]);
  
  const handleSearchSelect = useCallback((keyword: string) => {
    invalidateSearchHistories();
    router.push(`/search-results?q=${encodeURIComponent(keyword)}`);
  }, [invalidateSearchHistories, router]);
  
  const handleClearInput = useCallback(() => {
    setKeyboardInput("");
  }, []);
  
  const handleKeywordSelect = useCallback((keyword: string) => {
    inputRef.current?.blur();
    setIsFocused(false);
    handleSearchSelect(keyword);
  }, [handleSearchSelect]);
  
  const handleEnterKey = useCallback(() => {
    if (keyboardInput.trim()) {
      track(AMPLITUDE_EVENT.SEARCH_EXECUTED, {
        keyword: keyboardInput.trim(),
        search_method: "direct",
      });
      invalidateSearchHistories();
      inputRef.current?.blur();
      setIsFocused(false);
      handleSearchSelect(keyboardInput.trim());
    }
  }, [keyboardInput, invalidateSearchHistories, handleSearchSelect]);
  
  const handleDismiss = useCallback(() => {
    inputRef.current?.blur();
    setIsFocused(false);
  }, []);
  
  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);
  
  const handleRecentSearchClick = useCallback((keyword: string) => {
    track(AMPLITUDE_EVENT.SEARCH_EXECUTED, {
      keyword,
      search_method: "recent",
    });
    handleSearchSelect(keyword);
  }, [handleSearchSelect]);
  
  const handlePopularSearchClick = useCallback((keyword: string) => {
    track(AMPLITUDE_EVENT.SEARCH_EXECUTED, {
      keyword,
      search_method: "popular",
    });
    handleSearchSelect(keyword);
  }, [handleSearchSelect]);
  
  return {
    isSearching,
    setIsSearching,
    handleSearchSelect,
    
    isFocused,
    setIsFocused,
    keyboardInput,
    setKeyboardInput,
    displayAutocompletes,
    shouldShowDropdown,
    hasAutocompletes,
    inputRef: inputRef as React.RefObject<HTMLInputElement | null>,
    
    handleClearInput,
    handleKeywordSelect,
    handleEnterKey,
    handleDismiss,
    handleFocus,
    
    autoCompleteData,
    searchHistories,
    isExpanded,
    setIsExpanded,
    scrollContainerRef: scrollContainerRef as React.RefObject<HTMLDivElement | null>,
    
    deleteSearchHistory,
    deleteAllSearchHistories,
    handleRecentSearchClick,
    handlePopularSearchClick,
    
    t,
    searchBarT,
    
    router,
  };
}
