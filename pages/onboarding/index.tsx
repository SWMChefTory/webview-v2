import OnboardingPage from "@/src/views/onboarding/index";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";

export default function OnboardingPageRoute() {
  return <OnboardingPage />;
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "ko", ["common", "onboarding"])),
    },
  };
};
