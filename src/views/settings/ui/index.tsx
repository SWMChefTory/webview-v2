import { ResponsiveSwitcher } from "@/src/shared/ui/responsive";
import { SettingsPageMobile } from "./SettingsPage.mobile";
import { SettingsPageTablet } from "./SettingsPage.tablet";
import { SettingsPageDesktop } from "./SettingsPage.desktop";

function SettingsPage() {
  return (
    <ResponsiveSwitcher
      mobile={SettingsPageMobile}
      tablet={SettingsPageTablet}
      desktop={SettingsPageDesktop}
      props={{}}
    />
  );
}

export default SettingsPage;
