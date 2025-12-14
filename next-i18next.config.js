const path = require('path');

module.exports = {
    i18n: {
      defaultLocale: "ko",
      locales: ["en", "ko"],
      localeDetection:true,
      localePath: path.resolve('./public/locales'),
    },
  };