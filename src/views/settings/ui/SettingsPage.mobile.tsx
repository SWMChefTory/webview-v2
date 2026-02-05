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
            >
              <div className="text-lg">{t("section.terms.privacy_policy")}</div>
              <GoChevronRight className="size-4 text-gray-500" />
            </div>
            <div
              className="flex flex-row justify-between items-center"
              onClick={navigation.goToTerms}
            >
              <div className="text-lg">{t("section.terms.service_terms")}</div>
              <GoChevronRight className="size-4 text-gray-500" />
            </div>
          </div>
        </div>

        <div className="h-[16px]" />

        {/* 온보딩 다시보기 */}
        <div className="flex flex-row justify-between items-center px-4 py-3 rounded-xl bg-orange-50 cursor-pointer active:bg-orange-100 transition-colors"
             onClick={navigation.resetOnboarding}>
          <div className="flex items-center gap-2">
            <span className="text-xl">🔄</span>
            <div className="text-lg text-orange-600 font-medium">{t("section.onboarding.reset")}</div>
          </div>
          <GoChevronRight className="size-4 text-orange-400" />
        </div>

        <div className="h-[32px]" />

        <div className="flex flex-row gap-6 items-center justify-center">
          {actionButtons.logout}
          {actionButtons.withdrawal}
        </div>
      </div>
    </div>
  );
}
