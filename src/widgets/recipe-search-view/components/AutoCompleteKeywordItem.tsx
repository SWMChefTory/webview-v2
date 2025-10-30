import { FaMagnifyingGlass } from "react-icons/fa6";
import { motion } from "framer-motion";
import { HighlightKeywordText } from "./HighlightKeywordText";

interface AutoCompleteKeywordItemProps {
  keyword: string;
  text: string;
  onClick?: () => void;
}

export const AutoCompleteKeywordItem = ({
  keyword,
  text,
  onClick,
}: AutoCompleteKeywordItemProps) => {
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

