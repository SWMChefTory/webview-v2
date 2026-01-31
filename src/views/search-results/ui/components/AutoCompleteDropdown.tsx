import { memo, useCallback } from "react";
import { motion } from "motion/react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import type { AutoComplete } from "@/src/views/search-recipe/entities/auto-complete/model/model";

interface AutoCompleteDropdownProps {
  hasAutocompletes: boolean;
  autocompletes: AutoComplete[];
  keyboardInput: string;
  onSelect: (keyword: string) => void;
  onDismiss?: () => void;
}

export const AutoCompleteDropdown = memo(function AutoCompleteDropdown({
  hasAutocompletes,
  autocompletes,
  keyboardInput,
  onSelect,
  onDismiss,
}: AutoCompleteDropdownProps) {
  return (
    <motion.div
      className="fixed left-0 right-0 z-50"
      style={{ top: "44px" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <div className="relative">
        <div
          className="relative flex flex-col w-full bg-white z-10"
          style={{
            minHeight: hasAutocompletes ? "calc(100vh - 44px)" : "0",
            maxHeight: "calc(100vh - 44px)",
            overflowY: "auto",
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
          style={{ top: "44px" }}
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

interface AutoCompleteKeywordItemProps {
  keyword: string;
  text: string;
  onClick?: (keyword: string) => void;
}

const AutoCompleteKeywordItem = memo(
  function AutoCompleteKeywordItem({
    keyword,
    text,
    onClick,
  }: AutoCompleteKeywordItemProps) {
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
  },
  (prevProps, nextProps) => {
    return (
      prevProps.text === nextProps.text &&
      prevProps.keyword === nextProps.keyword
    );
  }
);

interface HighlightKeywordTextProps {
  text: string;
  keyword: string;
}

const HighlightKeywordText = memo(function HighlightKeywordText({
  text,
  keyword,
}: HighlightKeywordTextProps) {
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
