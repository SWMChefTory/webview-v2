import Header from "@/src/shared/ui/header/header";
import { useHomePageController, HomePageProps } from "./HomePage.controller";

export function HomePageDesktop() {
  const props = useHomePageController("desktop");
  return <HomePageDesktopLayout {...props} />;
}

export function HomePageDesktopLayout({
  logo,
  searchBar,
  header,
  sections,
  floatingButton,
  renderToast,
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

      <div className="w-full max-w-[1600px] mx-auto">
        {searchBar && <div className="pt-3 px-8">{searchBar}</div>}

        {sections.challengeBanner}
        {sections.categorySection}

        <div className="mt-16 xl:mt-24">{sections.myRecipes}</div>
        <div className="mt-20 xl:mt-28">{sections.popularRecipes}</div>
        <div className="mt-20 xl:mt-28">{sections.popularShorts}</div>

        <div className="h-32" />
      </div>

      {floatingButton}
      {renderToast("fixed right-8 xl:right-10 top-4 z-1000 w-[400px]")}
    </div>
  );
}
