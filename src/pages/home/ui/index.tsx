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

function HomePage() {
  const router = useRouter();

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
      <SSRSuspense fallback={<MyRecipesSkeleton />}>
        <MyRecipesReady />
      </SSRSuspense>
      <div className="h-4"></div>
      <HydrationZustand>
        <TimerSection />
      </HydrationZustand>
      <HorizontallyLongRecipes />
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
    <div className="pl-2">
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
