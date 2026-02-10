import { useSettingsTranslation } from "../hooks/useSettingsTranslation";
import { useNativeVersion } from "../hooks/useNativeVersion";
import Header, { BackButton } from "@/src/shared/ui/header/header";

// next.config.ts에서 package.json의 버전을 환경변수로 주입받음
const SERVICE_VERSION = process.env.NEXT_PUBLIC_WEB_VERSION || "unknown";

/**
 * 버전 정보 전용 페이지
 * 네이티브 앱에서는 앱 버전과 서비스 버전을 모두 표시
 * 웹 브라우저에서는 서비스 버전만 표시
 */
export function VersionInfoPage() {
  const { t } = useSettingsTranslation();
  const { nativeVersion } = useNativeVersion();

  return (
    <div>
      <Header leftContent={<BackButton />} />
      
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {t("version_info.title")}
        </h1>

        <div className="flex flex-col gap-3">
          {/* 앱 버전 - 네이티브 앱에서만 표시 */}
          {nativeVersion && (
            <div className="flex flex-row justify-between items-center py-4 px-4 rounded-xl bg-gray-50/50">
              <div className="text-lg text-gray-700">
                {t("version_info.app_version")}
              </div>
              <div className="text-lg text-gray-900 font-medium">
                v{nativeVersion}
              </div>
            </div>
          )}

          {/* 서비스 버전 - 항상 표시 */}
          <div className="flex flex-row justify-between items-center py-4 px-4 rounded-xl bg-gray-50/50">
            <div className="text-lg text-gray-700">
              {t("version_info.service_version")}
            </div>
            <div className="text-lg text-gray-900 font-medium">
              v{SERVICE_VERSION}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
