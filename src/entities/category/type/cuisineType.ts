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

export const toCuisineType = (
  value: string
): CuisineType | undefined => {
  return Object.values(CuisineType).includes(value as CuisineType)
    ? (value as CuisineType)
    : undefined;
};

