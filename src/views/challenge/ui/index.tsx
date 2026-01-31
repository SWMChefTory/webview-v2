import { ResponsiveSwitcher } from "@/src/shared/ui/responsive";
import { ChallengePageMobile } from "./Challenge.mobile";
import { ChallengePageTablet } from "./Challenge.tablet";
import { ChallengePageDesktop } from "./Challenge.desktop";

function ChallengePage() {
  return (
    <ResponsiveSwitcher
      mobile={ChallengePageMobile}
      tablet={ChallengePageTablet}
      desktop={ChallengePageDesktop}
      props={{}}
    />
  );
}

export default ChallengePage;
