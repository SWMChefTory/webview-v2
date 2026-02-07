import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import GoogleLoginButton from "@/src/views/auth/ui/GoogleLoginButton";
import AppleLoginButton from "@/src/views/auth/ui/AppleLoginButton";

interface Character {
  title: string;
  description: string;
  image: string;
}

export default function AuthPage() {
  const router = useRouter();
  const { t, i18n } = useTranslation("auth");
  const [error, setError] = useState<string | null>(null);
  const [currentCharacter, setCurrentCharacter] = useState(0);
  const characters = t("welcome.characters", {
    returnObjects: true,
  }) as Character[];
  const locale = i18n.language;

  const [origin, setOrigin] = useState<string>("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCharacter((prev) => (prev + 1) % characters.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [characters.length]);

  const handleSuccess = () => {
    router.push("/");
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => setError(null), 5000);
  };

  useEffect(() => {
    if (error) {
      setTimeout(() => setError(null), 5000);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 p-12 flex-col justify-center items-center">
        <div className="relative w-full max-w-2xl">
          <div className="relative h-[600px] mb-8">
            {characters.map((character, index) => (
              <div
                key={index}
                className={`absolute inset-0 flex flex-col justify-center transition-opacity duration-1000 ${
                  currentCharacter === index ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="relative h-96 mb-6">
                  <Image
                    src={character.image}
                    alt={character.title}
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority={index === 0}
                  />
                </div>
                <div className="text-center space-y-4">
                  <h2 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                    {character.title}
                  </h2>
                  <p className="text-2xl text-gray-600 leading-relaxed whitespace-pre-line">
                    {character.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-3">
            {characters.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentCharacter(index)}
                className={`transition-all duration-300 rounded-full ${
                  currentCharacter === index
                    ? "w-10 h-2.5 bg-orange-500"
                    : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`캐릭터 ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="lg:hidden mb-4">
            <div className="relative w-48 h-48 mx-auto mb-4">
              {characters.map((character, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    currentCharacter === index ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Image
                    src={character.image}
                    alt={character.title}
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>

            <div className="relative text-center h-20 mb-4">
              {characters.map((character, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 ${
                    currentCharacter === index ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-1">
                    {character.title}
                  </h2>
                  <p className="text-sm text-gray-600 whitespace-pre-line">
                    {character.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-2">
              {characters.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentCharacter(index)}
                  className={`transition-all duration-300 rounded-full ${
                    currentCharacter === index
                      ? "w-6 h-2 bg-orange-500"
                      : "w-2 h-2 bg-gray-300"
                  }`}
                  aria-label={`캐릭터 ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-md border border-gray-100 p-2">
                <Image
                  src="/images/tory/logo.png"
                  alt="ChefTory Logo"
                  width={64}
                  height={64}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">
                {t("loginTitle")}
              </h2>
              <p className="text-sm text-gray-600">{t("loginDescription")}</p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 text-center">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <GoogleLoginButton
                redirectUrl={
                  origin ||
                  "https://app.cheftories.com"
                }
                onSuccess={handleSuccess}
                onError={handleError}
              />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">{t("or")}</span>
                </div>
              </div>

              <AppleLoginButton
                redirectUrl={
                  origin ||
                  "https://app.cheftories.com"
                }
                onSuccess={handleSuccess}
                onError={handleError}
              />
            </div>

            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-start gap-3">
                <span className="text-lg shrink-0">💡</span>
                <div className="text-sm">
                  <p className="font-semibold text-orange-900 mb-1">
                    {t("webBrowserNotice.title")}
                  </p>
                  <p className="text-orange-700 leading-relaxed mb-3">
                    {t("webBrowserNotice.description")}
                  </p>

                  <div className="flex items-center justify-center gap-3 mt-3">
                    <a
                      href={t("links.appStore")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-transform hover:scale-105"
                    >
                      <Image
                        src={`/images/badges/app-store-${locale}-black.svg`}
                        alt="Download on App Store"
                        width={120}
                        height={40}
                        className="h-10 w-auto"
                      />
                    </a>
                    <a
                      href={t("links.googlePlay")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-transform hover:scale-105"
                    >
                      <Image
                        src={`/images/badges/google-play-${locale}.svg`}
                        alt="Get it on Google Play"
                        width={135}
                        height={40}
                        className="h-10 w-auto"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                {t("agreement")}{" "}
                <a
                  href="/terms"
                  className="text-orange-600 hover:text-orange-700 underline"
                >
                  {t("termsOfService")}
                </a>{" "}
                {t("and")}{" "}
                <a
                  href="/privacy"
                  className="text-orange-600 hover:text-orange-700 underline"
                >
                  {t("privacyPolicy")}
                </a>
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              {t("noAccount")}{" "}
              <span className="text-orange-600 font-medium">
                {t("autoCreateAccount")}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
