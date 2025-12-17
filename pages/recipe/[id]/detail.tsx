import RecipeDetailPage from '@/src/views/recipe-detail/index';
import { GetStaticPaths } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18NextConfig from '@/next-i18next.config';

export default RecipeDetailPage;

export async function getStaticProps({ locale }: { locale: string }) {
    return {
      //props를 넘기면 useTranslation에서 가져올 수 있음.
      props: {
        ...(await serverSideTranslations(locale, ["common"], nextI18NextConfig)),
      },
    };
  }
  export const getStaticPaths: GetStaticPaths = async () => {
    return {
      paths: [], // 빈 배열로 두면 빌드 시에는 아무 페이지도 생성하지 않습니다.
      fallback: "blocking", // 요청이 들어오면 그때 서버에서 생성하여 캐싱합니다. (SSR처럼 동작 후 정적 캐싱)
    };
  };