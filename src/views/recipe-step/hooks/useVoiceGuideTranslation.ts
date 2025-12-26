import { useTranslation } from "next-i18next";

export const useVoiceGuideTranslation = () => {
  const { t } = useTranslation("voice-guide");
  return { t };
};
