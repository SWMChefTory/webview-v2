const path = require('path');

module.exports = {
    i18n: {
      defaultLocale: "ko",
      locales: ["en", "ko"],
      localeDetection: true,
    },
    localePath: typeof window === 'undefined'
      ? path.resolve(process.cwd(), 'public/locales')
      : '/locales',
  };