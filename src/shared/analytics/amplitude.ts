import * as amplitude from "@amplitude/analytics-browser";
import { sessionReplayPlugin } from "@amplitude/plugin-session-replay-browser";

/**
 * Amplitude Analytics for WebView
 *
 * WebView에서 직접 Amplitude SDK를 사용하여 이벤트를 전송합니다.
 * Native와 동일한 Amplitude 프로젝트에 이벤트가 기록됩니다.
 *
 * 초기화 시 서버에서 실제 user_id를 받아와 사용합니다.
 *
 * @see amplitudeEvents.ts - AMPLITUDE_EVENT enum 정의
 */

const AMPLITUDE_API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY!;

let isInitialized = false;

/**
 * Amplitude를 초기화합니다.
 *
 * @param userId - 서버에서 받아온 실제 user_id
 *
 * @example
 * // _app.tsx 또는 useAmplitude hook에서 호출
 * const userId = await fetchUserId();
 * initAmplitude(userId);
 */
export const initAmplitude = (userId: string): void => {
  if (typeof window === "undefined") return;
  if (isInitialized) return;

  amplitude.init(AMPLITUDE_API_KEY, userId, {
    defaultTracking: {
      sessions: true,
      pageViews: true,
      formInteractions: false,
      fileDownloads: false,
    },
  });

  // Session Replay 플러그인 추가 (sampleRate: 1 = 100% 녹화)
  amplitude.add(sessionReplayPlugin({ sampleRate: 1 }));

  isInitialized = true;
  console.log("[Amplitude] WebView initialized with userId:", userId);
  console.log("[Amplitude] Session Replay enabled");
};

/**
 * Amplitude 초기화 여부를 확인합니다.
 */
export const isAmplitudeInitialized = (): boolean => {
  return isInitialized;
};

export type AmplitudeEventProperties = Record<
  string,
  string | number | boolean | string[] | undefined
>;

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
export function track(
  eventName: string,
  properties?: AmplitudeEventProperties
): void {
  if (typeof window === "undefined") return;

  if (!isInitialized) {
    console.warn("[Amplitude] Not initialized. Event not tracked:", eventName);
    return;
  }

  amplitude.track(eventName, {
    ...properties,
    source: "webview",
  });
}

/**
 * 사용자 속성을 설정합니다.
 *
 * @param properties - 사용자 속성
 */
export function setUserProperties(
  properties: Record<string, string | number | boolean>
): void {
  if (typeof window === "undefined") return;
  if (!isInitialized) return;

  const identify = new amplitude.Identify();
  Object.entries(properties).forEach(([key, value]) => {
    identify.set(key, value);
  });
  amplitude.identify(identify);
}
