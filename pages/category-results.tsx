import CategoryResultsPage from "@/src/views/category-results/index";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18NextConfig from '@/next-i18next.config';

export default CategoryResultsPage;

export async function getStaticProps({ locale }: { locale: string }) {
    return {
      //props를 넘기면 useTranslation에서 가져올 수 있음.
      props: {
        ...(await serverSideTranslations(locale, ["home","shared.recipe-creating-status-chip","category","common"], nextI18NextConfig)),
      },
    };
  }