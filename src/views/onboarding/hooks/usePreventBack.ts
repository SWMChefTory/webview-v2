import { useEffect } from "react";
import { useOnboardingNavigation } from "./useOnboardingNavigation";

export function usePreventBack() {
  const { currentStep, prevStep } = useOnboardingNavigation();

  useEffect(() => {
    // 1단계에서는 기본 브라우저 동작(뒤로가기/종료) 허용
    if (currentStep === 1) return;

    // 브라우저 뒤로가기 방지 및 제어
    const handlePopState = () => {
      // 1단계가 아니면 이전 단계로 이동
      if (currentStep > 1) {
        // history.pushState로 현재 페이지 유지 (뒤로가기 막음)
        window.history.pushState(null, "", window.location.href);
        prevStep();
      }
    };

    // 초기 history entry 추가 (뒤로가기 인터셉트용)
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [currentStep, prevStep]);
}
