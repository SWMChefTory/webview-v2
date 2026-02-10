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
  ContactButton,
} from "./SettingsPage.common";
import { useOnboardingStore } from "@/src/views/onboarding/stores/useOnboardingStore";
import { VersionInfoSection } from "./VersionInfoSection";

export interface SettingsPageProps {
  onBack: () => void;
  t: (key: string) => string;
  userSection: React.ReactNode;
  balanceSection: React.ReactNode;
  versionSection: React.ReactNode;
  navigation: {
    goToPrivacyPolicy: () => void;
    goToTerms: () => void;
    resetOnboarding: () => void;
  };
  actionButtons: {
    logout: React.ReactNode;
    withdrawal: React.ReactNode;
    contact: React.ReactNode;
  };
}

export function useSettingsPageController(
  variant: "mobile" | "tablet" | "desktop"
): SettingsPageProps {
  const router = useRouter();
  const { t } = useSettingsTranslation();
  const resetOnboarding = useOnboardingStore((state) => state.resetOnboarding);

  useSafeArea({
    top: { color: "#FFFFFF", isExists: true },
    bottom: { color: "#FFFFFF", isExists: true },
    left: { color: "#FFFFFF", isExists: true },
    right: { color: "#FFFFFF", isExists: false },
  });

  const isTablet = variant !== "mobile";

  const handleResetOnboarding = () => {
    resetOnboarding();
    router.push('/onboarding');
  };

  return {
    onBack: () => router.push("/"),
    t,
    userSection: (
      <SSRSuspense fallback={<UserSectionSkeleton isTablet={isTablet} />}>
        <UserSectionReady isTablet={isTablet} />
      </SSRSuspense>
    ),
    balanceSection: <BalanceSection isTablet={isTablet} />,
    versionSection: <VersionInfoSection isTablet={isTablet} />,
    navigation: {
      goToPrivacyPolicy: () => router.push("/user/settings/privacy-policy"),
      goToTerms: () => router.push("/user/settings/terms-and-conditions"),
      resetOnboarding: handleResetOnboarding,
    },
    actionButtons: {
      logout: <LogoutButton isTablet={isTablet} />,
      withdrawal: <WithdrawalButton isTablet={isTablet} />,
      contact: <ContactButton isTablet={isTablet} />,
    },
  };
}
