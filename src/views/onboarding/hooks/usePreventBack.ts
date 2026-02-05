import { useEffect, useRef } from "react";
import { useOnboardingNavigation } from "./useOnboardingNavigation";

/**
 * 온보딩 중 뒤로가기 버튼 제어 Hook
 * - 1단계: 기본 브라우저 동작 허용 (종료 가능)
 * - 2~3단계: 이전 단계로 이동 (뒤로가기 방지)
 */
export function usePreventBack() {
  const { currentStep, prevStep } = useOnboardingNavigation();

  // currentStep을 ref로 저장하여 handlePopState가 항상 최신값을 참조하도록 함
  const stepRef = useRef(currentStep);
  useEffect(() => {
    stepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    // 1단계에서는 기본 브라우저 동작(뒤로가기/종료) 허용
    if (currentStep === 1) return;

    // 브라우저 뒤로가기 방지 및 제어
    const handlePopState = () => {
      const currentStepValue = stepRef.current;
      // 1단계가 아니면 이전 단계로 이동
      if (currentStepValue > 1) {
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
    // prevStep은 Zustand store 함수로 안정된 참조, currentStep은 조건부 실행용
  }, [currentStep, prevStep]);
}
