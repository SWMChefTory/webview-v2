import { OnboardingPageMobile, OnboardingPageTablet, OnboardingPageDesktop } from "./ui";
import { useOnboardingStore } from "./stores/useOnboardingStore";
import { useEffect } from "react";

export default function OnboardingPage() {
  const { isOnboardingCompleted } = useOnboardingStore();
  
  useEffect(() => {
    if (isOnboardingCompleted) {
      window.location.href = '/';
    }
  }, [isOnboardingCompleted]);
  
  return <OnboardingPageMobile />;
}
