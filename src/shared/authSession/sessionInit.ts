import privateClient from "./privateClient";
import {
  getMainRefreshToken,
  setMainAccessToken,
  setMainRefreshToken,
  clearTokens,
} from "./tokenStorage";
import { useSessionStore } from "./useSessionStore";

interface ReissueTokenResponse {
  access_token: string;
  refresh_token: string;
}

/**
 * 앱 시작 시 refreshToken 유효성을 검증하고 세션을 초기화한다.
 * @returns 유효한 세션이면 true, 아니면 false
 */
export async function sessionInit(): Promise<boolean> {
  const refreshToken = getMainRefreshToken();
  if (!refreshToken) {
    useSessionStore.getState().setLoggedIn(false);
    return false;
  }

  try {
    const response = await privateClient.post<ReissueTokenResponse>(
      "/auth/token/reissue",
      { refresh_token: refreshToken }
    );

    const { access_token, refresh_token } = response.data;
    setMainAccessToken(access_token);
    setMainRefreshToken(refresh_token);
    useSessionStore.getState().setLoggedIn(true);
    return true;
  } catch {
    clearTokens();
    useSessionStore.getState().setLoggedIn(false);
    return false;
  }
}
