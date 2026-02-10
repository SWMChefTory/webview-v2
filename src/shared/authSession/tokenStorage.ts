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

export const clearTokens = () => {
  localStorage.removeItem(MAIN_ACCESS_TOKEN_KEY);
  localStorage.removeItem(MAIN_REFRESH_TOKEN_KEY);
};
