import { useTranslation } from "next-i18next";

export const useWithdrawalTranslation = () => {
  const { t } = useTranslation("withdrawal");
  return { t };
};
