import SettingsSectionPage from "@/src/views/settings-sections/index";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticPaths, GetStaticProps } from "next";
import nextI18NextConfig from '@/next-i18next.config';

export default SettingsSectionPage;

// 1. 생성할 경로들을 정의합니다.
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [], // 빈 배열로 두면 빌드 시에는 아무 페이지도 생성하지 않습니다.
    fallback: "blocking", // 요청이 들어오면 그때 서버에서 생성하여 캐싱합니다. (SSR처럼 동작 후 정적 캐싱)
  };
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "ko", ["common", "withdrawal"], nextI18NextConfig)),
    },
  };
};