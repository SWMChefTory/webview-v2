import type {
  ChallengeInfo,
  NonParticipant,
  ChallengeRecipe,
  PaginatedChallengeRecipes,
} from "./schema";

// ============================================
// 챌린지 정보 Mock
// ============================================

export const MOCK_PARTICIPANT: ChallengeInfo = {
  isParticipant: true,
  challengeType: "SINGLE",
  challengeName: "자취생 집밥 챌린지",
  completedCount: 2,
  totalCount: 3,
  startDate: "2024-12-16",
  endDate: "2024-12-22",
  kakaoOpenChatUrl: "https://open.kakao.com/xxx",
};

export const MOCK_NON_PARTICIPANT: NonParticipant = {
  isParticipant: false,
};

// ============================================
// 레시피 Mock
// ============================================

export const MOCK_CHALLENGE_RECIPES: ChallengeRecipe[] = [
  {
    recipeId: "challenge-recipe-1",
    recipeTitle: "간단 계란볶음밥",
    tags: [{ name: "자취생" }, { name: "10분요리" }],
    description: "자취생을 위한 초간단 계란볶음밥",
    servings: 1,
    cookingTime: 10,
    videoId: "abc123",
    videoThumbnailUrl: "https://img.youtube.com/vi/abc123/maxresdefault.jpg",
    videoSeconds: 300,
    videoType: "NORMAL",
  },
  {
    recipeId: "challenge-recipe-2",
    recipeTitle: "참치마요 덮밥",
    tags: [{ name: "자취생" }, { name: "5분요리" }],
    description: "통조림으로 만드는 초간단 덮밥",
    servings: 1,
    cookingTime: 5,
    videoId: "def456",
    videoThumbnailUrl: "https://img.youtube.com/vi/def456/maxresdefault.jpg",
    videoSeconds: 180,
    videoType: "NORMAL",
  },
  {
    recipeId: "challenge-recipe-3",
    recipeTitle: "라면 업그레이드",
    tags: [{ name: "자취생" }, { name: "간편식" }],
    description: "라면을 더 맛있게 먹는 방법",
    servings: 1,
    cookingTime: 8,
    videoId: "ghi789",
    videoThumbnailUrl: "https://img.youtube.com/vi/ghi789/maxresdefault.jpg",
    videoSeconds: 240,
    videoType: "NORMAL",
  },
];

export const MOCK_PAGINATED_RECIPES: PaginatedChallengeRecipes = {
  currentPage: 0,
  hasNext: false,
  totalElements: 3,
  totalPages: 1,
  data: MOCK_CHALLENGE_RECIPES,
};
