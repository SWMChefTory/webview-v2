import Link from "next/link";
import { IoChevronForwardOutline } from "react-icons/io5";
import { useHomeTranslation } from "../hooks/useHomeTranslation";

/**
 * Tablet Horizontal Scroll Area
 *
 * Features:
 * - Horizontal scroll for card navigation
 * - Right fade gradient for scroll hint
 * - "View More" link at the end (if moreLink provided)
 * - Tablet padding (px-6)
 */
export function HorizontalScrollAreaTablet({
  children,
  moreLink,
  gap = "gap-6",
}: {
  children: React.ReactNode;
  moreLink?: string;
  gap?: string;
}) {
  const { t } = useHomeTranslation();

  return (
    <div className="relative group/scroll">
      {/* Scroll Area */}
      <div className="w-full overflow-x-auto scrollbar-hide no-scrollbar">
        <div className={`flex flex-row ${gap} pl-6 pr-6 min-w-max pb-4`}>
          {children}

          {/* View More Button */}
          {moreLink && (
            <Link href={moreLink} className="contents">
              <div className="flex items-center justify-center h-full min-w-[160px] px-4 transition-all duration-300 group active:scale-[0.98]">
                <div className="flex flex-col items-center gap-3 text-gray-400 group-hover:text-primary transition-colors">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 group-hover:bg-primary/5 flex items-center justify-center transition-colors shadow-sm border border-gray-100 group-hover:border-primary/20">
                    <IoChevronForwardOutline className="size-6" />
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

      {/* Right Fade Gradient (Scroll Hint) */}
      <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none opacity-0 group-hover/scroll:opacity-100 transition-opacity duration-300" />
    </div>
  );
}
