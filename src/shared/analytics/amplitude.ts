import { MODE, request } from "@/src/shared/client/native/client";

/**
 * Amplitude 이벤트 트래킹 유틸리티
 *
 * WebView에서 발생하는 이벤트를 React Native로 전송하여
 * 네이티브에서 Amplitude SDK를 통해 기록합니다.
 */

export type AmplitudeEventProperties = Record<string, string | number | boolean | undefined>;

/**
 * Amplitude 이벤트를 전송합니다.
 *
 * @param eventName - 이벤트 이름 (예: 'tutorial_share_view')
 * @param properties - 이벤트 속성 (선택)
 *
 * @example
 * // 속성 없이 이벤트 전송
 * track('tutorial_share_view');
 *
 * // 속성과 함께 이벤트 전송
 * track('tutorial_handsfree_step_end', {
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
