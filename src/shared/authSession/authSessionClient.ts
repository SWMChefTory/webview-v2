import { MODE, request } from "@/src/shared/client/native/client";
import axios, { isAxiosError } from "axios";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";
import privateClient from "./privateClient";
import {
  getMainAccessToken,
  getMainRefreshToken,
  setMainAccessToken,
  setMainRefreshToken,
  clearTokens,
} from "./tokenStorage";
import { TokenRefreshFailedError } from "./errors";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

declare module "axios" {
  export interface AxiosRequestConfig {
    isSecondRequest?: boolean;
  }
}

// 외부 API용 메인 클라이언트
const authSessionClient = axios.create({
  baseURL: BASE_URL,
});

// 재요청 전용 클라이언트 (interceptor 루프 방지)
const retryClient = axios.create({
  baseURL: BASE_URL,
});

retryClient.interceptors.request.use(
  async (config) => {
    config.headers.Authorization = `${getMainAccessToken()}`;
    return config;
  },
  (error) => Promise.reject(error)
);

retryClient.interceptors.response.use(
  (response) => {
    response.data = camelcaseKeys(response.data, { deep: true });
    return response;
  },
  (error) => Promise.reject(error)
);

// 메인 클라이언트 request interceptor
authSessionClient.interceptors.request.use(
  async (config) => {
    if (typeof window === "undefined") {
      return Promise.resolve(config);
    }
    config.headers.Authorization = `${getMainAccessToken()}`;
    if (config.data) {
      config.data = snakecaseKeys(config.data, { deep: true });
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 메인 클라이언트 response interceptor
authSessionClient.interceptors.response.use(
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

      if (!window) {
        return Promise.reject(new Error("REFRESH_TOKEN_ERROR"));
      }

      // 네이티브 환경
      if (window.ReactNativeWebView) {
        return request(MODE.BLOCKING, "REFRESH_TOKEN", null)
          .then((result) => {
            setMainAccessToken(result.token);
            return retryClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(
              new TokenRefreshFailedError("Token refresh failed", err)
            );
          });
      }

      // 웹 환경
      return tokenRefreshManager
        .refreshToken()
        .then(() => retryClient(originalRequest))
        .catch((err) => {
          return Promise.reject(
            new TokenRefreshFailedError("Token refresh failed", err)
          );
        });
    }
    return Promise.reject(error);
  }
);

class TokenRefreshManager {
  private refreshPromise: Promise<string> | null = null;
  private isRefreshing = false;

  async refreshToken(): Promise<string> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this.executeRefresh();

    try {
      return await this.refreshPromise;
    } finally {
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

      const response = await privateClient.post("/auth/token/reissue", {
        refresh_token: refreshToken,
      });

      const { access_token, refresh_token } = response.data;
      setMainAccessToken(access_token);
      setMainRefreshToken(refresh_token);
      return access_token;
    } catch (error) {
      clearTokens();
      throw error;
    }
  }
}

const tokenRefreshManager = new TokenRefreshManager();

export default authSessionClient;
