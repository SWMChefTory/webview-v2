import Header from "@/src/shared/ui/header/header";
import { useHomePageController, HomePageProps } from "./HomePage.controller";

export function HomePageTablet() {
  const props = useHomePageController("tablet");
  return <HomePageTabletLayout {...props} />;
}

export function HomePageTabletLayout({
  logo,
  searchBar,
  header,
  sections,
  floatingButton,
}: HomePageProps) {
  return (
    <div className="min-h-screen w-full bg-white">
      <Header
        leftContent={logo}
        rightContent={
          <div className="flex flex-row items-center gap-3">
            {header.balance}
            {header.profileButton}
          </div>
        }
        color="bg-white"
      />

      <div className="w-full max-w-[1024px] mx-auto">
        {searchBar && <div className="pt-6 px-6">{searchBar}</div>}

        {sections.challengeBanner}
        <div className="mt-8">{sections.categorySection}</div>

        <div className="mt-12">{sections.myRecipes}</div>
        <div className="mt-16">{sections.popularRecipes}</div>
        <div className="mt-16">{sections.popularShorts}</div>

        <div className="h-24" />
      </div>

      {floatingButton}
    </div>
  );
}
