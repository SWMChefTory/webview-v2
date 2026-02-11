import { useCallback, useEffect, useRef, useState } from "react";

import { useRouter } from "next/router";

import { Button } from "@/components/ui/button";
import {
  OAuthProvider,
  useOAuthLogin,
} from "@/src/views/auth/hooks/useOAuthLogin";

const APPLE_SDK_SRC =
  "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";

const SDK_POLL_INTERVAL_MS = 100;
const SDK_MAX_ATTEMPTS = 100;

type AppleSignInResponse = {
  authorization?: {
    id_token?: string;
  };
};

declare global {
  interface Window {
    AppleID?: {
      auth?: {
        init: (params: {
          clientId: string;
          scope: string;
          redirectURI: string;
          usePopup: boolean;
        }) => void;
        signIn: () => Promise<AppleSignInResponse>;
      };
    };
  }
}

function getAppleIdToken(response: AppleSignInResponse): string | null {
  const token = response.authorization?.id_token;
  if (!token) return null;
  return token;
}

interface AppleLoginButtonProps {
  redirectUrl: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function AppleLoginButton({
  redirectUrl,
  onSuccess,
  onError,
}: AppleLoginButtonProps) {
  const router = useRouter();
  const { loginWithIdToken } = useOAuthLogin();

  const [isLoading, setIsLoading] = useState(false);
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [sdkError, setSdkError] = useState<string | null>(null);
  const pollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const attemptCountRef = useRef(0);

  const APPLE_CLIENT_ID = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID;
  if (!APPLE_CLIENT_ID) {
    throw new Error("Apple Client ID is not configured");
  }

  const redirectURI = process.env.NEXT_PUBLIC_APPLE_RETURN_URL;
  if (!redirectURI) {
    throw new Error("Apple Redirect URI is not configured");
  }

  const initializeSDK = useCallback(() => {
    if (!APPLE_CLIENT_ID) {
      const errorMessage = "Apple Client ID is not configured";
      console.error(errorMessage);
      onError(errorMessage);
      return false;
    }

    if (!window.AppleID?.auth) {
      return false;
    }
    try {
      window.AppleID.auth.init({
        clientId: APPLE_CLIENT_ID,
        scope: "name email",
        redirectURI,
        usePopup: true,
      });

      setIsSDKLoaded(true);
      setSdkError(null);
      return true;
    } catch (error) {
      console.error("[Apple SDK Init Error]", error);
      setSdkError("Failed to initialize Apple Sign In");
      onError("Failed to initialize Apple Sign In");
      return false;
    }
  }, [onError]);

  useEffect(() => {
    if (isSDKLoaded) return;
    if (!APPLE_CLIENT_ID) return;
    if (typeof window === "undefined") return;

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-appleid-sdk="true"]',
    );

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = APPLE_SDK_SRC;
      script.async = true;
      script.defer = true;
      script.dataset.appleidSdk = "true";
      script.onload = () => {
        initializeSDK();
      };
      script.onerror = () => {
        setSdkError("Apple Sign In SDK failed to load");
        onError("Apple Sign In SDK failed to load");
      };
      document.head.appendChild(script);
    }

    const pollForSDK = () => {
      if (isSDKLoaded) return;

      if (initializeSDK()) {
        return;
      }

      attemptCountRef.current += 1;
      if (attemptCountRef.current >= SDK_MAX_ATTEMPTS) {
        console.warn(
          "[Apple SDK] SDK load timeout after",
          SDK_MAX_ATTEMPTS * SDK_POLL_INTERVAL_MS,
          "ms",
        );
        setSdkError("Apple Sign In SDK failed to load");
        onError("Apple Sign In SDK failed to load");
        return;
      }

      pollTimeoutRef.current = setTimeout(pollForSDK, SDK_POLL_INTERVAL_MS);
    };

    pollForSDK();

