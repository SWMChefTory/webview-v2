import Link from "next/link";
import { useRouter } from "next/router";
import { PiMagnifyingGlassBold } from "react-icons/pi";
import { useSafeArea } from "@/src/shared/safearea/useSafaArea";
import { useHomeTranslation } from "@/src/views/home/hooks/useHomeTranslation";
import { useLangcode } from "@/src/shared/translation/useLangCode";
import { ProfileButton } from "@/src/shared/ui/header/header";
import { FloatingButton } from "@/src/views/home/ui/floatingButton";
import { BalanceWithRecharge } from "./balanceWithRecharge";
import { MyRecipes } from "@/src/views/home/ui/myRecipe";
import { PopularRecipes } from "@/src/views/home/ui/popularRecipes";
import { PopularShortsRecipes } from "./popularShortsRecipes";
import { CategorySection } from "./categorySection";
import { ChallengeBanner } from "@/src/features/challenge";
import * as Toast from "@radix-ui/react-toast";

export type HomePageVariant = "mobile" | "tablet" | "desktop";

export interface HomePageProps {
  logo: React.ReactNode;
  searchBar: React.ReactNode | null;
  header: {
    balance: React.ReactNode;
    profileButton: React.ReactNode;
  };
  sections: {
    challengeBanner: React.ReactNode;
    categorySection: React.ReactNode;
    myRecipes: React.ReactNode;
    popularRecipes: React.ReactNode;
    popularShorts: React.ReactNode;
  };
  floatingButton: React.ReactNode;
}

export function useHomePageController(variant: HomePageVariant): HomePageProps {
  const router = useRouter();
  const { t } = useHomeTranslation();
  const lang = useLangcode();

  useSafeArea({
    top: { color: "transparent", isExists: true },
    bottom: { color: "#FFFFFF", isExists: false },
    left: { color: "#FFFFFF", isExists: true },
    right: { color: "#FFFFFF", isExists: true },
  });

  const onProfileClick = () => router.push("/user/settings");

  const logoSrc = lang === "en" ? "/logo-en.png" : "/logo.png";
  const logoClassName = {
    mobile: "h-[20px] w-auto pl-2",
    tablet: "h-[24px] md:h-[28px] w-auto",
    desktop: "h-[32px] xl:h-[36px] w-auto",
  }[variant];

  const searchBarClassName = {
    mobile: "flex flex-row items-center justify-between px-4 w-full h-[36px] text-gray-800 bg-gray-100 rounded-lg",
    tablet: "flex flex-row items-center justify-between px-5 w-full max-w-[600px] mx-auto h-12 text-gray-800 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-300 shadow-sm",
    desktop: "flex flex-row items-center justify-between px-6 w-full max-w-[800px] xl:max-w-[1000px] 2xl:max-w-[1200px] mx-auto h-14 xl:h-16 text-gray-800 bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-300 rounded-xl",
  }[variant];

  const searchIconSize = {
    mobile: 16,
    tablet: 18,
    desktop: 22,
  }[variant];

  const searchIconClassName = {
    mobile: "",
    tablet: "size-[18px]",
    desktop: "size-[22px] xl:size-[24px]",
  }[variant];

  return {
    logo: <img src={logoSrc} alt="logo" className={logoClassName} />,
    searchBar: lang === "ko" ? (
      <Link href="/search-recipe">
        <div className={searchBarClassName}>
          {variant === "mobile" ? (
            <>
              {t("searchBarPlaceholder")}
              <PiMagnifyingGlassBold size={searchIconSize} />
            </>
          ) : (
            <>
              <span className={variant === "desktop" ? "text-lg xl:text-xl" : "text-base"}>
                {t("searchBarPlaceholder")}
              </span>
              <PiMagnifyingGlassBold className={searchIconClassName} />
            </>
          )}
        </div>
      </Link>
    ) : null,
    header: {
      balance: <BalanceWithRecharge />,
      profileButton: <ProfileButton onClick={onProfileClick} />,
    },
    sections: {
      challengeBanner: <ChallengeBanner />,
      categorySection: <CategorySection />,
      myRecipes: <MyRecipes />,
      popularRecipes: <PopularRecipes />,
      popularShorts: <PopularShortsRecipes />,
    },
    floatingButton: <FloatingButton />,
  };
}
