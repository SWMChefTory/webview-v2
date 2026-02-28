import { useTranslation } from "next-i18next";

export function useYoutubeSearchBannerTranslation() {
  const { t } = useTranslation("search-results");

  return {
    title: (keyword: string) => t("youtubeSearch.title", { keyword }),
    button: t("youtubeSearch.button"),
  };
}
