import { useTranslation } from "next-i18next";

export const useSettingsTranslation = () => {
  const { t } = useTranslation("settings");
  return { t };
};
