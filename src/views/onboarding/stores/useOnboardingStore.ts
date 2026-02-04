import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Onboarding State Management
 * 온보딩 진행 상태를 관리하는 Zustand store
 */
export type OnboardingStep = 1 | 2 | 3;

interface OnboardingState {
  isOnboardingCompleted: boolean;
  currentStep: OnboardingStep;

  // Actions
  completeOnboarding: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: OnboardingStep) => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      isOnboardingCompleted: false,
      currentStep: 1,

      completeOnboarding: () => {
        set({ isOnboardingCompleted: true });
      },

      nextStep: () => set((state) => ({
        currentStep: Math.min(state.currentStep + 1, 3) as OnboardingStep
      })),

      prevStep: () => set((state) => ({
        currentStep: Math.max(state.currentStep - 1, 1) as OnboardingStep
      })),

      goToStep: (step: OnboardingStep) => set({ currentStep: step }),

      resetOnboarding: () => set({
        isOnboardingCompleted: false,
        currentStep: 1
      })
    }),
    {
      name: 'onboarding-storage',
      partialize: (state) => ({ isOnboardingCompleted: state.isOnboardingCompleted })
    }
  )
);
