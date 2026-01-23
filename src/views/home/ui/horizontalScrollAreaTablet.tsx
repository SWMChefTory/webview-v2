import Link from "next/link";
import { IoChevronForwardOutline } from "react-icons/io5";
import { useHomeTranslation } from "../hooks/useHomeTranslation";

/**
 * 태블릿용 가로 스크롤 영역
 *
 * 특징:
 * - 가로 스크롤로 카드 탐색
 * - 오른쪽 페이드 그라데이션으로 스크롤 힌트
 * - 스크롤 끝에 "더보기" 링크 표시 (moreLink 제공 시)
 * - 태블릿 패딩 (px-6) 적용
 *
 * @param children - 스크롤 영역에 표시할 카드들
 * @param moreLink - 더보기 링크 URL (없으면 더보기 버튼 미표시)
 * @param gap - 카드 간 간격 (기본값: gap-4)
 */
export function HorizontalScrollAreaTablet({
  children,
  moreLink,
  gap = "gap-4",
}: {
  children: React.ReactNode;
  moreLink?: string;
  gap?: string;
}) {
  const { t } = useHomeTranslation();

  return (
    <div className="relative">
      {/* 스크롤 영역 */}
      <div className="w-full overflow-x-auto scrollbar-hide no-scrollbar lg:overflow-visible">
        <div className={`flex flex-row ${gap} pl-6 pr-6 lg:pl-8 lg:pr-8 xl:pl-10 xl:pr-10 min-w-max lg:min-w-0 lg:grid lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 lg:gap-6 lg:w-full`}>
          {children}

          {/* 더보기 버튼 */}
          {moreLink && (
            <Link href={moreLink} className="contents">
              <div className="flex items-center justify-center h-full min-w-[120px] lg:min-w-0 lg:w-full lg:aspect-video lg:rounded-xl lg:bg-gray-50 lg:border-2 lg:border-dashed lg:border-gray-200 lg:hover:border-gray-300 lg:hover:bg-gray-100 px-4 lg:px-0 transition-all duration-200 group">
                <div className="flex flex-col items-center gap-2 lg:gap-3 text-gray-500 group-hover:text-gray-700 transition-colors">
                  <div className="w-12 h-12 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-full bg-gray-100 lg:bg-white group-hover:bg-gray-200 lg:group-hover:bg-white flex items-center justify-center transition-colors shadow-sm">
                    <IoChevronForwardOutline className="size-6 lg:size-6 xl:size-7" />
                  </div>
                  <span className="text-sm lg:text-base font-medium whitespace-nowrap">
                    {t("viewMore")}
                  </span>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* 오른쪽 페이드 그라데이션 (스크롤 힌트) - 데스크톱에서는 숨김 */}
      <div className="absolute top-0 right-0 w-12 h-full bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none lg:hidden" />
    </div>
  );
}
