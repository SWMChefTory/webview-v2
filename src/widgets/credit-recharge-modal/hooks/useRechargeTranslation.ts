import { useTranslation } from "next-i18next";

export const useRechargeTranslation = () => {
  const { t } = useTranslation("recharge");
  return { t };
};
