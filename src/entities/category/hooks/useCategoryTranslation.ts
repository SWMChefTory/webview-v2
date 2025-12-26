import { useTranslation } from "next-i18next";

export const useCategoryTranslation = () => {
  const { t } = useTranslation("category");
  return { t };
};
