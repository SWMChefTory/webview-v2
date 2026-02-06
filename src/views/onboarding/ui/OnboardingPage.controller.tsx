import { useOnboardingStore } from "../stores/useOnboardingStore";
import { useEffect } from "react";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { useSafeArea } from "@/src/shared/safearea/useSafaArea";

export interface OnboardingPageControllerResult {
  currentStep: number;
}

export function useOnboardingPageController(): OnboardingPageControllerResult {
  const { currentStep } = useOnboardingStore();

  // 네이티브 앱에 safe area 처리 요청 (홈 페이지 패턴 참고)
  useSafeArea({
    top: { color: "#FFF7ED", isExists: true },    // from-orange-50 배경색
    bottom: { color: "#FFFFFF", isExists: false }, // 하단 플로팅 버튼은 네이티브 UI
    left: { color: "#FFFFFF", isExists: true },
    right: { color: "#FFFFFF", isExists: true },
  });

  useEffect(() => {
    track(AMPLITUDE_EVENT.ONBOARDING_START);
  }, []);

  return {
    currentStep,
  };
}
