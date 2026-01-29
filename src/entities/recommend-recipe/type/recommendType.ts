export enum RecommendType {
  CHEF = "CHEF",
  TRENDING = "TRENDING",
  POPULAR = "POPULAR",
}

export const toRecommendType = (
  value: string
): RecommendType | undefined => {
  return Object.values(RecommendType).includes(value as RecommendType)
    ? (value as RecommendType)
    : undefined;
};
