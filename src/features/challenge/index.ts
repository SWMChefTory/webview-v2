// ============================================
// Types & Constants
// ============================================
export type { ChallengeType } from "./model/types";
export { CHALLENGE_TYPES, CHALLENGE_TYPE_LABELS, CHALLENGE_SIGNUP_FORM_URL } from "./model/types";
export { CHALLENGE_CONSTANTS, KAKAO_OPEN_CHAT_URLS } from "./model/constants";

// ============================================
// Schema & Types
// ============================================
export type {
  Participant,
  ChallengeData,
  NonParticipant,
  ChallengeRecipe,
  CompleteRecipe,
  ChallengeRecipesResponse,
} from "./model/schema";

export {
  ParticipantSchema,
  ChallengeDataSchema,
  NonParticipantSchema,
  ChallengeRecipeSchema,
  CompleteRecipeSchema,
  ChallengeRecipesResponseSchema,
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
  MOCK_COMPLETE_RECIPES,
} from "./model/mockData";

// ============================================
// UI Components
// ============================================
export { ChallengeProgressBox } from "./ui/ChallengeProgressBox";
export { ChallengeProgressSection } from "./ui/ChallengeProgressSection";
export { ChallengePeriod } from "./ui/ChallengePeriod";
export {
  ChallengeRecipeCard,
  ChallengeRecipeCardSkeleton,
} from "./ui/ChallengeRecipeCard";
export { ChallengeErrorFallback } from "./ui/ChallengeErrorFallback";
export { NonParticipantView } from "./ui/NonParticipantView";
export { ChallengeBanner } from "./ui/ChallengeBanner";
export { ChallengeBottomBar } from "./ui/ChallengeBottomBar";
