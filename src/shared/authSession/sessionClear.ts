import { MODE, request } from "@/src/shared/client/native/client";
import { clearTokens } from "./tokenStorage";
import { useSessionStore } from "./useSessionStore";

const LOGOUT = "LOGOUT";

/**
 * 세션을 종료한다 (로그아웃).
 * 토큰 삭제 + 네이티브 환경이면 앱에 알림.
 */
export function sessionClear(): void {
  clearTokens();
  useSessionStore.getState().setLoggedIn(false);

  if (typeof window !== "undefined" && window.ReactNativeWebView) {
    request(MODE.UNBLOCKING, LOGOUT);
  }
}
