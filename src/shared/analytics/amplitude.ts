import { MODE, request } from "@/src/shared/client/native/client";

/**
 * Amplitude 이벤트 트래킹 유틸리티
 *
 * WebView에서 발생하는 이벤트를 React Native로 전송하여
 * 네이티브에서 Amplitude SDK를 통해 기록합니다.
 *
 * @see amplitudeEvents.ts - AMPLITUDE_EVENT enum 정의
 */

export type AmplitudeEventProperties = Record<string, string | number | boolean | undefined>;

/**
 * Amplitude 이벤트를 전송합니다.
 *
 * @param eventName - 이벤트 이름 (AMPLITUDE_EVENT enum 사용 권장)
 * @param properties - 이벤트 속성 (선택)
 *
 * @example
 * import { AMPLITUDE_EVENT } from './amplitudeEvents';
 *
 * // 속성 없이 이벤트 전송
 * track(AMPLITUDE_EVENT.TUTORIAL_SHARE_VIEW);
 *
 * // 속성과 함께 이벤트 전송
 * track(AMPLITUDE_EVENT.TUTORIAL_HANDSFREE_STEP_END, {
 *   recipe_id: 'abc123',
 *   completed_steps: 3,
 *   total_steps: 5,
 *   is_completed: false,
 * });
 */
export function track(eventName: string, properties?: AmplitudeEventProperties): void {
  request(MODE.UNBLOCKING, "TRACK_AMPLITUDE", {
    eventName,
    properties: properties ?? {},
  });
}
