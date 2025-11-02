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

export const CuisineTypeLabels: Record<CuisineType, string> = {
  [CuisineType.KOREAN]: "한식",
  [CuisineType.SNACK]: "분식",
  [CuisineType.CHINESE]: "중식",
  [CuisineType.JAPANESE]: "일식",
  [CuisineType.WESTERN]: "양식",
  [CuisineType.DESSERT]: "디저트",
  [CuisineType.HEALTHY]: "건강식",
  [CuisineType.SIMPLE]: "간편식",
};

export const RecommendTypeLabels: Record<RecommendType, string> = {
  [RecommendType.CHEF]: "쉐프",
  [RecommendType.TRENDING]: "급상승",
};

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

export function getCategoryTypeLabel(type: CategoryType): string {
  if (isCuisineType(type)) {
    return CuisineTypeLabels[type];
  }
  return RecommendTypeLabels[type];
}

