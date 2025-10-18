import axios, { isAxiosError } from "axios";
import { request, MODE } from "@/src/shared/client/native/client";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";

const REFRESH_TOKEN = "REFRESH_TOKEN";

declare module "axios" {
    export interface AxiosRequestConfig {
      isSecondRequest?: boolean;
    }
  }

const client = axios.create({          
  baseURL: "https://dev.api.cheftories.com/api/v1",
});

client.interceptors.request.use(
  async (config) => {
    console.log("!!!!!!!!!!!!ㄱㄱ", JSON.stringify(config.data, null, 2));
    if(typeof window === "undefined") {
      return Promise.resolve(config);
    }
    const token = getMainAccessToken();
    config.data = (()=>{
      if (config.data) {
        return snakecaseKeys(config.data, { deep: true });
      }
      return config.data;
    })();
    config.headers.Authorization = `${token}`;
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
  (error) => {
    const originalRequest = error.config;
    if (
      isAxiosError(error) &&
      error.response?.data?.errorCode?.startsWith("AUTH")
      && !originalRequest?.isSecondRequest
    ) {
      originalRequest.isSecondRequest = true;
      request(MODE.BLOCKING, "REFRESH_TOKEN",null)
        .then((result) => {
          setMainAccessToken(result.token);
          return client(originalRequest);
        })
        .catch((error) => {
          return Promise.reject(error);
        });
    }
    return Promise.reject(error);
  }
  
);

const MAIN_ACCESS_TOKEN_KEY = "MAIN_ACCESS_TOKEN";

export const getMainAccessToken = () => {
  return localStorage.getItem(MAIN_ACCESS_TOKEN_KEY);
};

export const setMainAccessToken = (token: string) => {
  localStorage.setItem(MAIN_ACCESS_TOKEN_KEY, token);
};

export default client;
