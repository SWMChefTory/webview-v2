import { useTranslation } from "next-i18next";

type TranslationHook = () => {
  t: (key: string, options?: Record<string, unknown>) => string;
};

export function createTranslationHook(namespace: string): TranslationHook {
  return () => {
    const { t } = useTranslation(namespace);
    return { t };
  };
}
