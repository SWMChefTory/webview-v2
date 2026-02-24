import { VersionInfoPage } from "@/src/views/settings/ui/VersionInfoPage";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18NextConfig from '@/next-i18next.config';

export default VersionInfoPage;

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "settings"], nextI18NextConfig)),
    },
  };
}
