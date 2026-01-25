import { memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IoMdCloseCircle } from "react-icons/io";
import Header, { BackButton } from "@/src/shared/ui/header/header";
import { useSearchRecipeController } from "./SearchRecipe.controller";
import { TrendingRecipeSection } from "./trendingRecipeSection";
import {
  AutoCompleteKeywordItem,
  PopularSearchItem,
  RecentSearchChip,
} from "./SearchRecipe.common";

export function SearchRecipeTablet() {
  const controller = useSearchRecipeController("tablet");

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      <Header
        leftContent={
          <HeaderLeftContentTablet
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
          <AutoCompleteDropdownTablet
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
          <DefaultContentTablet controller={controller} />
        </div>
      )}
    </div>
  );
}

const HeaderLeftContentTablet = memo(({
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
        <div className="relative flex flex-col justify-center w-full h-full">
          <div className="flex items-center">
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              className="w-full text-xl outline-none z-10"
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
                className="p-3 z-20"
                whileTap={{ scale: 0.8 }}
                onClick={handleClearInput}
              >
                <IoMdCloseCircle size={28} className="text-gray-500" />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

HeaderLeftContentTablet.displayName = 'HeaderLeftContentTablet';

const AutoCompleteDropdownTablet = memo(({
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
            <DefaultContentTablet controller={controller} onSearchSelect={onSearchSelect} />
          ) : (
            <div className="flex flex-col w-full max-w-[1024px] mx-auto">
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

AutoCompleteDropdownTablet.displayName = 'AutoCompleteDropdownTablet';

const DefaultContentTablet = memo(({
  controller,
  onSearchSelect,
}: {
  controller: ReturnType<typeof useSearchRecipeController>;
  onSearchSelect?: (keyword: string) => void;
}) => {
  const handleSearchSelect = onSearchSelect ?? controller.handleSearchSelect;
  
  return (
    <div className="flex flex-col w-full h-full overflow-y-scroll">
      <div className="px-6 py-8 space-y-8 max-w-[1024px] mx-auto w-full">
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">
              {controller.t("recent.title")}
            </h2>
            {controller.searchHistories.histories.length > 0 && (
              <button
                className="text-base font-medium text-gray-500 hover:text-gray-700 transition-colors px-3 py-1 rounded-full hover:bg-gray-100"
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
            <div className="-mx-6 min-h-[56px]">
              <div
                className="px-6 py-2 flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory overscroll-x-contain scroll-px-6"
                style={{
                  WebkitOverflowScrolling: "touch",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
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
            <div className="min-h-[56px] flex items-center justify-center">
              <p className="text-lg text-gray-500 text-center">
                {controller.t("recent.empty")}
              </p>
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold text-gray-900">
                {controller.t("trendingSearch.title")}
              </h2>
              {!controller.isExpanded && controller.autoCompleteData.autocompletes.length > 0 && (
                <span className="text-base font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {controller.t("trendingSearch.count", {
                    num: controller.autoCompleteData.autocompletes.length,
                  })}
                </span>
              )}
            </div>
            <button
              className="flex items-center gap-2 text-base font-medium text-gray-600 hover:text-gray-900 transition-colors group px-3 py-1 rounded-full hover:bg-gray-100"
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
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </button>
          </div>

          {controller.autoCompleteData.autocompletes.length > 0 ? (
            controller.isExpanded ? (
              <div className="grid grid-cols-3 gap-5">
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
              <CollapsedPopularSearchTablet
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

DefaultContentTablet.displayName = 'DefaultContentTablet';

const CollapsedPopularSearchTablet = memo(({
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
      style={{ height: "64px" }}
    >
      <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />

      {autocompletes.length > 1 && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-20">
          <div className="flex flex-col gap-1">
            {Array.from({ length: Math.min(3, autocompletes.length) }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
            ))}
          </div>
        </div>
      )}

      {autocompletes.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-3 px-4 absolute w-full h-[64px] cursor-pointer hover:bg-orange-50 active:bg-orange-100 transition-all duration-200 group rounded-lg"
          style={{ top: `${index * 64}px` }}
          onClick={() => onClick(item.autocomplete)}
        >
          <span className="text-lg font-bold text-orange-600 shrink-0 w-8 group-hover:text-orange-700 transition-colors">
            {index + 1}
          </span>
          <span className="text-lg font-medium flex-1 text-gray-900 group-hover:text-orange-700 transition-colors line-clamp-2 leading-tight">
            {item.autocomplete}
          </span>
        </div>
      ))}
    </div>
  );
});

CollapsedPopularSearchTablet.displayName = 'CollapsedPopularSearchTablet';
