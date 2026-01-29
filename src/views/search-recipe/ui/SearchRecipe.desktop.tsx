import { memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IoMdCloseCircle, IoMdSearch } from "react-icons/io";
import Header, { BackButton } from "@/src/shared/ui/header/header";
import { useSearchRecipeController } from "./SearchRecipe.controller";
import { TrendingRecipeSection } from "./trendingRecipeSection";
import {
  AutoCompleteKeywordItem,
  PopularSearchItem,
  RecentSearchChip,
} from "./SearchRecipe.common";

export function SearchRecipeDesktop() {
  const controller = useSearchRecipeController("desktop");

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden">
      <Header
        leftContent={
          <HeaderLeftContentDesktop
            router={controller.router}
            keyboardInput={controller.keyboardInput}
            setKeyboardInput={controller.setKeyboardInput}
            inputRef={controller.inputRef}
            handleClearInput={controller.handleClearInput}
            handleFocus={controller.handleFocus}
            handleEnterKey={controller.handleEnterKey}
            searchBarT={controller.searchBarT}
          />
        }
      />
      
      <AnimatePresence>
        {controller.shouldShowDropdown && (
          <AutoCompleteDropdownDesktop
            hasAutocompletes={controller.hasAutocompletes}
            autocompletes={controller.displayAutocompletes}
            keyboardInput={controller.keyboardInput}
            onSelect={controller.handleKeywordSelect}
            onSearchSelect={controller.handleSearchSelect}
            onDismiss={controller.handleDismiss}
            controller={controller}
          />
        )}
      </AnimatePresence>
      
      {!controller.isSearching && (
        <div className="flex flex-col w-full h-full overflow-y-scroll">
          <DefaultContentDesktop controller={controller} />
        </div>
      )}
    </div>
  );
}

