import { useEffect } from "react";
import { useRouter } from "next/router";
import { useOnboardingNavigation } from "./useOnboardingNavigation";

export function usePreventBack() {
  const router = useRouter();
  const { currentStep, prevStep } = useOnboardingNavigation();

  useEffect(() => {
    // 브라우저 뒤로가기 방지 및 제어
    const handlePopState = () => {
      // 1단계가 아니면 이전 단계로 이동
      if (currentStep > 1) {
        // history.pushState로 현재 페이지 유지 (뒤로가기 막음)
        window.history.pushState(null, "", window.location.href);
        prevStep();
      } else {
        // 1단계에서는 뒤로가기 허용 (앱 종료 또는 이전 페이지)
        // WebView 환경에서는 Native Bridge로 종료 신호를 보낼 수도 있음
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
