import RecipeStepPage from '@/src/views/recipe-step/index';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default RecipeStepPage;

export async function getStaticProps({ locale }: { locale: string }) {
    return {
      //props를 넘기면 useTranslation에서 가져올 수 있음.
      props: {
        ...(await serverSideTranslations(locale, ["common"])),
      },
    };
  }