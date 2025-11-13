import { PopularRecipes } from "@/src/pages/home/ui/popularRecipes";
import Header, { ProfileButton } from "@/src/shared/ui/header/header";
import { FloatingButton } from "@/src/pages/home/ui/floatingButton";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import {
  MyRecipes,
} from "@/src/pages/home/ui/myRecipe";
import { useRouter } from "next/router";
import Link from "next/link";

import { PiMagnifyingGlassBold } from "react-icons/pi";
import { PopularShortsRecipes } from "./popularShortsRecipes";
import { useEffect } from "react";
import React from "react";

import { useIsInTutorialStore } from "@/src/features/tutorial/isInTutorialStore";
import { CategorySection } from "./categorySection";

import { useSafeArea } from "@/src/shared/safearea/useSafaArea";
import { startTheMagicShow } from "@/src/features/tutorial/tutorial";
import { RecipeCreateToast } from "@/src/entities/user_recipe/ui/toast";
import * as Toast from "@radix-ui/react-toast";

function HomePage() {
  const router = useRouter();
  useSafeArea({
    top: { color: "transparent", isExists: true },
    bottom: { color: "#FFFFFF", isExists: false },
    left: { color: "#FFFFFF", isExists: true },
    right: { color: "#FFFFFF", isExists: true },
  });
  useEffect(() => {
    if (useIsInTutorialStore.getState().isInTutorial) {
      startTheMagicShow();
    }
  }, []);

  return (
    <div className="min-h-screen w-screen w-full overflow-hidden bg-white">
        <Header
          leftContent={<Logo />}
          rightContent={
            <div className="flex flex-row">
              <ProfileButton
                onClick={() => {
                  router.push("/user/settings");
                }}
              />
            </div>
          }
          color="bg-white"
        />
      <div className="pt-2 px-2">
        <Link href="/search-recipe">
          <div className="flex flex-row items-center justify-between px-4 w-full h-[36] text-gray-800 bg-gray-100 rounded-lg">
            검색어를 입력해주세요.
            <PiMagnifyingGlassBold size={16} />
          </div>
        </Link>
      </div>
      <CategorySection />
      <MyRecipes/>
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
  return (
    <img
      src="/logo.png"
      alt="logo"
      className="h-[20] w-auto pl-2"
    />
  );
};

export default HomePage;
