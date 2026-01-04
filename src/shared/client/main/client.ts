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

      // 환경별 token refresh 로직
      if (typeof window !== "undefined" && window.ReactNativeWebView) {
        // Native app: 기존 로직 유지
        return request(MODE.BLOCKING, "REFRESH_TOKEN", null)
          .then((result) => {
            setMainAccessToken(result.token);
            return clientResolvingError(originalRequest);
          })
          .catch((error) => {
            return Promise.reject(error);
          });
      } else {
        // Web browser: Backend API 호출
        const refreshToken = getMainRefreshToken();

        if (!refreshToken) {
          // Refresh token 없으면 로그인 페이지로 리다이렉트
          if (typeof window !== "undefined") {
            window.location.href = `${
              process.env.NEXT_PUBLIC_WEB_URL || "https://www.cheftories.com"
            }/ko/auth/login`;
          }
          return Promise.reject(new Error("No refresh token available"));
        }

        try {
          // Backend token reissue API 호출
          const response = await clientResolvingError.post<{
            accessToken: string;
            refreshToken: string;
          }>("/auth/token/reissue", {
            refresh_token: refreshToken,
          });

          // 새 토큰 저장
          setMainAccessToken(response.data.accessToken);
          setMainRefreshToken(response.data.refreshToken);

          // 원래 요청 재시도
          return clientResolvingError(originalRequest);
        } catch (refreshError) {
          // Token refresh 실패 시 로그인 페이지로 리다이렉트
          if (typeof window !== "undefined") {
            window.location.href = `${
              process.env.NEXT_PUBLIC_WEB_URL || "https://www.cheftories.com"
            }/ko/auth/login`;
          }
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

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

export default client;
