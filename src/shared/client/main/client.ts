import axios, { isAxiosError } from "axios";
import { request, MODE } from "@/src/shared/client/native/client";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

console.log('🔍 BASE_URL:', BASE_URL)
console.log('🔍 모든 환경 변수:', process.env)


declare module "axios" {
  export interface AxiosRequestConfig {
    isSecondRequest?: boolean;
  }
}

// const BASE_URL = "https://api.cheftories.com/api/v1";

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
      return request(MODE.BLOCKING, "REFRESH_TOKEN", null)
        .then((result) => {
          setMainAccessToken(result.token);
          return clientResolvingError(originalRequest);
        })
        .catch((error) => {
          return Promise.reject(error);
        });
    }
    // request(MODE.UNBLOCKING, "LOGOUT", null)
    // setMainAccessToken("");
    // alert("로그인 정보가 만료되었습니다. 다시 로그인해주세요.");
    return Promise.reject(error);
  }
);

const MAIN_ACCESS_TOKEN_KEY = "MAIN_ACCESS_TOKEN";

export const getMainAccessToken = () => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(MAIN_ACCESS_TOKEN_KEY) || "";
};

export const setMainAccessToken = (token: string) => {
  localStorage.setItem(MAIN_ACCESS_TOKEN_KEY, token);
};

export default client;
