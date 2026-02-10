import Header, { BackButton } from "@/src/shared/ui/header/header";
import { GoChevronRight } from "react-icons/go";
import {
  useSettingsPageController,
  SettingsPageProps,
} from "./SettingsPage.controller";
import { ContactButton } from "./SettingsPage.common";

export function SettingsPageDesktop() {
  const props = useSettingsPageController("desktop");
  return <SettingsPageDesktopLayout {...props} />;
}

export function SettingsPageDesktopLayout({
  onBack,
  t,
  userSection,
  balanceSection,
  navigation,
  actionButtons,
}: SettingsPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header leftContent={<BackButton onClick={onBack} />} color="bg-white" />

      <div className="w-full max-w-[900px] mx-auto px-8 py-12">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-10">
          <div className="flex flex-col items-center">
            {userSection}
          </div>

          <div className="h-10" />

          {balanceSection}

          <div className="h-14" />

          <div className="flex flex-col gap-4">
            <div className="text-gray-900 text-lg font-bold pb-2 pl-2">
              {t("section.terms.title")}
            </div>
            <div className="flex flex-col gap-2">
              <div
                className="flex flex-row justify-between items-center py-5 px-6 rounded-2xl bg-gray-50 hover:bg-gray-100 cursor-pointer active:scale-[0.99] transition-all duration-200 group"
                onClick={navigation.goToPrivacyPolicy}
              >
                <div className="text-xl font-medium text-gray-700 group-hover:text-gray-900 transition-colors">{t("section.terms.privacy_policy")}</div>
                <GoChevronRight className="size-6 text-gray-400 group-hover:text-gray-600 transition-colors group-hover:translate-x-1 duration-200" />
              </div>
              <div
                className="flex flex-row justify-between items-center py-5 px-6 rounded-2xl bg-gray-50 hover:bg-gray-100 cursor-pointer active:scale-[0.99] transition-all duration-200 group"
                onClick={navigation.goToTerms}
              >
                <div className="text-xl font-medium text-gray-700 group-hover:text-gray-900 transition-colors">{t("section.terms.service_terms")}</div>
                <GoChevronRight className="size-6 text-gray-400 group-hover:text-gray-600 transition-colors group-hover:translate-x-1 duration-200" />
              </div>
            </div>
          </div>

          <div className="h-14" />

          <div className="flex flex-col gap-4">
            <div className="text-gray-900 text-lg font-bold pb-2 pl-2">
              {t("section.onboarding.title")}
            </div>
            <div
              className="flex flex-row justify-between items-center py-5 px-6 rounded-2xl bg-gray-50 hover:bg-gray-100 cursor-pointer active:scale-[0.99] transition-all duration-200 group"
              onClick={navigation.resetOnboarding}
            >
              <div className="text-xl font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                {t("section.onboarding.reset")}
              </div>
              <GoChevronRight className="size-6 text-gray-400 group-hover:text-gray-600 transition-colors group-hover:translate-x-1 duration-200" />
            </div>
          </div>

          <div className="h-16" />

          <div className="flex flex-row gap-10 items-center justify-center">
            {actionButtons.logout}
            {actionButtons.withdrawal}
          </div>

          <div className="h-8" />

          <div className="flex flex-row items-center justify-center">
            <ContactButton isTablet={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
