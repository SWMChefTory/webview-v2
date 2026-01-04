import { PopularRecipes } from "@/src/views/home/ui/popularRecipes";
import Header, { ProfileButton } from "@/src/shared/ui/header/header";
import { FloatingButton } from "@/src/views/home/ui/floatingButton";
import { MyRecipes } from "@/src/views/home/ui/myRecipe";
import { useRouter } from "next/router";
import Link from "next/link";
import { PiMagnifyingGlassBold } from "react-icons/pi";
import { PopularShortsRecipes } from "./popularShortsRecipes";
import { CategorySection } from "./categorySection";
import { useSafeArea } from "@/src/shared/safearea/useSafaArea";
import { RecipeCreateToast } from "@/src/entities/user-recipe/ui/toast";
import * as Toast from "@radix-ui/react-toast";
import { useHomeTranslation } from "@/src/views/home/hooks/useHomeTranslation";
import { useLangcode } from "@/src/shared/translation/useLangCode";
import { ChallengeBanner } from "@/src/features/challenge";
import { BalanceWithRecharge } from "./balanceWithRecharge";

/**
 * Home 페이지 - 모바일 버전 (0 ~ 767px)
 *
 * 특징:
 * - 전체 화면 너비 사용
 * - 가로 스크롤 레이아웃 (MyRecipes, PopularRecipes, PopularShorts)
 * - 모바일 최적화 간격 및 패딩
 */
export function HomePageMobile() {
  const router = useRouter();
  const { t } = useHomeTranslation();
  const lang = useLangcode();

  useSafeArea({
    top: { color: "transparent", isExists: true },
    bottom: { color: "#FFFFFF", isExists: false },
    left: { color: "#FFFFFF", isExists: true },
    right: { color: "#FFFFFF", isExists: true },
  });

  return (
    <div className="min-h-screen w-screen w-full overflow-hidden">
      <Header
        leftContent={<Logo />}
        rightContent={
          <div className="flex flex-row items-center gap-2">
            <BalanceWithRecharge />
            <ProfileButton
              onClick={() => {
                router.push("/user/settings");
              }}
            />
          </div>
        }
        color="bg-white"
      />
      {lang === "ko" && (
        <div className="pt-2 px-2">
          <Link href="/search-recipe">
            <div className="flex flex-row items-center justify-between px-4 w-full h-[36px] text-gray-800 bg-gray-100 rounded-lg">
              {t("searchBarPlaceholder")}
              <PiMagnifyingGlassBold size={16} />
            </div>
          </Link>
        </div>
      )}
      <ChallengeBanner />
      <CategorySection />
      <MyRecipes />
      <PopularRecipes />
      <PopularShortsRecipes />
      <FloatingButton />
      <RecipeCreateToast>
        <Toast.Viewport className="fixed right-3 top-2 z-1000 w-[300px]" />
      </RecipeCreateToast>
      <div className="h-8" />
    </div>
  );
}

const Logo = () => {
  const lang = useLangcode();
  if (lang === "en") {
    return <img src="/logo-en.png" alt="logo" className="h-[20px] w-auto pl-2" />;
  }
  return <img src="/logo.png" alt="logo" className="h-[20px] w-auto pl-2" />;
};