const HeaderLeftContentDesktop = memo(({
  router,
  keyboardInput,
  setKeyboardInput,
  inputRef,
  handleClearInput,
  handleFocus,
  handleEnterKey,
  searchBarT,
}: {
  router: ReturnType<typeof useSearchRecipeController>["router"];
  keyboardInput: string;
  setKeyboardInput: (value: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  handleClearInput: () => void;
  handleFocus: () => void;
  handleEnterKey: () => void;
  searchBarT: (key: string) => string;
}) => {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-row gap-2 w-full h-full items-center justify-start pr-6">
        <div className="z-10">
          <BackButton onClick={() => router.back()} />
        </div>
        <div className="relative flex flex-col justify-center w-full h-full py-2">
          <div className="flex items-center w-full h-full bg-gray-50 border border-gray-200 hover:border-gray-300 hover:bg-white focus-within:bg-white focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-100/50 rounded-2xl px-6 transition-all duration-300 shadow-sm hover:shadow-md focus-within:shadow-lg">
            <IoMdSearch size={28} className="text-gray-400 mr-4 shrink-0" />
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              className="w-full text-2xl bg-transparent outline-none text-gray-900 placeholder:text-gray-400 z-10 font-medium"
              type="text"
              placeholder={searchBarT("input.placeholder")}
              value={keyboardInput}
              onChange={(e) => setKeyboardInput(e.target.value)}
              onFocus={handleFocus}
              onKeyDown={(e) => e.key === "Enter" && handleEnterKey()}
              autoFocus
              enterKeyHint="search"
            />
            {keyboardInput.length > 0 && (
              <motion.button
                className="p-1 z-20 ml-2"
                whileTap={{ scale: 0.8 }}
                onClick={handleClearInput}
              >
                <IoMdCloseCircle size={24} className="text-gray-400 hover:text-gray-600" />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

HeaderLeftContentDesktop.displayName = 'HeaderLeftContentDesktop';

const AutoCompleteDropdownDesktop = memo(({
  hasAutocompletes,
  autocompletes,
  keyboardInput,
  onSelect,
  onSearchSelect,
  onDismiss,
  controller,
}: {
  hasAutocompletes: boolean;
  autocompletes: ReturnType<typeof useSearchRecipeController>["displayAutocompletes"];
  keyboardInput: string;
  onSelect: (keyword: string) => void;
  onSearchSelect: (keyword: string) => void;
  onDismiss: () => void;
  controller: ReturnType<typeof useSearchRecipeController>;
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
            <DefaultContentDesktop controller={controller} onSearchSelect={onSearchSelect} />
          ) : (
            <div className="flex flex-col w-full max-w-[1600px] mx-auto">
              {autocompletes.map((item) => (
                <AutoCompleteKeywordItem
                  key={item.autocomplete}
                  text={item.autocomplete}
                  keyword={keyboardInput}
                  onClick={onSelect}
                  isTablet
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
                onDismiss();
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

AutoCompleteDropdownDesktop.displayName = 'AutoCompleteDropdownDesktop';

const DefaultContentDesktop = memo(({
  controller,
  onSearchSelect,
}: {
  controller: ReturnType<typeof useSearchRecipeController>;
  onSearchSelect?: (keyword: string) => void;
}) => {
  const handleSearchSelect = onSearchSelect ?? controller.handleSearchSelect;
  
  return (
    <div className="flex flex-col w-full h-full overflow-y-scroll">
      <div className="px-8 py-10 space-y-10 max-w-[1600px] mx-auto w-full">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
              {controller.t("recent.title")}
            </h2>
            {controller.searchHistories.histories.length > 0 && (
              <button
                className="text-base font-medium text-gray-500 hover:text-gray-700 transition-colors"
                onClick={() => controller.deleteAllSearchHistories.mutate()}
                disabled={controller.deleteAllSearchHistories.isPending}
              >
                {controller.deleteAllSearchHistories.isPending
                  ? controller.t("recent.deleting")
                  : controller.t("recent.deleteAll")}
              </button>
            )}
          </div>

          {controller.searchHistories.histories.length > 0 ? (
            <div className="-mx-8 min-h-[52px]">
              <div className="px-8 py-1 flex flex-wrap gap-4">
                {controller.searchHistories.histories.map((search, index) => (
                  <RecentSearchChip
                    key={index}
                    search={search}
                    onSelect={handleSearchSelect}
                    onDelete={(keyword) => controller.deleteSearchHistory.mutate(keyword)}
                    isDeleting={controller.deleteSearchHistory.isPending}
                    isTablet
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="min-h-[52px] flex items-center justify-center">
              <p className="text-lg text-gray-500 text-center">
                {controller.t("recent.empty")}
              </p>
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
                {controller.t("trendingSearch.title")}
              </h2>
              {!controller.isExpanded && controller.autoCompleteData.autocompletes.length > 0 && (
                <span className="text-lg font-medium text-orange-600 bg-orange-50 px-4 py-1.5 rounded-full">
                  {controller.t("trendingSearch.count", {
                    num: controller.autoCompleteData.autocompletes.length,
                  })}
                </span>
              )}
            </div>
            <button
              className="flex items-center gap-2 text-base font-medium text-gray-600 hover:text-gray-900 transition-colors group"
              onClick={() => controller.setIsExpanded(!controller.isExpanded)}
            >
              <span>
                {controller.isExpanded
                  ? controller.t("trendingSearch.collapse")
                  : controller.t("trendingSearch.expand")}
              </span>
              <div
                className={`transform transition-transform duration-200 ${
                  controller.isExpanded ? "rotate-180" : "rotate-0"
                }`}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-gray-500 group-hover:text-gray-700"
                >
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </button>
          </div>

          {controller.autoCompleteData.autocompletes.length > 0 ? (
            controller.isExpanded ? (
                <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 2xl:gap-8">
                  {controller.autoCompleteData.autocompletes.map((item, index) => (
                  <PopularSearchItem
                    key={index}
                    item={item}
                    index={index}
                    onClick={controller.handlePopularSearchClick}
                    isTablet
                  />
                ))}
              </div>
            ) : (
              <CollapsedPopularSearchDesktop
                autocompletes={controller.autoCompleteData.autocompletes}
                scrollContainerRef={controller.scrollContainerRef}
                onClick={controller.handlePopularSearchClick}
              />
            )
          ) : (
            <p className="text-lg text-gray-500 py-8">
              {controller.t("trendingSearch.empty")}
            </p>
          )}
        </section>

        <TrendingRecipeSection />
      </div>
    </div>
  );
});

DefaultContentDesktop.displayName = 'DefaultContentDesktop';

const CollapsedPopularSearchDesktop = memo(({
  autocompletes,
  scrollContainerRef,
  onClick,
}: {
  autocompletes: ReturnType<typeof useSearchRecipeController>["autoCompleteData"]["autocompletes"];
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  onClick: (keyword: string) => void;
}) => {
  return (
    <div
      ref={scrollContainerRef as React.RefObject<HTMLDivElement>}
      className="relative overflow-hidden rounded-xl border border-gray-200 bg-white"
      style={{ height: "72px" }}
    >
      <div className="absolute top-0 left-0 right-0 h-5 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />

      {autocompletes.length > 1 && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20">
          <div className="flex flex-col gap-1.5">
            {Array.from({ length: Math.min(3, autocompletes.length) }).map((_, i) => (
              <div key={i} className="w-2 h-2 bg-gray-400 rounded-full" />
            ))}
          </div>
        </div>
      )}

      {autocompletes.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-4 px-6 absolute w-full h-[72px] cursor-pointer hover:bg-orange-50 transition-all duration-200 group rounded-lg"
          style={{ top: `${index * 72}px` }}
          onClick={() => onClick(item.autocomplete)}
        >
          <span className="text-xl font-bold text-orange-600 shrink-0 w-10 group-hover:text-orange-700 transition-colors">
            {index + 1}
          </span>
          <span className="text-xl font-medium flex-1 text-gray-900 group-hover:text-orange-700 transition-colors line-clamp-2 leading-tight">
            {item.autocomplete}
          </span>
        </div>
      ))}
    </div>
  );
});

CollapsedPopularSearchDesktop.displayName = 'CollapsedPopularSearchDesktop';
