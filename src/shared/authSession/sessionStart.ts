import { z } from "zod";
import privateClient from "./privateClient";
import { setMainAccessToken, setMainRefreshToken } from "./tokenStorage";
import { useSessionStore } from "./useSessionStore";

export enum OAuthProvider {
  GOOGLE = "GOOGLE",
  APPLE = "APPLE",
}

const OAuthLoginResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
});

/**
 * 소셜 로그인을 수행하고 토큰을 저장한다.
 */
export async function sessionStart({
  idToken,
  provider,
}: {
  idToken: string;
  provider: OAuthProvider;
}): Promise<void> {
  const response = await privateClient.post("/account/login/oauth", {
    id_token: idToken,
    provider,
  });

  const { access_token, refresh_token } = OAuthLoginResponseSchema.parse(
    response.data
  );

  setMainAccessToken(access_token);
  setMainRefreshToken(refresh_token);
  useSessionStore.getState().setLoggedIn(true);
}
