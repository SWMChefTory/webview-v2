import { useOnboardingStore } from "../stores/useOnboardingStore";
import { useOnboardingNavigation } from "../hooks/useOnboardingNavigation";
import { useEffect } from "react";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";

export interface OnboardingPageControllerResult {
  currentStep: number;
}

export function useOnboardingPageController(): OnboardingPageControllerResult {
  const { currentStep } = useOnboardingStore();
  
  useEffect(() => {
    track(AMPLITUDE_EVENT.ONBOARDING_START);
  }, []);

  return {
    currentStep,
  };
}
