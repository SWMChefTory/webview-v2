import { HorizontallyLongRecipes } from "@/src/pages/home/ui/horizontalyLongRecipes";
import Header, { HeaderSpacing, ProfileButton } from "@/src/shared/ui/header";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  FloatingButton,
  FloatingButtonSkeleton,
} from "@/src/pages/home/ui/floatingButton";
import { Toaster } from "@/components/ui/sonner";
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
import { MODE, request } from "@/src/shared/client/native/client";
import { useEffect } from "react";
import React from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const driverObj = driver({
  showProgress: true, // Because everyone loves progress bars!
  steps: [
    {
      element: "#element-of-mystery",
      popover: {
        title: "Abracadabra!",
        description: "Watch as I reveal the secrets of this element.",
      },
    },
    // More magical steps...
  ],
});
function startTheMagicShow() {
  driverObj.drive();
}

enum loadingRequestType {
  LOAD_START = "LOAD_START",
  LOAD_END = "LOAD_END",
}

function HomePage() {
  const router = useRouter();
  function nextPaint() {
    return new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
    );
  }
  useEffect(() => {
    (async () => {
      await nextPaint();
      request(MODE.UNBLOCKING, loadingRequestType.LOAD_END);
    })();
  }, []);

  return (
    <div className="min-h-screen w-screen w-full overflow-hidden pb-safe">
      
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
      <Toaster />
      <div className="h-[40]" />
      <div className="pt-8 px-6">
        <Link href="/search-recipe">
          <div className="flex flex-row items-center justify-between px-4  w-full h-[36] text-gray-800  bg-gray-100 rounded-lg">
            검색어를 입력해주세요.
            <PiMagnifyingGlassBold size={16} />
          </div>
        </Link>
      </div>
      {/* <button onClick={startTheMagicShow}>Start Magical Tour</button> */}
      <SSRSuspense fallback={<MyRecipesSkeleton />}>
        <MyRecipesReady />
      </SSRSuspense>
      <div className="h-4"></div>
      <HydrationZustand>
        <TimerSection />
      </HydrationZustand>
      <HorizontallyLongRecipes />
      <VerticallyLongRecipes />
      <SSRSuspense fallback={<FloatingButtonSkeleton />}>
        <FloatingButton />
      </SSRSuspense>
    </div>
  );
}

const Logo = () => {
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 40], [1, 0.5]);
  const translateY = useTransform(scrollY, [0, 40], [0, -52]);

  return (
    <div className="pl-2 ">
      <HeaderSpacing />
      <motion.img
        src="/logo.png"
        alt="logo"
        className="h-[40] w-auto z-1 origin-left"
        style={{ scale: scale, translateY: translateY, originX: 0 }}
      />
    </div>
  );
};

export default HomePage;
