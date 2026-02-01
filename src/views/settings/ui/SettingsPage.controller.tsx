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

export interface SettingsPageProps {
  onBack: () => void;
  t: (key: string) => string;
  userSection: React.ReactNode;
  balanceSection: React.ReactNode;
  navigation: {
    goToPrivacyPolicy: () => void;
    goToTerms: () => void;
  };
  actionButtons: {
    logout: React.ReactNode;
    withdrawal: React.ReactNode;
  };
}

export function useSettingsPageController(
  variant: "mobile" | "tablet" | "desktop"
): SettingsPageProps {
  const router = useRouter();
  const { t } = useSettingsTranslation();

  useSafeArea({
    top: { color: "#FFFFFF", isExists: true },
    bottom: { color: "#FFFFFF", isExists: true },
    left: { color: "#FFFFFF", isExists: true },
    right: { color: "#FFFFFF", isExists: false },
  });

  const isTablet = variant !== "mobile";

  return {
    onBack: () => router.push("/"),
    t,
    userSection: (
      <SSRSuspense fallback={<UserSectionSkeleton isTablet={isTablet} />}>
        <UserSectionReady isTablet={isTablet} />
      </SSRSuspense>
    ),
    balanceSection: <BalanceSection isTablet={isTablet} />,
    navigation: {
      goToPrivacyPolicy: () => router.push("/user/settings/privacy-policy"),
      goToTerms: () => router.push("/user/settings/terms-and-conditions"),
    },  
    actionButtons: {
      logout: <LogoutButton isTablet={isTablet} />,
      withdrawal: <WithdrawalButton isTablet={isTablet} />,
    },
  };
}
