import {
  CredentialResponse,
  GoogleLogin,
  GoogleOAuthProvider,
} from "@react-oauth/google";
import { useRouter } from "next/router";

import {
  OAuthProvider,
  useOAuthLogin,
} from "@/src/views/auth/hooks/useOAuthLogin";
import { useEffect, useState } from "react";

interface GoogleLoginButtonProps {
  redirectUrl: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const GoogleLoginButtonInner = ({
  onSuccess,
  onError,
  redirectUrl,
}: GoogleLoginButtonProps) => {
  const router = useRouter();
  const { loginWithIdToken } = useOAuthLogin();

  const handleFailure = () => {
    const errorMessage = "Google login failed";
    console.error(errorMessage);
    onError?.(errorMessage);
  };

  const handleRoute = () => {
    router.push(redirectUrl);
  };

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    const { credential } = credentialResponse;

    if (!credential) {
      const errorMessage = "Google login failed: No credential received";
      console.error(errorMessage);
      onError?.(errorMessage);
      return;
    }

    await loginWithIdToken({
      idToken: credential,
      provider: OAuthProvider.GOOGLE,
      onRoute: handleRoute,
      onSuccess,
      onError,
    });
  };

  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleFailure}
        useOneTap={false}
        width="100%"
        size="large"
        text="continue_with"
        shape="rectangular"
        logo_alignment="left"
      />
    </div>
  );
};

const GoogleLoginButton = (props: GoogleLoginButtonProps) => {
  const [GOOGLE_CLIENT_ID, setGOOGLE_CLIENT_ID] = useState<string | undefined>(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

  if (GOOGLE_CLIENT_ID === undefined) {
    return (
      <div className="w-full p-4 border border-red-300 bg-red-50 rounded-lg text-center text-sm text-red-600">
        Google login is not configured. Please check your environment variables.
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <GoogleLoginButtonInner {...props} />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;
