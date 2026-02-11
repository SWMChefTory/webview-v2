import Header, { BackButton } from "@/src/shared/ui/header/header";
import { GoChevronRight } from "react-icons/go";
import {
  useSettingsPageController,
  SettingsPageProps,
} from "./SettingsPage.controller";

export function SettingsPageMobile() {
  const props = useSettingsPageController("mobile");
  return <SettingsPageMobileLayout {...props} />;
}

export function SettingsPageMobileLayout({
  onBack,
  t,
  userSection,
  balanceSection,
  versionSection,
  navigation,
  actionButtons,
}: SettingsPageProps) {
  return (
    <div>
      <Header leftContent={<BackButton onClick={onBack} />} />

      <div className="px-4 flex flex-col justify-center">
        {userSection}

        <div className="h-[16px]" />

        {balanceSection}

        <div className="h-[24px]" />

        <div className="flex flex-col gap-1 px-2">
          <div className="text-gray-500 pb-2">{t("section.terms.title")}</div>
          <div className="flex flex-col gap-2 px-2">
            <div
              className="flex flex-row justify-between items-center"
              onClick={navigation.goToPrivacyPolicy}
              role="button"
              tabIndex={0}
            >
              <div className="text-lg">{t("section.terms.privacy_policy")}</div>
              <GoChevronRight className="size-4 text-gray-500" />
            </div>
            <div
              className="flex flex-row justify-between items-center"
              onClick={navigation.goToTerms}
              role="button"
              tabIndex={0}
            >
              <div className="text-lg">{t("section.terms.service_terms")}</div>
              <GoChevronRight className="size-4 text-gray-500" />
            </div>
          </div>
        </div>

        <div className="h-[16px]" />

        {/* 온보딩 섹션 */}
        <div className="flex flex-col gap-1 px-2">
          <div className="text-gray-500 pb-2">{t("section.onboarding.title")}</div>
          <div className="flex flex-col gap-2 px-2">
            <div
              className="flex flex-row justify-between items-center"
              onClick={navigation.resetOnboarding}
              role="button"
              tabIndex={0}
            >
              <div className="text-lg">{t("section.onboarding.reset")}</div>
              <GoChevronRight className="size-4 text-gray-500" />
            </div>
          </div>
        </div>

        <div className="h-[16px]" />

        {/* 정보 섹션 */}
        {versionSection}

        <div className="h-[32px]" />

        <div className="flex flex-row items-center justify-center gap-3">
          {actionButtons.contact}
          <div className="w-px h-4 bg-gray-300" />
          {actionButtons.logout}
          {actionButtons.withdrawal}
        </div>
      </div>
    </div>
  );
}
