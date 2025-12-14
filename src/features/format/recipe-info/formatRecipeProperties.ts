import { Lang } from "@/src/shared/translation/useLangCode";
export const formatServing = ({
  count,
  lang,
}: {
  count: number;
  lang: Lang;
}) => {
  if (lang === "ko") {
    return `${count}인분`;
  }

  return `${count} serving${count > 1 ? "s" : ""}`;
};

export const formatMinute = ({
  count,
  lang,
}: {
  count: number;
  lang: Lang;
}) => {
  if (lang === "ko") {
    return `${count}분`;
  }

  return `${count} min`;
};
