import { useOnboardingStore } from "../stores/useOnboardingStore";
import { useEffect } from "react";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
import { useSafeArea } from "@/src/shared/safearea/useSafaArea";

export interface OnboardingPageControllerResult {
  currentStep: number;
}

/**
 * 온보딩 시작 시간을 sessionStorage에 저장하는 키
 */
const ONBOARDING_START_TIME_KEY = 'onboarding_start_time';

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
    // 온보딩 시작 시간 기록 (sessionStorage 사용)
    const startTime = Date.now();
    try {
      sessionStorage.setItem(ONBOARDING_START_TIME_KEY, String(startTime));
    } catch (e) {
      console.warn('Failed to save onboarding start time:', e);
    }

    track(AMPLITUDE_EVENT.ONBOARDING_START);
  }, []);

  return {
    currentStep,
  };
}

/**
 * 온보딩 시작 시간을 가져오는 헬퍼 함수
 * @returns 시작 시간 (millisecond timestamp), 찾을 수 없으면 null
 */
export function getOnboardingStartTime(): number | null {
  try {
    const stored = sessionStorage.getItem(ONBOARDING_START_TIME_KEY);
    return stored ? parseInt(stored, 10) : null;
  } catch (e) {
    console.warn('Failed to get onboarding start time:', e);
    return null;
  }
}

/**
 * 온보딩 시작부터 경과 시간을 계산하는 헬퍼 함수
 * @returns 경과 시간 (millisecond), 시작 시간을 찾을 수 없으면 0
 */
export function getOnboardingDuration(): number {
  const startTime = getOnboardingStartTime();
  return startTime ? Date.now() - startTime : 0;
}
