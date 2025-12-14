import HomePage from "@/src/views/home/index";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default HomePage;

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    //props를 넘기면 useTranslation에서 가져올 수 있음.
    props: {
      ...(await serverSideTranslations(locale, ["home","shared.recipe-creating-status-chip","common"])),
    },
  };
}
