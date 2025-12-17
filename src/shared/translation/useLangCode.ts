import { useTranslation } from "next-i18next";

export type Lang = "ko"|"en";

export const useLangcode = () => {
  const {i18n} = useTranslation();
  const language = i18n?.language ?? "ko";
  const lang = (language.startsWith("ko") ? "ko" : "en") as Lang;
  return lang;
};
