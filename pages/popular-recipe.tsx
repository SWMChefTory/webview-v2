import PopularRecipePage from "@/src/views/popular-recipe";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default PopularRecipePage;

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    //props를 넘기면 useTranslation에서 가져올 수 있음.
    props: {
      ...(await serverSideTranslations(locale, [
        "popular-recipe",
        "shared.recipe-creating-status-chip",
        "common"
      ])),
    },
  };
}
