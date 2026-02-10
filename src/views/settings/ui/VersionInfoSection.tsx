import { useSettingsTranslation } from "../hooks/useSettingsTranslation";
import { useNativeVersion } from "../hooks/useNativeVersion";

// next.config.ts에서 package.json의 버전을 환경변수로 주입받음
// 버전 업데이트 시 package.json만 수정하면 자동으로 반영됨
const WEB_VERSION = process.env.NEXT_PUBLIC_WEB_VERSION || "unknown";

/**
 * 버전 정보 섹션 컴포넌트
 * App(Native) 버전과 Web(Content) 버전을 표시합니다.
 * 이 섹션은 정보 표시용이며 클릭 불가능합니다.
 */
export function VersionInfoSection({ isTablet = false }: { isTablet?: boolean }) {
  const { t } = useSettingsTranslation();
  const { nativeVersion } = useNativeVersion();

  // 네이티브 환경이 아닌 경우 웹 버전만 표시
  const versionText = nativeVersion
    ? `App v${nativeVersion} / Web v${WEB_VERSION}`
    : `Web v${WEB_VERSION}`;

  // 웹 전용 모드 여부 (네이티브 버전이 없는 경우)
  const isWebOnly = !nativeVersion;

  if (isTablet) {
    // 태블릿/데스크톱 스타일 - 명시적으로 비대화형으로 디자인
    return (
      <div className="flex flex-col gap-4">
        <div className="text-gray-500 text-lg font-medium pb-2 px-2">
          {t("section.info.title")}
        </div>
        <div
          className="flex flex-row justify-between items-center py-5 px-4 rounded-xl bg-gray-50/50 border-0 select-none"
          role="status"
          aria-label={`버전 정보: ${versionText}`}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl font-medium text-gray-700">
              {t("section.info.version_info")}
            </span>
            {isWebOnly && (
              <span 
                className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-700"
                aria-label="웹 브라우저 전용 모드"
              >
                Web Only
              </span>
            )}
          </div>
          <div className="text-gray-400 text-base">{versionText}</div>
        </div>
      </div>
    );
  }

  // 모바일 스타일 - 명시적으로 비대화형으로 디자인
  return (
    <div className="flex flex-col gap-1 px-2">
      <div className="text-gray-500 pb-2">{t("section.info.title")}</div>
      <div 
        className="flex flex-col gap-2 px-2 py-3 rounded-lg bg-gray-50/30 select-none"
        role="status"
        aria-label={`버전 정보: ${versionText}`}
      >
        <div className="flex flex-row justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-lg text-gray-700">
              {t("section.info.version_info")}
            </span>
            {isWebOnly && (
              <span 
                className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700"
                aria-label="웹 브라우저 전용 모드"
              >
                Web Only
              </span>
            )}
          </div>
          <div className="text-gray-400 text-sm">{versionText}</div>
        </div>
      </div>
    </div>
  );
}
