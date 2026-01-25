import Header from "@/src/shared/ui/header/header";
import { useHomePageController, HomePageProps } from "./HomePage.controller";

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
  renderToast,
}: HomePageProps) {
  return (
    <div className="min-h-screen w-screen w-full overflow-hidden">
      <Header
        leftContent={logo}
        rightContent={
          <div className="flex flex-row items-center gap-2">
            {header.balance}
            {header.profileButton}
          </div>
        }
        color="bg-white"
      />

      {searchBar && <div className="pt-2 px-2">{searchBar}</div>}

      {sections.challengeBanner}
      {sections.categorySection}
      {sections.myRecipes}
      {sections.popularRecipes}
      {sections.popularShorts}

      {floatingButton}
      {renderToast("fixed right-3 top-2 z-1000 w-[300px]")}

      <div className="h-8" />
    </div>
  );
}
