import { useTranslation } from "next-i18next";

export const useRecipeDetailTranslation = () => {
  const { t } = useTranslation("recipe-detail");
  return { t };
};
