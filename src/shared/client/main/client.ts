import { MODE, request } from "@/src/shared/client/native/client";
import axios, { isAxiosError } from "axios";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

declare module "axios" {
  export interface AxiosRequestConfig {
    isSecondRequest?: boolean;
  }
}

const client = axios.create({
  baseURL: BASE_URL,
});

//client가 실패했을 경우 재요청을 위한 client 절대 외부로 노출시키면 안됨.
//사용 이유 : client는 실패 시 재요청을 위한 토큰 갱신, 카멜 케이스 변환 등 여러 작업을 수행하는데 에러 처리 이후에는 해당 작업을 수행하면 안됨.
const clientResolvingError = axios.create({
  baseURL: BASE_URL,
});

clientResolvingError.interceptors.request.use(
  async (config) => {
    config.headers.Authorization = `${getMainAccessToken()}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

clientResolvingError.interceptors.response.use(
  (response) => {
    response.data = camelcaseKeys(response.data, { deep: true });
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

client.interceptors.request.use(
  async (config) => {
    if (typeof window === "undefined") {
      return Promise.resolve(config);
    }
    const token = getMainAccessToken();
    config.headers.Authorization = `${token}`;
    const data = (() => {
      if (config.data) {
        return snakecaseKeys(config.data, { deep: true });
      }
      return {};
    })();
    config.data = data;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

client.interceptors.response.use(
  (response) => {
    response.data = camelcaseKeys(response.data, { deep: true });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      isAxiosError(error) &&
      error.response?.data?.errorCode?.startsWith("AUTH") &&
      !originalRequest?.isSecondRequest
    ) {
      originalRequest.isSecondRequest = true;

      console.log("실행1");
      if (!window) {
        console.warn("서버 환경에서 외부 호출 시도");
        return Promise.reject(new Error("REFRESH_TOKEN_ERROR"));
      }

      //네이티브 환경에서
      if (window.ReactNativeWebView) {
        // Native app: 기존 로직 유지
        // DELETE : 네이티브로 토큰 갱신 로직 삭제하고 자체 토큰 갱신 로직 사용 예정
        return request(MODE.BLOCKING, "REFRESH_TOKEN", null)
          .then((result) => {
            setMainAccessToken(result.token);
            return clientResolvingError(originalRequest);
          })
          .catch((error) => {
            return Promise.reject(new TokenRefreshFailedError("Token refresh failed", error));
          });
      }

      // Web browser: Backend API 호출
      return tokenRefreshManager.refreshToken().then(() => {
        return clientResolvingError(originalRequest);
        console.log("실행2");
      }).catch((error) => {
        return Promise.reject(new TokenRefreshFailedError("Token refresh failed", error));
      });
    }
    return Promise.reject(error);
  }
);


class TokenRefreshManager {
  private refreshPromise: Promise<string> | null = null;
  private isRefreshing = false;

  //토큰 재발급
  //다른 동시에 두번 호출하면 다른 refreshToken이 달라져 문제 발생
  async refreshToken(): Promise<string> {
    // 이미 갱신 중이면 기존 Promise 반환
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this.executeRefresh();

    try {
      return await this.refreshPromise;
    } finally {
      // 갱신 완료 후 상태 초기화
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private async executeRefresh(): Promise<string> {
    try {
      const refreshToken = getMainRefreshToken();
      if (!refreshToken) {
        throw new Error("No refresh token");
      }

      const response = await reissueRefreshToken(refreshToken);
      setMainAccessToken(response.access_token);
      setMainRefreshToken(response.refresh_token);
      return response.access_token;
    } catch (error) {
      localStorage.removeItem(MAIN_ACCESS_TOKEN_KEY);
      localStorage.removeItem(MAIN_REFRESH_TOKEN_KEY);
      throw error;
    }
  }
}

const tokenRefreshManager = new TokenRefreshManager();

interface ReissueTokenResponse {
  access_token: string;
  refresh_token: string;
}
interface RawReissueTokenRequest {
  refresh_token: string;
}

export async function reissueRefreshToken(
  refreshToken: string,
): Promise<ReissueTokenResponse> {
  const rawRefreshTokenRequest: RawReissueTokenRequest = {
    refresh_token: refreshToken,
  };
  const response = await clientResolvingError.post(
    "/auth/token/reissue",
    rawRefreshTokenRequest,
  );
  return response.data;
}

const MAIN_ACCESS_TOKEN_KEY = "MAIN_ACCESS_TOKEN";
const MAIN_REFRESH_TOKEN_KEY = "MAIN_REFRESH_TOKEN";

export const getMainAccessToken = () => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(MAIN_ACCESS_TOKEN_KEY) || "";
};

export const setMainAccessToken = (token: string) => {
  localStorage.setItem(MAIN_ACCESS_TOKEN_KEY, token);
};

export const getMainRefreshToken = () => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(MAIN_REFRESH_TOKEN_KEY) || "";
};

export const setMainRefreshToken = (token: string) => {
  localStorage.setItem(MAIN_REFRESH_TOKEN_KEY, token);
};

export class TokenRefreshFailedError extends Error {
  public readonly originalError: unknown;
  public readonly statusCode?: number;

  constructor(message: string, originalError: unknown, statusCode?: number) {
    super(message);
    this.name = "TokenRefreshFailedError";
    this.originalError = originalError;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, TokenRefreshFailedError.prototype);
  }
}

export default client;
