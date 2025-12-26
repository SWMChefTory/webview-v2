import { TFunction } from "next-i18next";

export const formatServing = ({
  count,
  t,
}: {
  count: number;
  t: TFunction;
}) => {
  // i18next pluralization: count가 1이면 "serving", 아니면 "servingPlural" 자동 선택
  return count === 1
    ? t("user-recipe:unit.serving", { count })
    : t("user-recipe:unit.servingPlural", { count });
};

export const formatMinute = ({
  count,
  t,
}: {
  count: number;
  t: TFunction;
}) => {
  return t("user-recipe:unit.minute", { count });
};
