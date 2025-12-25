import { useTranslation } from "next-i18next";

export const useRecipeStepTranslation = () => {
  const { t } = useTranslation("recipe-step");
  return { t };
};
