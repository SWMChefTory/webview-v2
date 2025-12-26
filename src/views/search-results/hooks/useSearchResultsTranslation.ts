import { useTranslation } from "next-i18next";

export const useSearchResultsTranslation = () => {
  const { t } = useTranslation("search-results");
  return { t };
};
