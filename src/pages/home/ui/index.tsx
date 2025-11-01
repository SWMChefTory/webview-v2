import { HorizontallyLongRecipes } from "@/src/pages/home/ui/horizontalyLongRecipes";
import Header, { ProfileButton } from "@/src/shared/ui/header";
import { motion, useScroll, useTransform } from "framer-motion";
import { FloatingButton } from "@/src/pages/home/ui/floatingButton";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import {
  MyRecipesReady,
  MyRecipesSkeleton,
} from "@/src/pages/home/ui/myRecipe";
import { useRouter } from "next/router";
import Link from "next/link";

import { PiMagnifyingGlassBold } from "react-icons/pi";
import { TimerSection } from "./TimerSection";

import HydrationZustand from "@/src/shared/hydration-zustand/hydrationZustand";
import { VerticallyLongRecipes } from "./vericallyLongRecipes";
import { useEffect } from "react";
import React from "react";

import { useIsInTutorialStore } from "@/src/features/tutorial/isInTutorialStore";
import ThemeRecipeSection from "./themeRecipeSection";

import { useSafeArea } from "@/src/shared/safearea/useSafaArea";
import { startTheMagicShow } from "@/src/features/tutorial/tutorial";
import { RecipeCreateToast } from "@/src/entities/user_recipe/ui/toast";
import * as Toast from "@radix-ui/react-toast";
import { RecipeCreateToastStatus, useRecipeCreateToastAction } from "@/src/entities/user_recipe/model/useToast";

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
      <div className="fixed top-0 left-0 right-0 z-50 h-[100]">
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
      </div>
      <div className="h-[56px]" />
      <div className="h-[40]" />
      <div className="pt-8 px-2">
        <Link href="/search-recipe">
          <div className="flex flex-row items-center justify-between px-4 w-full h-[36] text-gray-800 bg-gray-100 rounded-lg">
            검색어를 입력해주세요.
            <PiMagnifyingGlassBold size={16} />
          </div>
        </Link>
      </div>
      <SSRSuspense fallback={<MyRecipesSkeleton />}>
        <MyRecipesReady />
      </SSRSuspense>
      <div className="h-4" />
      <HydrationZustand>
        <TimerSection />
      </HydrationZustand>
      <ThemeRecipeSection />
      <HorizontallyLongRecipes />
      <VerticallyLongRecipes />
      <FloatingButton />
      <RecipeCreateToast>
        <Toast.Viewport className="fixed right-3 top-2 z-1000 w-[300px]" />
      </RecipeCreateToast>
      <div className="h-8" />
    </div>
  );
}

const Logo = () => {
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 40], [1, 0.5]);
  const translateY = useTransform(scrollY, [0, 40], [0, -64]);
  // const [isInitialized, setIsInitialized] = useState(false);
  // const y = useMotionValue(0);

  // useEffect(()=>{
  //   setIsInitialized(true);
  //   scrollY.set(y.get());
  //   scrollY.set(beforeScrollY);
  //   console.log("!!!!! get",scrollY.get());
  //   console.log("!!!!! scroll",window.scrollY);
  //   console.log("!!!!! beforeScrollY",beforeScrollY);
  //   return () => {
  //     beforeScrollY = window.scrollY;
  //     console.log("!!!!! beforeScrollY",beforeScrollY);
  //   }
  // }, []);

  return (
    <motion.div
      style={{ translateY: translateY }}
      className="relative w-full h-[168]"
    >
      {/* {isInitialized && (
          <motion.img
            src="/logo.png"
            alt="logo"
            className="h-[40] w-auto z-1 origin-left pl-2 absolute bottom-0 left-0 right-0"
            style={{ scale: scale, originX: 0 }}
          />
        )} */}
      <motion.img
        src="/logo.png"
        alt="logo"
        className="h-[40] w-auto z-1 origin-left pl-2 absolute bottom-0 left-0 right-0"
        style={{ scale: scale, originX: 0 }}
      />
    </motion.div>
  );
};

export default HomePage;
