import { useEffect, useState } from "react";
import client from "@/src/shared/client/main/client";
import { initAmplitude, isAmplitudeInitialized } from "./amplitude";

/**
 * 서버에서 user_id를 조회합니다.
 * API 엔드포인트: GET /api/user_id (가정)
 *
 * TODO: 실제 API 엔드포인트로 변경 필요
 */
const fetchUserId = async (): Promise<string | null> => {
  try {
    const response = await client.get<{ userId: string }>("/api/user_id");
    return response.data.userId;
  } catch (error) {
    console.error("[Amplitude] Failed to fetch userId:", error);
    return null;
  }
};

/**
 * Amplitude 초기화 hook
 *
 * 앱 최상위 레벨에서 한 번만 호출합니다.
 * 서버에서 user_id를 받아와 Amplitude를 초기화합니다.
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
      const userId = await fetchUserId();

      if (userId) {
        initAmplitude(userId);
        setIsReady(true);
      } else {
        console.warn("[Amplitude] Could not initialize - no userId available");
      }
    };

    init();
  }, []);

  return { isReady };
};
