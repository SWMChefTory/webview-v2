import CategoryResultsPage from "@/src/views/category-results/index";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import nextI18NextConfig from "@/next-i18next.config";

export default CategoryResultsPage;

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        [
          "home",
          "shared.recipe-creating-status-chip",
          "category",
          "common",
          "category-results",
        ],
        nextI18NextConfig
      )),
    },
  };
}
