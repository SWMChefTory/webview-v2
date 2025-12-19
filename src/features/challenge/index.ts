// ============================================
// Types & Constants
// ============================================
export type { ChallengeType } from "./model/types";
export { CHALLENGE_TYPE_LABELS, CHALLENGE_SIGNUP_FORM_URL } from "./model/types";

// ============================================
// Schema & Types
// ============================================
export type {
  ChallengeInfo,
  ChallengeData,
  NonParticipant,
  ChallengeRecipe,
  PaginatedChallengeRecipes,
} from "./model/schema";

export {
  ChallengeInfoSchema,
  ChallengeDataSchema,
  NonParticipantSchema,
  ChallengeRecipeSchema,
  PaginatedChallengeRecipesSchema,
} from "./model/schema";

// ============================================
// Messages
// ============================================
export {
  PROGRESS_MESSAGES,
  COMPLETION_SUB_MESSAGE,
  BANNER_MESSAGES,
} from "./model/messages";

// ============================================
// Utils
// ============================================
export { formatChallengeDate, formatChallengePeriod, calculateDday } from "./lib/formatDate";

// ============================================
// Hooks
// ============================================
export { useChallengeInfo } from "./model/useChallengeInfo";
export { useChallengeRecipes } from "./model/useChallengeRecipes";

// ============================================
// Mock Data (개발용)
// ============================================
export {
  MOCK_PARTICIPANT,
  MOCK_NON_PARTICIPANT,
  MOCK_CHALLENGE_RECIPES,
  MOCK_PAGINATED_RECIPES,
} from "./model/mockData";

// ============================================
// UI Components
// ============================================
export { ChallengeProgressBox } from "./ui/ChallengeProgressBox";
export { ChallengeProgressSection } from "./ui/ChallengeProgressSection";
export { ChallengePeriod } from "./ui/ChallengePeriod";
export { KakaoLinkButton } from "./ui/KakaoLinkButton";
export {
  ChallengeRecipeCard,
  ChallengeRecipeCardSkeleton,
} from "./ui/ChallengeRecipeCard";
export { ChallengeErrorFallback } from "./ui/ChallengeErrorFallback";
export { NonParticipantView } from "./ui/NonParticipantView";
export { ChallengeBanner } from "./ui/ChallengeBanner";
export { ChallengeGuideLink } from "./ui/ChallengeGuideSheet";
