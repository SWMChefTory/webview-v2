const path = require("path");

/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: "ko",
    locales: ["en", "ko"],
    localeDetection: false,
  },
  localePath:
    typeof window === "undefined"
      ? path.resolve(process.cwd(), "public/locales")
      : "/locales",
  // 번역 파일 설정
  reloadOnPrerender: process.env.NODE_ENV === "development",
  // 기본 설정 - 설정 페이지를 위한 settings를 기본 namespace로 설정
  defaultNS: "common",
  ns: ["common", "settings", "home", "recipe-detail", "auth", "category", "withdrawal", "recharge", "timer", "voice-guide", "search-results", "search-overlay", "category-results", "category-creating", "popular-recipe", "recipe-step", "user-recipe", "onboarding", "shared.recipe-creating-status-chip"],
};
