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
 * Home 페이지 - 태블릿 버전 (768px ~)
 *
 * 태블릿 최적화:
 * - 최대 너비 1200px로 제한하고 중앙 정렬
 * - 좌우 패딩 증가 (px-6)
 * - SearchBar 크기 및 간격 조정
 * - 섹션 간 여백 증가
 * - Grid 레이아웃 (나중 Phase에서 섹션별로 적용)
 */
export function HomePageTablet() {
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
    <div className="min-h-screen w-full bg-white">
      {/* Header - 태블릿 최적화 */}
      <Header
        leftContent={<Logo />}
        rightContent={
          <div className="flex flex-row items-center gap-3">
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

      {/* 메인 컨텐츠 컨테이너 - 최대 너비 제한 & 중앙 정렬 */}
      <div className="w-full max-w-[1200px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto">
        {/* SearchBar - 태블릿/데스크톱 최적화 */}
        {lang === "ko" && (
          <div className="pt-3 px-6 lg:px-8">
            <Link href="/search-recipe">
              <div className="flex flex-row items-center justify-between px-5 lg:px-6 w-full max-w-[600px] lg:max-w-[800px] xl:max-w-[1000px] 2xl:max-w-[1200px] mx-auto h-12 lg:h-14 xl:h-16 text-gray-800 bg-gray-100 rounded-xl lg:bg-white lg:border lg:border-gray-200 lg:shadow-sm lg:hover:shadow-md lg:hover:border-gray-300 hover:bg-gray-200 lg:hover:bg-white transition-all duration-300 shadow-sm">
                <span className="text-base lg:text-lg xl:text-xl">{t("searchBarPlaceholder")}</span>
                <PiMagnifyingGlassBold className="size-[18px] lg:size-[22px] xl:size-[24px]" />
              </div>
            </Link>
          </div>
        )}

        {/* ChallengeBanner - 내부에서 패딩 관리 */}
        <ChallengeBanner />

        {/* CategorySection - 내부에서 패딩 관리 */}
        <CategorySection />

        {/* MyRecipes 섹션 */}
        <div className="mt-6 lg:mt-12 xl:mt-16">
          <MyRecipes />
        </div>

        {/* PopularRecipes 섹션 */}
        <div className="mt-8 lg:mt-16 xl:mt-20">
          <PopularRecipes />
        </div>

        {/* PopularShortsRecipes 섹션 */}
        <div className="mt-8 lg:mt-16 xl:mt-20">
          <PopularShortsRecipes />
        </div>

        {/* 하단 여백 */}
        <div className="h-16 lg:h-32" />
      </div>

      {/* FloatingButton - 태블릿 위치 조정 */}
      <FloatingButton />

      {/* Toast - 태블릿/데스크톱 위치 조정 */}
      <RecipeCreateToast>
        <Toast.Viewport className="fixed right-6 lg:right-8 xl:right-10 top-2 lg:top-4 z-1000 w-[360px] lg:w-[400px]" />
      </RecipeCreateToast>
    </div>
  );
}

const Logo = () => {
  const lang = useLangcode();
  if (lang === "en") {
    return (
      <img
        src="/logo-en.png"
        alt="logo"
        className="h-[24px] md:h-[28px] lg:h-[32px] xl:h-[36px] w-auto"
      />
    );
  }
  return (
    <img
      src="/logo.png"
      alt="logo"
      className="h-[24px] md:h-[28px] lg:h-[32px] xl:h-[36px] w-auto"
    />
  );
};
