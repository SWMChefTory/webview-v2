import { useTranslation } from "next-i18next";

export const useCategoryResultsTranslation = () => {
  const { t } = useTranslation("category-results");
  return { t };
};
