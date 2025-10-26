import { HorizontallyLongRecipes } from "@/src/pages/home/ui/horizontalyLongRecipes";
import Header, { HeaderSpacing, ProfileButton } from "@/src/shared/ui/header";
import { motion, useScroll, useTransform } from "framer-motion";
import { FloatingButton } from "@/src/pages/home/ui/floatingButton";
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
import { useEffect } from "react";
import React from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

import { useIsInTutorialStore } from "@/src/shared/tutorial/isInTutorialStore";
import ThemeRecipeSection from "./themeRecipeSection";

import Bowser from 'bowser';

export const driverObj = driver({
  showProgress: true,
  // showButtons: ['next', 'previous', 'close'],
  stagePadding: 0,
  steps: [
    // 인트로 (선택사항)
    {
      popover: {
        title: "👋 환영합니다!",
        description: "유튜브 레시피를 30초 만에 저장하는 방법을 알려드릴게요",
        showButtons: ["next", "close"],
        onPopoverRender: (popover) => {
          const footer = popover.wrapper.querySelector(
            ".driver-popover-footer"
          );
          if (footer) {
            footer.innerHTML = `
              <button 
                class="custom-skip-btn"
                style="padding: 8px 16px; border: 1px solid #ddd; border-radius: 8px; background: white; color: #666; margin-right: 8px;"
              >
                건너뛰기
              </button>
              <button 
                class="custom-next-btn"
                style="padding: 8px 16px; border: 1px solid #ddd; border-radius: 8px; background: white; color: #666; margin-right: 8px;"
              >
                시작하기
              </button>
            `;

            // 이벤트 리스너 추가
            footer
              .querySelector(".custom-skip-btn")
              ?.addEventListener("click", () => {
                driverObj.destroy();
              });

            footer
              .querySelector(".custom-next-btn")
              ?.addEventListener("click", () => {
                driverObj.moveNext();
              });
          }
        },
      },
    },

    // Step 1: 레시피 생성 버튼
    {
      element: "[data-tour='floating-button']",
      popover: {
        title: "레시피 추가하기",
        description: "이 버튼을 눌러 유튜브 레시피를 추가할 수 있어요",
        side: "top",
        align: "center",
        showButtons: ["close"],
      },
    },

    // Step 2: URL 입력
    {
      element: "[data-tour='create-recipe']",
      popover: {
        title: "유튜브 링크 입력",
        description:
          "좋아하는 유튜브 레시피 링크를 붙여넣으면 자동으로 레시피가 생성돼요",
        side: "top",
        align: "center",
        showButtons: ["close"],
      },
    },

    // Step 3: 레시피 카드
    {
      element: "[data-tour='recipe-card']",
      popover: {
        title: "레시피 완성!",
        description:
          "생성된 레시피를 클릭하면 상세 정보를 볼 수 있어요. 이제 세프님의 레시피북을 만들어보세요!",
        side: "bottom",
        align: "start",
        showButtons: ["close"],
      },
    },
  ],
  onDestroyStarted: () => {
    driverObj.destroy();
    useIsInTutorialStore.getState().finishTutorial();

  },
});

function startTheMagicShow() {
  driverObj.drive();
}

function HomePage() {
  const router = useRouter();
  useEffect(() => {
    if (useIsInTutorialStore.getState().isInTutorial) {
      startTheMagicShow();
    }
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
      <div className="pt-8 px-2">
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
      <ThemeRecipeSection />
      
      <HorizontallyLongRecipes />
      <VerticallyLongRecipes />
      <FloatingButton />
      {/* <div className="fixed bottom-[200] right-[20] bg-red-500">
        <button
          onClick={() => {
            useIsInTutorialStore.getState().startTutorial();
          }}
        >
          Temp
        </button>
      </div> */}
    </div>
  );
}


const ChromeLogo = () =>{
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 40], [1, 0.5]);
  const translateY = useTransform(scrollY, [0, 40], [0, -72]);
  return (
    <div>
      <div className="h-[84]"/>
      <motion.img
        src="/logo.png"
        alt="logo"
        className="h-[40] w-auto z-1 origin-left"
        style={{ scale: scale, translateY: translateY, originX: 0 }}
      />
    </div>
  );
}


const SafariLogo = () =>{
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
}

const Logo = () => {
  const browser = Bowser.getParser(window.navigator.userAgent);
  const browserName = browser.getBrowserName();

  if (browserName === "Chrome") {
    return <ChromeLogo />;
  } else if (browserName === "Safari") {
    return <SafariLogo />;
  } else {
    return <div>Logo</div>;
  }
};

export default HomePage;
