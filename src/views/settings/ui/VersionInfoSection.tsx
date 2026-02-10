import { useSettingsTranslation } from "../hooks/useSettingsTranslation";
import { useNativeVersion } from "../hooks/useNativeVersion";
import { GoChevronRight } from "react-icons/go";

// next.config.ts에서 package.json의 버전을 환경변수로 주입받음
// 버전 업데이트 시 package.json만 수정하면 자동으로 반영됨
const WEB_VERSION = process.env.NEXT_PUBLIC_WEB_VERSION || "unknown";

/**
 * 버전 정보 섹션 컴포넌트
 * App(Native) 버전과 Web(Content) 버전을 표시합니다.
 * 이 섹션은 정보 표시용이며 클릭 불가능합니다.
 */
export function VersionInfoSection({ isTablet = false, onClick }: { isTablet?: boolean; onClick?: () => void }) {
  const { t } = useSettingsTranslation();
  const { nativeVersion } = useNativeVersion();

  // 네이티브 환경이 아닌 경우 서비스 버전만 표시
  const versionText = nativeVersion
    ? `App v${nativeVersion} / Web v${WEB_VERSION}`
    : `Web v${WEB_VERSION}`;

  if (isTablet) {
    // 태블릿/데스크톱 스타일 - 약관/온보딩 섹션과 동일한 스타일 적용
    return (
      <div className="flex flex-col gap-4">
        <div className="text-gray-500 text-lg font-medium pb-2 px-2">
          {t("section.info.title")}
        </div>
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
    );
  }

  // 모바일 스타일 - 온보딩 섹션과 동일한 스타일 적용
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
