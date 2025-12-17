import SettingsPage from "@/src/views/settings/index";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18NextConfig from '@/next-i18next.config';

export default SettingsPage;

export async function getStaticProps({ locale }: { locale: string }) {
    return {
      //props를 넘기면 useTranslation에서 가져올 수 있음.
      props: {
        ...(await serverSideTranslations(locale, ["common"], nextI18NextConfig)),
      },
    };
  }