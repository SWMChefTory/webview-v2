import Header from "@/src/shared/ui/header/header";
import Link from "next/link";

import { useHomePageController, type HomePageProps } from "./HomePage.controller";

export function HomePageMobile() {
  const props = useHomePageController("mobile");
  return <HomePageMobileLayout {...props} />;
}

export function HomePageMobileLayout({
  logo,
  searchBar,
  header,
  sections,
  floatingButton,
}: HomePageProps) {
  return (
    <div className="min-h-screen w-screen w-full overflow-hidden bg-[#FFFDF5]">
      <Header
        leftContent={logo}
        rightContent={
          <div className="flex flex-row items-center gap-2">
            {header.balance}
            {header.profileButton}
          </div>
        }
        color="bg-[#FFFDF5]"
      />

      {/* POC 진입 배너 */}
      <div className="px-3 pt-2">
        <Link href="/poc">
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-400 rounded-xl shadow-sm">
            <div>
              <span className="text-xs font-semibold text-orange-100">POC</span>
              <p className="text-sm font-bold text-white">새로운 레시피 UI 체험하기</p>
            </div>
            <span className="text-white text-lg">→</span>
          </div>
        </Link>
      </div>

      {searchBar && <div className="pt-2 px-2">{searchBar}</div>}
      {sections.categorySection}
      {sections.myRecipes}
      {sections.popularRecipes}
      {sections.popularShorts}

      {floatingButton}

      <div className="h-8" />
    </div>
  );
}
