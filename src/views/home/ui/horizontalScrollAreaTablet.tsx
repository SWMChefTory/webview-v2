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
      <div className="w-full overflow-x-auto scrollbar-hide no-scrollbar">
        <div className={`flex flex-row ${gap} pl-6 pr-6 lg:pl-8 lg:pr-8 xl:pl-10 xl:pr-10 min-w-max`}>
          {children}

          {/* 더보기 버튼 */}
          {moreLink && (
            <Link href={moreLink}>
              <div className="flex items-center justify-center h-full min-w-[120px] lg:min-w-[140px] px-4 lg:px-6">
                <div className="flex flex-col items-center gap-2 lg:gap-3 text-gray-500 hover:text-gray-700 transition-colors">
                  <div className="w-12 h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                    <IoChevronForwardOutline className="size-6 lg:size-7 xl:size-8" />
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

      {/* 오른쪽 페이드 그라데이션 (스크롤 힌트) */}
      <div className="absolute top-0 right-0 w-12 h-full bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none" />
    </div>
  );
}
