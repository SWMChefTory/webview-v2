import Header, { BackButton } from "@/src/shared/ui/header/header";
import { GoChevronRight } from "react-icons/go";
import {
  useSettingsPageController,
  SettingsPageProps,
} from "./SettingsPage.controller";

export function SettingsPageTablet() {
  const props = useSettingsPageController("tablet");
  return <SettingsPageTabletLayout {...props} />;
}

export function SettingsPageTabletLayout({
  onBack,
  t,
  userSection,
  balanceSection,
  versionSection,
  navigation,
  actionButtons,
}: SettingsPageProps) {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header leftContent={<BackButton onClick={onBack} />} color="bg-white" />

      <div className="w-full max-w-[800px] mx-auto px-8 flex flex-col justify-center py-12">
        {userSection}

        <div className="h-10" />

        {balanceSection}

        <div className="h-12" />

        <div className="flex flex-col gap-4">
          <div className="text-gray-500 text-lg font-medium pb-2 px-2">
            {t("section.terms.title")}
          </div>
          <div className="flex flex-col gap-2">
            <div
              className="flex flex-row justify-between items-center py-5 px-4 rounded-xl cursor-pointer bg-white border border-gray-100 hover:bg-gray-50 active:bg-gray-100 transition-all active:scale-[0.99]"
              onClick={navigation.goToPrivacyPolicy}
              role="button"
              tabIndex={0}
            >
              <div className="text-xl font-medium text-gray-900">{t("section.terms.privacy_policy")}</div>
              <GoChevronRight className="size-6 text-gray-400" />
            </div>
            <div
              className="flex flex-row justify-between items-center py-5 px-4 rounded-xl cursor-pointer bg-white border border-gray-100 hover:bg-gray-50 active:bg-gray-100 transition-all active:scale-[0.99]"
              onClick={navigation.goToTerms}
              role="button"
              tabIndex={0}
            >
              <div className="text-xl font-medium text-gray-900">{t("section.terms.service_terms")}</div>
              <GoChevronRight className="size-6 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="h-12" />

        <div className="flex flex-col gap-4">
          <div className="text-gray-500 text-lg font-medium pb-2 px-2">
            {t("section.onboarding.title")}
          </div>
          <div
            className="flex flex-row justify-between items-center py-5 px-4 rounded-xl cursor-pointer bg-white border border-gray-100 hover:bg-gray-50 active:bg-gray-100 transition-all active:scale-[0.99]"
            onClick={navigation.resetOnboarding}
            role="button"
            tabIndex={0}
          >
            <div className="text-xl font-medium text-gray-900">{t("section.onboarding.reset")}</div>
            <GoChevronRight className="size-6 text-gray-400" />
          </div>
        </div>

        <div className="h-12" />

        {/* 정보 섹션 */}
        {versionSection}

        <div className="h-16" />

        <div className="flex flex-row items-center justify-center gap-4">
          <div className="scale-110">{actionButtons.contact}</div>
          <div className="w-px h-5 bg-gray-300" />
          <div className="scale-110">{actionButtons.logout}</div>
          <div className="scale-110">{actionButtons.withdrawal}</div>
        </div>
      </div>
    </div>
  );
}
