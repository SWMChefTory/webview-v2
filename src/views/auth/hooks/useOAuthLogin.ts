import { z } from "zod";

import client, {
  setMainAccessToken,
  setMainRefreshToken,
} from "@/src/shared/client/main/client";

export const OAuthLoginResponseSchema = z.object({
  /** JWT Access Token (Bearer prefix 포함) */
  accessToken: z.string(),
  /** JWT Refresh Token (Bearer prefix 포함) */
  refreshToken: z.string(),
});

export type OAuthLoginResponse = z.infer<typeof OAuthLoginResponseSchema>;

export enum OAuthProvider {
  GOOGLE = "GOOGLE",
  APPLE = "APPLE",
}

type LoginRequest = {
  idToken: string;
  provider: OAuthProvider;
};

function isErrorWithMessage(error: unknown): error is { message: string } {
  if (typeof error !== "object" || error === null) return false;
  if (!("message" in error)) return false;
  const message = (error as Record<string, unknown>).message;
  return typeof message === "string";
}

export function handleOAuthLoginError(
  error: unknown,
  provider: OAuthProvider,
): string {
  if (isErrorWithMessage(error)) {
    return error.message;
  }

  const providerName = provider === OAuthProvider.GOOGLE ? "Google" : "Apple";
  return `${providerName} login failed. Please try again.`;
}

async function oauthLogin({ idToken, provider }: LoginRequest): Promise<OAuthLoginResponse> {
  const response = await client.post("/account/login/oauth", {
    idToken,
    provider,
  });
  return OAuthLoginResponseSchema.parse(response.data);
}

type LoginWithIdTokenParams = {
  idToken: string;
  provider: OAuthProvider;
  onRoute: () => void;
  onSuccess?: () => void;
  onError?: (error: string) => void;
};

export function useOAuthLogin() {
  const loginWithIdToken = async ({
    idToken,
    provider,
    onRoute,
    onSuccess,
    onError,
  }: LoginWithIdTokenParams) => {
    if (!idToken) {
      const errorMessage = `${provider} login failed: No idToken received`;
      console.error(errorMessage);
      onError?.(errorMessage);
      return;
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) {
      const errorMessage = "App URL is not configured";
      console.error(errorMessage);
      onError?.(errorMessage);
      return;
    }

    try {
      const response = await oauthLogin({
        idToken,
        provider,
      });

      console.log("response", response);

      const { accessToken, refreshToken } = response;
      if (typeof window !== "undefined") {
        console.log("accessToken", accessToken);
        console.log("refreshToken", refreshToken);
        setMainAccessToken(accessToken);
        setMainRefreshToken(refreshToken);
      }

      onRoute();
      onSuccess?.();
    } catch (error) {
      const errorMessage = handleOAuthLoginError(error, provider);
      console.error(`[${provider} Login Error]`, errorMessage);
      onError?.(errorMessage);
    }
  };

  return { loginWithIdToken };
}
