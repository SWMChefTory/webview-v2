import path from 'path';
import type { UserConfig } from 'next-i18next';

const config: UserConfig = {
  i18n: {
    defaultLocale: "ko",
    locales: ["en", "ko"],
    localeDetection: false,
  },
  localePath: typeof window === 'undefined'
    ? path.resolve(process.cwd(), 'public/locales')
    : '/locales',
};

export default config;
