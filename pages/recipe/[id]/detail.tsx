import RecipeDetailPage from '@/src/views/recipe-detail/index';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default RecipeDetailPage;

export async function getStaticProps({ locale }: { locale: string }) {
    return {
      //props를 넘기면 useTranslation에서 가져올 수 있음.
      props: {
        ...(await serverSideTranslations(locale, ["common"])),
      },
    };
  }