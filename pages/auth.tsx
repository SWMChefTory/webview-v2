import AuthPage from "@/src/views/auth";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default AuthPage;

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["auth", "common"])),
    },
  };
}
