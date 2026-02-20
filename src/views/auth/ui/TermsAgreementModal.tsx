import { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";

import {
  oauthSignup,
  OAuthProvider,
  type OAuthLoginResponse,
} from "@/src/views/auth/hooks/useOAuthLogin";
import { generateNickname } from "@/src/views/auth/utils/generateNickname";

interface TermsAgreementModalProps {
  open: boolean;
  onClose: () => void;
  idToken: string;
  provider: OAuthProvider;
  onComplete: (response: OAuthLoginResponse) => void;
}

export default function TermsAgreementModal({
  open,
  onClose,
  idToken,
  provider,
  onComplete,
}: TermsAgreementModalProps) {
  const { t, i18n } = useTranslation("auth");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [marketingAgreed, setMarketingAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setError(null);
    }
  }, [open]);

  const allRequiredAgreed = termsAgreed && privacyAgreed;
  const allAgreed = termsAgreed && privacyAgreed && marketingAgreed;

  const handleAllAgree = () => {
    const next = !allAgreed;
    setTermsAgreed(next);
    setPrivacyAgreed(next);
    setMarketingAgreed(next);
  };

  const handleSubmit = async () => {
    if (!allRequiredAgreed || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const locale = (i18n.language === "ko" ? "ko" : "en") as "ko" | "en";
      const nickname = generateNickname(locale);

      const response = await oauthSignup({
        idToken,
        provider,
        nickname,
        gender: null,
        dateOfBirth: null,
        isTermsOfUseAgreed: true,
        isPrivacyAgreed: true,
        isMarketingAgreed: marketingAgreed,
      });

      onComplete(response);
    } catch (err) {
      const message =
        typeof err === "object" && err !== null && "message" in err
          ? (err as { message: string }).message
          : t("signup.error");
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 space-y-5">
        <h2 className="text-xl font-bold text-gray-900 text-center">
          {t("signup.title")}
        </h2>

        <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
          <input
            type="checkbox"
            checked={allAgreed}
            onChange={handleAllAgree}
            className="w-5 h-5 rounded accent-orange-500"
          />
          <span className="font-medium text-gray-900">
            {t("signup.allAgree")}
          </span>
        </label>

        <div className="border-t border-gray-200" />

        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={termsAgreed}
              onChange={() => setTermsAgreed(!termsAgreed)}
              className="w-5 h-5 rounded accent-orange-500"
            />
            <span className="flex-1 text-sm text-gray-700">
              <span className="text-orange-600 font-medium">[{t("signup.required")}]</span>{" "}
              {t("signup.termsLabel")}
            </span>
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-gray-600 underline shrink-0"
            >
              {t("signup.view")}
            </a>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={privacyAgreed}
              onChange={() => setPrivacyAgreed(!privacyAgreed)}
              className="w-5 h-5 rounded accent-orange-500"
            />
            <span className="flex-1 text-sm text-gray-700">
              <span className="text-orange-600 font-medium">[{t("signup.required")}]</span>{" "}
              {t("signup.privacyLabel")}
            </span>
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-gray-600 underline shrink-0"
            >
              {t("signup.view")}
            </a>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={marketingAgreed}
              onChange={() => setMarketingAgreed(!marketingAgreed)}
              className="w-5 h-5 rounded accent-orange-500"
            />
            <span className="flex-1 text-sm text-gray-700">
              <span className="text-gray-400">[{t("signup.optional")}]</span>{" "}
              {t("signup.marketingLabel")}
            </span>
          </label>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 text-center">{error}</p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!allRequiredAgreed || isLoading}
          className="w-full py-3 px-4 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isLoading ? t("signup.loading") : t("signup.button")}
        </button>
      </div>
    </div>
  );
}
