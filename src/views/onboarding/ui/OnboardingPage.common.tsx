import { useOnboardingStore } from "../stores/useOnboardingStore";
import { useOnboardingNavigation } from "../hooks/useOnboardingNavigation";

export interface OnboardingPageController {
  currentStep: number;
  isLastStep: boolean;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: 1 | 2 | 3) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

export function useOnboardingPageController(): OnboardingPageController {
  const { isOnboardingCompleted, completeOnboarding, resetOnboarding } = useOnboardingStore();
  const { currentStep, isLastStep, nextStep, prevStep, goToStep } = useOnboardingNavigation();
  
  return {
    currentStep,
    isLastStep,
    nextStep,
    prevStep,
    goToStep,
    completeOnboarding,
    resetOnboarding
  };
}
