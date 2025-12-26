import { useTranslation } from "next-i18next";

export const useSearchOverlayTranslation = () => {
  const { t } = useTranslation("search-overlay");
  return { t };
};
