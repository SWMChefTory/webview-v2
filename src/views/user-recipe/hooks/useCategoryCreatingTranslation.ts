import { useTranslation } from "next-i18next";

export const useCategoryCreatingTranslation = () => {
  const { t } = useTranslation("category-creating");
  return { t };
};
