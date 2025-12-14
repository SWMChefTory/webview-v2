import { Lang } from "@/src/shared/translation/useLangCode";

export const formatCategoryName = ({ lang }: { lang: Lang }) => {
  switch (lang) {
    case "en":
      return { all: "All", add: "Add" };
    default:
      return { all: "전체", add: "추가" };
  }
};
