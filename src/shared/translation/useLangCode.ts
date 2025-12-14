import { useTranslation } from "next-i18next";

export type Lang = "ko"|"en";

export const useLangcode = () => {
  const {i18n} = useTranslation();
  const lang = (i18n.language.startsWith("ko") ? "ko" : "en") as Lang;
  return lang;
};
