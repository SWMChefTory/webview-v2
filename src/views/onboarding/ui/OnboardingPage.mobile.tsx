import { OnboardingStep1 } from "./steps/OnboardingStep1";
import { OnboardingStep2 } from "./steps/OnboardingStep2";
import { OnboardingStep3 } from "./steps/OnboardingStep3";
import { useOnboardingStore } from "../stores/useOnboardingStore";
import { useOnboardingNavigation } from "../hooks/useOnboardingNavigation";
import { useEffect } from "react";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";

export function OnboardingPageMobile() {
  const { isOnboardingCompleted, currentStep } = useOnboardingStore();
  const { goToStep } = useOnboardingNavigation();
  
  useEffect(() => {
    track(AMPLITUDE_EVENT.ONBOARDING_START);
  }, []);
  
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <OnboardingStep1 />;
      case 2:
        return <OnboardingStep2 />;
      case 3:
        return <OnboardingStep3 />;
      default:
        return <OnboardingStep1 />;
    }
  };
  
  return (
    <div className="min-h-screen bg-white">
      {renderStep()}
    </div>
  );
}

export function OnboardingPageTablet() {
  return <OnboardingPageMobile />;
}

export function OnboardingPageDesktop() {
  return <OnboardingPageMobile />;
}
