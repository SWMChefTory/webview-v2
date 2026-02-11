import { useSettingsTranslation } from "../hooks/useSettingsTranslation";
import { GoChevronRight } from "react-icons/go";

/**
 * 버전 정보 섹션 컴포넌트
 * 클릭 시 버전 정보 상세 페이지로 이동
 * 약관/동의항목 섹션과 동일한 스타일 적용
 */
export function VersionInfoSection({ isTablet = false, onClick }: { isTablet?: boolean; onClick?: () => void }) {
  const { t } = useSettingsTranslation();

  if (isTablet) {
    // 태블릿 스타일 - 약관/동의항목 섹션과 동일
    return (
      <div className="flex flex-col gap-4">
        <div className="text-gray-500 text-lg font-medium pb-2 px-2">
          {t("section.info.title")}
        </div>
        <div className="flex flex-col gap-2">
          <div
            className="flex flex-row justify-between items-center py-5 px-4 rounded-xl cursor-pointer bg-white border border-gray-100 hover:bg-gray-50 active:bg-gray-100 transition-all active:scale-[0.99]"
            onClick={onClick}
            role="button"
            tabIndex={0}
            aria-label={t("section.info.version_info")}
          >
            <div className="text-xl font-medium text-gray-900">
              {t("section.info.version_info")}
            </div>
            <GoChevronRight className="size-6 text-gray-400" />
          </div>
        </div>
      </div>
    );
  }

  // 모바일 스타일 - 앱의 약관/동의항목 섹션과 동일
  return (
    <div className="flex flex-col gap-1 px-2">
      <div className="text-gray-500 pb-2">{t("section.info.title")}</div>
      <div className="flex flex-col gap-2 px-2">
        <div
          className="flex flex-row justify-between items-center"
          onClick={onClick}
          role="button"
          tabIndex={0}
          aria-label={t("section.info.version_info")}
        >
          <div className="text-lg">{t("section.info.version_info")}</div>
          <GoChevronRight className="size-4 text-gray-500" />
        </div>
      </div>
    </div>
  );
}