    return () => {
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
      }
    };
  }, [initializeSDK, isSDKLoaded, onError]);

  const handleRoute = () => {
    router.push(redirectUrl);
  };

  const handleAppleLogin = async () => {
    if (!window.AppleID?.auth) {
      const errorMessage = "Apple Sign In SDK is not loaded";
      console.error(errorMessage);
      onError(errorMessage);
      return;
    }

    try {
      setIsLoading(true);

      const appleResponse = await window.AppleID.auth.signIn();
      const idToken = getAppleIdToken(appleResponse);
      if (!idToken) {
        const errorMessage = "Apple login failed: No id_token received";
        console.error(errorMessage);
        onError(errorMessage);
        return;
      }

      await loginWithIdToken({
        idToken,
        provider: OAuthProvider.APPLE,
        onRoute: handleRoute,
        onSuccess,
        onError,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!APPLE_CLIENT_ID) {
    return (
      <div className="w-full p-4 border border-red-300 bg-red-50 rounded-lg text-center text-sm text-red-600">
        Apple login is not configured. Please check your environment variables.
      </div>
    );
  }

  if (sdkError) {
    return (
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full flex items-center justify-center gap-3 bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"
        disabled
        aria-label="Apple Sign In unavailable"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16.0395 16.9658C15.2997 18.2108 14.4866 19.4449 13.3261 19.4617C12.1824 19.4785 11.8086 18.744 10.4951 18.744C9.18157 18.744 8.77398 19.4449 7.69748 19.4785C6.57056 19.5121 5.66607 18.1323 4.91946 16.8932C3.39267 14.3643 2.23053 9.7346 3.82432 6.68891C4.61272 5.17779 6.11836 4.19125 7.76388 4.17443C8.85717 4.15762 9.88326 4.95819 10.5455 4.95819C11.2078 4.95819 12.4516 3.99006 13.7652 4.12408C14.3103 4.14931 15.8159 4.33173 16.8086 5.75485C16.7175 5.81329 15.0552 6.82506 15.0721 8.87173C15.0889 11.3163 17.1324 12.0844 17.1493 12.1008C17.1325 12.1513 16.8086 13.2482 16.0395 16.9658ZM13.0399 2.51895C13.6853 1.76391 14.1463 0.703435 14.0216 0C13.0793 0.0346786 11.9356 0.652836 11.2398 1.4079C10.6113 2.09554 10.0662 3.24002 10.2078 4.2602C11.2398 4.34326 12.3415 3.65561 13.0399 2.51895Z" />
        </svg>
        <span className="font-medium">Apple Sign In unavailable</span>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="w-full flex items-center justify-center gap-3 bg-black text-white hover:bg-gray-900 border-black"
      onClick={handleAppleLogin}
      disabled={isLoading || !isSDKLoaded}
      aria-label="Sign in with Apple"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16.0395 16.9658C15.2997 18.2108 14.4866 19.4449 13.3261 19.4617C12.1824 19.4785 11.8086 18.744 10.4951 18.744C9.18157 18.744 8.77398 19.4449 7.69748 19.4785C6.57056 19.5121 5.66607 18.1323 4.91946 16.8932C3.39267 14.3643 2.23053 9.7346 3.82432 6.68891C4.61272 5.17779 6.11836 4.19125 7.76388 4.17443C8.85717 4.15762 9.88326 4.95819 10.5455 4.95819C11.2078 4.95819 12.4516 3.99006 13.7652 4.12408C14.3103 4.14931 15.8159 4.33173 16.8086 5.75485C16.7175 5.81329 15.0552 6.82506 15.0721 8.87173C15.0889 11.3163 17.1324 12.0844 17.1493 12.1008C17.1325 12.1513 16.8086 13.2482 16.0395 16.9658ZM13.0399 2.51895C13.6853 1.76391 14.1463 0.703435 14.0216 0C13.0793 0.0346786 11.9356 0.652836 11.2398 1.4079C10.6113 2.09554 10.0662 3.24002 10.2078 4.2602C11.2398 4.34326 12.3415 3.65561 13.0399 2.51895Z" />
      </svg>
      <span className="font-medium">
        {isLoading
          ? "Signing in..."
          : !isSDKLoaded
            ? "Loading..."
            : "Continue with Apple"}
      </span>
    </Button>
  );
}
