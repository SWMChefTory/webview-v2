import { useCallback } from "react";

type Lang = "en" | "ko";
type Unit = "year" | "month" | "day" | "hour" | "minute";

export const useElapsedTime = (lang: Lang) => {
  const getElapsedTime = useCallback(
    (viewedAt: Date | string) => {
      const date = typeof viewedAt === "string" ? new Date(viewedAt) : viewedAt;
      const now = new Date();
      const elapsedMs = now.getTime() - date.getTime();

      if (isNaN(date.getTime()) || elapsedMs < 0) {
        return getJustNowText(lang);
      }

      const sec = Math.floor(elapsedMs / 1000);
      const min = Math.floor(sec / 60);
      const hour = Math.floor(min / 60);
      const day = Math.floor(hour / 24);
      const month = Math.floor(day / 30);
      const year = Math.floor(day / 365);

      if (year > 0) return formatElapsed({ count: year, unit: "year", lang });
      if (month > 0)
        return formatElapsed({ count: month, unit: "month", lang });
      if (day > 0) return formatElapsed({ count: day, unit: "day", lang });
      if (hour > 0) return formatElapsed({ count: hour, unit: "hour", lang });
      if (min > 0) return formatElapsed({ count: min, unit: "minute", lang });

      return getJustNowText(lang);
    },
    [lang]
  );

  return { getElapsedTime };
};
const formatElapsed = ({
  count,
  unit,
  lang,
}: {
  count: number;
  unit: Unit;
  lang: Lang;
}) => {
  if (lang === "en") {
    return formatEn(count, unit);
  }
  return formatKo(count, unit);
};
const formatEn = (count: number, unit: Unit) => {
  const plural = count > 1 ? "s" : "";
  return `${count} ${unit}${plural} ago`;
};

const formatKo = (count: number, unit: Unit) => {
  const map: Record<Unit, string> = {
    year: "년",
    month: "달",
    day: "일",
    hour: "시간",
    minute: "분",
  };

  return `${count}${map[unit]} 전`;
};
const getJustNowText = (lang: Lang) => (lang === "en" ? "Just now" : "방금 전");
