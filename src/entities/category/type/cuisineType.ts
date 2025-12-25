// Cuisine API를 사용하는 음식 타입들
export enum CuisineType {
  KOREAN = "KOREAN",
  SNACK = "SNACK",
  CHINESE = "CHINESE",
  JAPANESE = "JAPANESE",
  WESTERN = "WESTERN",
  DESSERT = "DESSERT",
  HEALTHY = "HEALTHY",
  SIMPLE = "SIMPLE",
}

// Recommend API를 사용하는 추천 타입들
export enum RecommendType {
  CHEF = "CHEF",
  TRENDING = "TRENDING",
}

// 모든 카테고리 타입 (UI에서 사용)
export type CategoryType = CuisineType | RecommendType;

export function isCuisineType(type: CategoryType): type is CuisineType {
  return Object.values(CuisineType).includes(type as CuisineType);
}

export function isRecommendType(type: CategoryType): type is RecommendType {
  return Object.values(RecommendType).includes(type as RecommendType);
}

export function getCategoryTypeFromString(str: string): CategoryType | null {
  const upperStr = str.toUpperCase();

  if (Object.values(CuisineType).includes(upperStr as CuisineType)) {
    return upperStr as CuisineType;
  }

  if (Object.values(RecommendType).includes(upperStr as RecommendType)) {
    return upperStr as RecommendType;
  }

  return null;
}