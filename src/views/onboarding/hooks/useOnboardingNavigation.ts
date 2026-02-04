import { useOnboardingStore, OnboardingStep } from "../stores/useOnboardingStore";

export interface OnboardingNavigation {
  currentStep: OnboardingStep;
  isFirstStep: boolean;
  isLastStep: boolean;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: OnboardingStep) => void;
}

export function useOnboardingNavigation(): OnboardingNavigation {
  const { currentStep, nextStep, prevStep, goToStep } = useOnboardingStore();

  return {
    currentStep,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === 3,
    nextStep,
    prevStep,
    goToStep
  };
}
