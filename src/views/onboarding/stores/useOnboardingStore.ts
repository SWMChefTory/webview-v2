import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Onboarding State Management
 * 온보딩 진행 상태를 관리하는 Zustand store
 */
export type OnboardingStep = 1 | 2 | 3;

type NavigationDirection = 'forward' | 'backward';

interface OnboardingState {
  isOnboardingCompleted: boolean;
  currentStep: OnboardingStep;
  navigationDirection: NavigationDirection;

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
      navigationDirection: 'forward',

      completeOnboarding: () => {
        set({ isOnboardingCompleted: true });
      },

      nextStep: () => set((state) => ({
        currentStep: Math.min(state.currentStep + 1, 3) as OnboardingStep,
        navigationDirection: 'forward' as NavigationDirection,
      })),

      prevStep: () => set((state) => ({
        currentStep: Math.max(state.currentStep - 1, 1) as OnboardingStep,
        navigationDirection: 'backward' as NavigationDirection,
      })),

      goToStep: (step: OnboardingStep) => set({ currentStep: step }),

      resetOnboarding: () => set({
        isOnboardingCompleted: false,
        currentStep: 1,
        navigationDirection: 'forward' as NavigationDirection,
      })
    }),
    {
      name: 'onboarding-storage',
      partialize: (state) => ({ isOnboardingCompleted: state.isOnboardingCompleted })
    }
  )
);
