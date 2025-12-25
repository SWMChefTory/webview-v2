import { useTranslation } from "next-i18next";

export const useTimerTranslation = () => {
  const { t } = useTranslation("timer");
  return { t };
};
