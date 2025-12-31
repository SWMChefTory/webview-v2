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
};
