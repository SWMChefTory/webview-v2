import { useCallback } from "react";
import { TIMING } from "../ui/shared/constants";

/**
 * 햅틱 피드백 훅
 * 진동이 가능한 환경에서 짧은 진동을 제공합니다.
 */
export function useHapticFeedback() {
  const triggerHaptic = useCallback(() => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(TIMING.HAPTIC_DURATION_MS);
    }
  }, []);

  return { triggerHaptic };
}
