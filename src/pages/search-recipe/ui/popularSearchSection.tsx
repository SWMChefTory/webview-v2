import { useEffect, useRef, useState } from "react";
import { useInitialAutoCompleteData } from "../entities/auto-complete/model/model";

export const PopularSearchSection = ({
  onSearchSelect,
}: {
  onSearchSelect?: (keyword: string) => void;
}) => {
  const { autoCompleteData } = useInitialAutoCompleteData();
  const [isExpanded, setIsExpanded] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !isExpanded &&
      scrollContainerRef.current &&
      autoCompleteData.autocompletes.length > 0
    ) {
      const container = scrollContainerRef.current;
      const itemHeight = 50;
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

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-gray-900">인기 검색어</h2>
          {!isExpanded && autoCompleteData.autocompletes.length > 0 && (
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {autoCompleteData.autocompletes.length}
            </span>
          )}
        </div>
        <button
          className="flex items-center gap-1.5 text-xs font-medium text-gray-500"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span>{isExpanded ? "접기" : "펼치기"}</span>
          <div
            className={`transform ${
              isExpanded ? "rotate-180" : "rotate-0"
            }`}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              className="text-gray-400"
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

      {autoCompleteData.autocompletes.length > 0 ? (
        isExpanded ? (
          <div className="grid grid-cols-2 gap-2">
            {autoCompleteData.autocompletes.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white border border-gray-100 cursor-pointer h-[50px]"
                onClick={() => onSearchSelect?.(item.autocomplete)}
              >
                <span className="text-sm font-bold text-orange-600 shrink-0 w-5">
                  {index + 1}
                </span>
                <span className="text-sm font-medium flex-1 text-gray-900 line-clamp-1 leading-snug">
                  {item.autocomplete}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div
            ref={scrollContainerRef}
            className="relative overflow-hidden rounded-lg border border-gray-100 bg-white"
            style={{ height: "50px" }}
          >
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none"></div>

            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none"></div>

            {autoCompleteData.autocompletes.length > 1 && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20">
                <div className="flex flex-col gap-0.5">
                  {Array.from({
                    length: Math.min(3, autoCompleteData.autocompletes.length),
                  }).map((_, i) => (
                    <div
                      key={i}
                      className="w-0.5 h-0.5 bg-gray-300 rounded-full"
                    ></div>
                  ))}
                </div>
              </div>
            )}

            {autoCompleteData.autocompletes.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2.5 px-3 absolute w-full h-[50px] cursor-pointer"
                style={{ top: `${index * 50}px` }}
                onClick={() => onSearchSelect?.(item.autocomplete)}
              >
                <span className="text-sm font-bold text-orange-600 shrink-0 w-5">
                  {index + 1}
                </span>
                <span className="text-sm font-medium flex-1 text-gray-900 line-clamp-1 leading-snug">
                  {item.autocomplete}
                </span>
              </div>
            ))}
          </div>
        )
      ) : (
        <p className="text-sm text-gray-500 py-6 text-center">
          인기 검색어가 없습니다
        </p>
      )}
    </section>
  );
};

