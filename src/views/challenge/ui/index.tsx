import { useMediaQuery } from "@/src/shared/hooks/useMediaQuery";
import { MEDIA_QUERIES } from "@/src/shared/constants/breakpoints";
import { ChallengePageMobile } from "./Challenge.mobile";
import { ChallengePageTablet } from "./Challenge.tablet";

function ChallengePage() {
  const isMobile = useMediaQuery(MEDIA_QUERIES.mobile);
  return isMobile ? <ChallengePageMobile /> : <ChallengePageTablet />;
}

export default ChallengePage;
