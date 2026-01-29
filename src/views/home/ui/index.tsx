import { ResponsiveSwitcher } from "@/src/shared/ui/responsive";
import { HomePageMobile } from "./HomePage.mobile";
import { HomePageTablet } from "./HomePage.tablet";
import { HomePageDesktop } from "./HomePage.desktop";

function HomePage() {
  return (
    <ResponsiveSwitcher
      mobile={HomePageMobile}
      tablet={HomePageTablet}
      desktop={HomePageDesktop}
      props={{}}
    />
  );
}

export default HomePage;
