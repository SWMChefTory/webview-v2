import { useTranslation } from "next-i18next";

export const useRecipeReportTranslation = () => {
  const { t } = useTranslation("recipe-detail");
  return {
    t: (key: string, options?: Record<string, unknown>) =>
      t(`report.${key}`, options),
  };
};
