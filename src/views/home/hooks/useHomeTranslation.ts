import { useTranslation } from "next-i18next";
const useHomeTranslation = () => {
  const { t } = useTranslation("home");
  return { t };
};

export { useHomeTranslation };
