import Header, { BackButton } from "@/src/shared/ui/header";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useFetchAutoCompleteData } from "./entities/auto-complete/model/model";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { HeaderSpacing } from "@/src/shared/ui/header";
import { IoMdCloseCircle } from "react-icons/io";
import { motion } from "framer-motion";
import { useDebounce } from "use-debounce";
import { SearchResultsSkelton, SearchResultsReady } from "./ui";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";

const SearchRecipePage = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden">
      <Header
        leftContent={
          <HeaderLeftContent
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
          />
        }
      />
      <div className="flex flex-col w-full h-full overflow-y-scroll">
        <SSRSuspense fallback={<SearchResultsSkelton />}>
          <SearchResultsReady keyword={searchKeyword} />
        </SSRSuspense>
      </div>
    </div>
  );
};

const HeaderLeftContent = ({
  searchKeyword,
  setSearchKeyword,
}: {
  searchKeyword: string;
  setSearchKeyword: (keyword: string) => void;
}) => {
  const router = useRouter();
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-row gap-2 w-full h-full items-center justify-start pr-6">
        <div className="z-10">
          <BackButton onClick={() => router.back()} />
        </div>
        <SearchBar
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
        />
      </div>
    </div>
  );
};

const SearchBar = ({
  searchKeyword,
  setSearchKeyword,
}: {
  searchKeyword: string;
  setSearchKeyword: (keyword: string) => void;
}) => {
  const [isFocused, setIsFocused] = useState(true);
  const [keyboardInput, setKeyboardInput] = useState(() => searchKeyword);
  const [debouncedSearchKeyword] = useDebounce(keyboardInput, 500);
  const { autoCompleteData } = useFetchAutoCompleteData(debouncedSearchKeyword);
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="relative flex flex-col justify-center w-full h-full">
      <div className="flex items-center ">
        <input
          ref={inputRef}
          className="w-full text-lg outline-none z-10"
          type="text"
          placeholder="검색어를 입력해주세요."
          value={keyboardInput}
          onChange={(e) => setKeyboardInput(e.target.value)}
          autoFocus={true}
          enterKeyHint="search"
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => {
            setTimeout(() => setIsFocused(false), 200);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setSearchKeyword(keyboardInput);
              inputRef.current?.blur();
            }
          }}
        />
        {keyboardInput.length > 0 && (
          <motion.button
            className="p-[8] z-20"
            whileTap={{ scale: 0.8 }}
            onClick={() => {
              setSearchKeyword("");
              setKeyboardInput("");
            }}
          >
            <IoMdCloseCircle size={24} className="text-gray-500" />
          </motion.button>
        )}
      </div>
      <div className="fixed top-0 left-0 right-0">
        <HeaderSpacing />
        {isFocused && (
          <div className="flex flex-col bg-white w-full h-screen">
            {autoCompleteData.autocompletes.length == 0 ||
            keyboardInput.length == 0 ? (
              <AutoCompleteKeywordItem text="검색결과 없음" keyword="" />
            ) : (
              <>
                {autoCompleteData.autocompletes.map((keyword) => (
                  <AutoCompleteKeywordItem
                    key={keyword.autocomplete}
                    // text={keyword.autocomplete}
                    text={keyword.autocomplete}
                    keyword={keyboardInput}
                    onClick={() => {
                      setSearchKeyword(keyword.autocomplete);
                      setKeyboardInput(keyword.autocomplete);
                    }}
                  />
                ))}
              </>
            )}
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
      className="flex flex-row gap-2 items-center py-2 px-4"
      onClick={() => {
        onClick?.();
      }}
      whileTap={{ backgroundColor: onClick ? "#e5e7eb" : "transparent" }}
      transition={{ duration: 0.4 }}
    >
      <FaMagnifyingGlass
        size={16}
        className={`text-lg shrink-0  ${
          onClick ? "text-black" : "text-gray-500"
        }`}
      />
      <span
        className={`text-md flex-1 truncate ${
          onClick ? "text-black" : "text-gray-500"
        }`}
      >
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
  const keywordLoc = text.search(keyword);
  if (keywordLoc === -1) {
    return <span>{text}</span>;
  }
  const leadingText = text.substring(0, keywordLoc);
  const trailingText = text.substring(keywordLoc + keyword.length);

  return (
    <>
      {leadingText}
      <span className="text-orange-500">{keyword}</span>
      {trailingText}
    </>
  );
};

export default SearchRecipePage;
