import { useTranslation } from "next-i18next";

export const useUserRecipeTranslation = () => {
  const { t } = useTranslation("user-recipe");
  return { t };
};
