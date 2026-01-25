import Link from "next/link";
import { IoChevronForwardOutline } from "react-icons/io5";
import { useHomeTranslation } from "../hooks/useHomeTranslation";

/**
 * Desktop Horizontal Scroll Area (Grid Layout)
 * 
 * Features:
 * - Grid layout (4-6 columns)
 * - No horizontal scroll
 * - Hover effects on cards
 * - "View More" as a styled grid card
 */
export function HorizontalScrollAreaDesktop({
  children,
  moreLink,
  gap = "gap-6",
  aspectRatio = "aspect-video",
}: {
  children: React.ReactNode;
  moreLink?: string;
  gap?: string;
  aspectRatio?: string;
}) {
  const { t } = useHomeTranslation();

  return (
    <div className="w-full">
      <div className={`grid grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 ${gap} w-full`}>
        {children}

        {/* View More Card */}
        {moreLink && (
          <Link href={moreLink} className="contents">
            <div className={`flex items-center justify-center w-full ${aspectRatio} rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 hover:border-gray-300 hover:bg-gray-100 hover:scale-[1.02] hover:shadow-md transition-all duration-300 group cursor-pointer`}>
              <div className="flex flex-col items-center gap-3 text-gray-400 group-hover:text-gray-600 transition-colors">
                <div className="w-12 h-12 xl:w-14 xl:h-14 rounded-full bg-white group-hover:bg-white flex items-center justify-center transition-colors shadow-sm group-hover:shadow">
                  <IoChevronForwardOutline className="size-6 xl:size-7" />
                </div>
                <span className="text-base font-medium whitespace-nowrap">
                  {t("viewMore")}
                </span>
              </div>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
