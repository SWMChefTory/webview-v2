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
 * Settings 페이지 - 모바일 버전 (0 ~ 767px)
 *
 * 특징:
 * - 전체 화면 너비 사용
 * - 모바일 최적화 간격 및 패딩
 * - 컴팩트한 프로필 영역 (80x80)
 */
export function SettingsPageMobile() {
  const router = useRouter();
  const { t } = useSettingsTranslation();

  useSafeArea({
    top: { color: "#FFFFFF", isExists: true },
    bottom: { color: "#FFFFFF", isExists: true },
    left: { color: "#FFFFFF", isExists: true },
    right: { color: "#FFFFFF", isExists: false },
  });

  return (
    <div>
      <Header
        leftContent={
          <BackButton
            onClick={() => {
              router.push("/");
            }}
          />
        }
      />
      <div className="px-4 flex flex-col justify-center">
        {/* 프로필 섹션 */}
        <SSRSuspense fallback={<UserSectionSkeleton />}>
          <UserSectionReady />
        </SSRSuspense>

        <div className="h-[16]" />

        {/* 잔액 섹션 */}
        <BalanceSection />

        <div className="h-[24]" />

        {/* 약관 섹션 */}
        <div className="flex flex-col gap-1 px-2">
          <div className="text-gray-500 pb-2">{t("section.terms.title")}</div>
          <div className="flex flex-col gap-2 px-2">
            <div
              className="flex flex-row justify-between items-center"
              onClick={() => router.push("/user/settings/privacy-policy")}
            >
              <div className="text-lg">
                {t("section.terms.privacy_policy")}
              </div>
              <GoChevronRight className="size-4 text-gray-500" />
            </div>
            <div
              className="flex flex-row justify-between items-center"
              onClick={() => router.push("/user/settings/terms-and-conditions")}
            >
              <div className="text-lg">
                {t("section.terms.service_terms")}
              </div>
              <GoChevronRight className="size-4 text-gray-500" />
            </div>
          </div>
        </div>

        <div className="h-[32]" />

        {/* 버튼 섹션 */}
        <div className="flex flex-row gap-6 items-center justify-center">
          <LogoutButton />
          <WithdrawalButton />
        </div>
      </div>
    </div>
  );
}
