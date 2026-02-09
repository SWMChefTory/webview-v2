import { memo, useCallback } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { motion } from "motion/react";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { AutoComplete } from "../entities/auto-complete/model/model";

export const HighlightKeywordText = memo(({
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

export const AutoCompleteKeywordItem = memo(({
  keyword,
  text,
  onClick,
  isTablet = false,
}: {
  keyword: string;
  text: string;
  onClick?: (keyword: string) => void;
  isTablet?: boolean;
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
      className={isTablet 
        ? "flex flex-row gap-3 items-center py-4 px-6 hover:bg-orange-50 cursor-pointer transition-colors duration-200"
        : "flex flex-row gap-3 items-center py-3 px-4 hover:bg-gray-50 cursor-pointer"
      }
      onClick={handleClick}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
    >
      <FaMagnifyingGlass size={isTablet ? 18 : 16} className={isTablet ? "shrink-0 text-gray-500" : "shrink-0 text-gray-600"} />
      <span className={isTablet ? "text-xl flex-1 truncate text-gray-900" : "text-lg flex-1 truncate text-gray-900"}>
        <HighlightKeywordText text={text} keyword={keyword} />
      </span>
    </motion.div>
  );
}, (prevProps, nextProps) => {
  return prevProps.text === nextProps.text && 
         prevProps.keyword === nextProps.keyword &&
         prevProps.isTablet === nextProps.isTablet;
});

AutoCompleteKeywordItem.displayName = 'AutoCompleteKeywordItem';

export interface PopularSearchItemProps {
  item: AutoComplete;
  index: number;
  onClick: (keyword: string) => void;
  isTablet?: boolean;
}

export const PopularSearchItem = memo(({
  item,
  index,
  onClick,
  isTablet = false,
}: PopularSearchItemProps) => {
  return (
    <div
      className={isTablet
        ? "flex items-center gap-2.5 px-4 py-3 lg:px-5 lg:py-4 rounded-lg hover:bg-orange-50 hover:border-orange-200 border border-transparent cursor-pointer transition-all duration-200 group"
        : "flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-orange-50 hover:border-orange-200 border border-transparent cursor-pointer transition-all duration-200 group"
      }
      onClick={() => onClick(item.autocomplete)}
    >
      <span className={isTablet
        ? "text-lg lg:text-xl font-bold text-orange-600 shrink-0 w-8 group-hover:text-orange-700 transition-colors"
        : "text-base font-bold text-orange-600 shrink-0 w-6 group-hover:text-orange-700 transition-colors"
      }>
        {index + 1}
      </span>
      <span className={isTablet
        ? "text-lg lg:text-xl font-medium flex-1 text-gray-900 group-hover:text-orange-700 transition-colors line-clamp-2 leading-tight"
        : "text-base font-medium flex-1 text-gray-900 group-hover:text-orange-700 transition-colors line-clamp-2 leading-tight"
      }>
        {item.autocomplete}
      </span>
    </div>
  );
});

PopularSearchItem.displayName = 'PopularSearchItem';

export interface RecentSearchChipProps {
  search: string;
  onSelect: (keyword: string) => void;
  onDelete: (keyword: string) => void;
  isDeleting: boolean;
  isTablet?: boolean;
}

export const RecentSearchChip = memo(({
  search,
  onSelect,
  onDelete,
  isDeleting,
  isTablet = false,
}: RecentSearchChipProps) => {
  return (
    <div
      className={isTablet
        ? "shrink-0 snap-start flex items-center gap-2 px-4 py-2 lg:px-5 lg:py-2.5 rounded-full bg-white border border-gray-200 cursor-pointer hover:border-orange-300 hover:bg-orange-50 transition-all duration-200"
        : "shrink-0 snap-start flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 cursor-pointer"
      }
      onClick={() => onSelect(search)}
    >
      <span className={isTablet
        ? "text-base lg:text-lg font-medium text-gray-700 whitespace-nowrap"
        : "text-sm font-medium text-gray-700 whitespace-nowrap"
      }>
        {search.length > 10 ? `${search.slice(0, 10)}...` : search}
      </span>
      <button
        className={isTablet
          ? "text-gray-400 text-lg leading-none hover:text-gray-600"
          : "text-gray-400 text-base leading-none"
        }
        onClick={(e) => {
          e.stopPropagation();
          onDelete(search);
        }}
        disabled={isDeleting}
      >
        ×
      </button>
    </div>
  );
});

RecentSearchChip.displayName = 'RecentSearchChip';
