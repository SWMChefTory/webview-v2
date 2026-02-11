import { useSettingsTranslation } from "../hooks/useSettingsTranslation";
import { useNativeVersion } from "../hooks/useNativeVersion";
import Header, { BackButton } from "@/src/shared/ui/header/header";

// next.config.ts에서 package.json의 버전을 환경변수로 주입받음
const SERVICE_VERSION = process.env.NEXT_PUBLIC_WEB_VERSION || "unknown";

/**
 * 버전 정보 전용 페이지
 * 네이티브 앱에서는 앱 버전과 서비스 버전을 모두 표시
 * 웹 브라우저에서는 서비스 버전만 표시
 * 
 * Design: Modern card-based layout with gradient accents
 */
export function VersionInfoPage() {
  const { t } = useSettingsTranslation();
  const { nativeVersion } = useNativeVersion();

  // 네이티브 버전 로딩 중 여부
  const isLoadingNativeVersion = nativeVersion === undefined;

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      {/* 헤더 - 앱 스타일과 동일 */}
      <Header
        leftContent={<BackButton onClick={() => window.history.back()} />}
      />

      {/* 컨텐츠 영역 */}
      <div className="flex-1 px-4 pt-4 pb-8">
        {/* 페이지 제목 - 생략 (약관 정책 페이지와 다르게 헤더에 있음) */}
        
        {/* 버전 정보 컨텐츠 */}
        <div className="flex flex-col gap-4">
          {/* 앱 버전 - 네이티브 앱에서만 표시 */}
          {nativeVersion && (
            <div className="flex flex-col gap-1">
              <div className="text-sm text-gray-500 font-medium">
                {t("section.version_info.app_version")}
              </div>
              <div className="text-base text-gray-900 font-medium">
                v{nativeVersion}
              </div>
            </div>
          )}

          {/* 로딩 상태 - 네이티브 버전 로딩 중 */}
          {isLoadingNativeVersion && (
            <div className="flex flex-col gap-1">
              <div className="text-sm text-gray-500 font-medium">
                {t("section.version_info.app_version")}
              </div>
              <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
          )}

          {/* 구분선 - 버전 사이 */}
          {(nativeVersion || isLoadingNativeVersion) && (
            <div className="h-px bg-gray-200 my-2" />
          )}

          {/* 서비스 버전 - 항상 표시 */}
          <div className="flex flex-col gap-1">
            <div className="text-sm text-gray-500 font-medium">
              {t("section.version_info.service_version")}
            </div>
            <div className="text-base text-gray-900 font-medium">
              v{SERVICE_VERSION}
            </div>
          </div>
        </div>

        {/* 추가 정보 */}
        <div className="mt-auto pt-8 text-center text-xs text-gray-400">
          {new Date().getFullYear()} Cheftory. All rights reserved.
        </div>
      </div>
    </div>
  );
}
