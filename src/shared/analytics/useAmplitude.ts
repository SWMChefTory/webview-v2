import { useEffect, useState } from "react";
import { z } from "zod";
import client from "@/src/shared/client/main/client";
import { initAmplitude, isAmplitudeInitialized } from "./amplitude";

/**
 * /users/me API 응답에서 providerSub 필드만 추출하는 스키마
 * 서버 응답: { provider_sub: string, ... }
 * 클라이언트 변환 후: { providerSub: string, ... }
 */
const UserProviderSubSchema = z.object({
  providerSub: z.string(),
});

/**
 * 서버에서 provider_sub를 조회합니다.
 * API 엔드포인트: GET /users/me
 *
 * @returns providerSub 값 또는 null
 */
const fetchProviderSub = async (): Promise<string | null> => {
  try {
    const response = await client.get("/users/me");
    const data = UserProviderSubSchema.parse(response.data);
    return data.providerSub;
  } catch (error) {
    console.error("[Amplitude] Failed to fetch providerSub:", error);
    return null;
  }
};

/**
 * Amplitude 초기화 hook
 *
 * 앱 최상위 레벨에서 한 번만 호출합니다.
 * 서버에서 provider_sub를 받아와 Amplitude userId로 사용합니다.
 *
 * @example
 * // _app.tsx
 * function App({ Component, pageProps }: AppProps) {
 *   useAmplitude();
 *   return <Component {...pageProps} />;
 * }
 */
export const useAmplitude = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 이미 초기화된 경우 스킵
    if (isAmplitudeInitialized()) {
      setIsReady(true);
      return;
    }

    const init = async () => {
      const providerSub = await fetchProviderSub();

      if (providerSub) {
        initAmplitude(providerSub);
        setIsReady(true);
      } else {
        console.warn("[Amplitude] Could not initialize - no providerSub available");
      }
    };

    init();
  }, []);

  return { isReady };
};
