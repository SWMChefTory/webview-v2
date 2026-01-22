import Header, { BackButton } from "@/src/shared/ui/header/header";
import { GoChevronRight } from "react-icons/go";
import { useRouter } from "next/router";
import { useSafeArea } from "@/src/shared/safearea/useSafaArea";
import { useSettingsTranslation } from "../hooks/useSettingsTranslation";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import {
  UserSectionReady,
  UserSectionSkeleton,
  BalanceSection,
  LogoutButton,
  WithdrawalButton,
} from "./SettingsPage.common";

/**
 * Settings 페이지 - 태블릿 버전 (768px ~)
 *
 * 특징:
 * - 최대 너비 500px로 제한하고 중앙 정렬
 * - 프로필 영역 확대 (100x100)
 * - 폰트 크기 및 터치 영역 확대
 * - 더 넓은 간격
 */
export function SettingsPageTablet() {
  const router = useRouter();
  const { t } = useSettingsTranslation();

  useSafeArea({
    top: { color: "#FFFFFF", isExists: true },
    bottom: { color: "#FFFFFF", isExists: true },
    left: { color: "#FFFFFF", isExists: true },
    right: { color: "#FFFFFF", isExists: false },
  });

  return (
    <div className="min-h-screen">
      <Header
        leftContent={
          <BackButton
            onClick={() => {
              router.push("/");
            }}
          />
        }
        color="bg-white"
      />

      {/* 메인 컨텐츠 - 최대 너비 제한 & 중앙 정렬 */}
      <div className="w-full max-w-[600px] lg:max-w-[700px] xl:max-w-[800px] mx-auto px-6 lg:px-8 flex flex-col justify-center">
        {/* 프로필 섹션 - 확대된 크기 */}
        <SSRSuspense fallback={<UserSectionSkeleton isTablet />}>
          <UserSectionReady isTablet />
        </SSRSuspense>

        <div className="h-[20px]" />

        {/* 잔액 섹션 */}
        <BalanceSection isTablet />

        <div className="h-[32px]" />

        {/* 약관 섹션 - 터치 영역 확대 */}
        <div className="flex flex-col gap-2">
          <div className="text-gray-500 text-base pb-2">
            {t("section.terms.title")}
          </div>
          <div className="flex flex-col">
            {/* 개인정보처리방침 - 전체 row 클릭 가능 */}
            <div
              className="flex flex-row justify-between items-center py-3 px-2 rounded-lg cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors"
              onClick={() => router.push("/user/settings/privacy-policy")}
            >
              <div className="text-xl">{t("section.terms.privacy_policy")}</div>
              <GoChevronRight className="size-5 text-gray-500" />
            </div>

            {/* 서비스 이용약관 - 전체 row 클릭 가능 */}
            <div
              className="flex flex-row justify-between items-center py-3 px-2 rounded-lg cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors"
              onClick={() => router.push("/user/settings/terms-and-conditions")}
            >
              <div className="text-xl">{t("section.terms.service_terms")}</div>
              <GoChevronRight className="size-5 text-gray-500" />
            </div>
          </div>
        </div>

        <div className="h-[40px]" />

        {/* 버튼 섹션 - 터치 영역 확대 */}
        <div className="flex flex-row gap-8 items-center justify-center">
          <LogoutButton isTablet />
          <WithdrawalButton isTablet />
        </div>

        {/* 하단 여백 */}
        <div className="h-[40px]" />
      </div>
    </div>
  );
}
