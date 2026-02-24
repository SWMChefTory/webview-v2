import { useEffect, useState } from "react";
import { request, MODE } from "@/src/shared/client/native/client";

const GET_APP_VERSION = "GET_APP_VERSION";

export const useNativeVersion = () => {
  const [nativeVersion, setNativeVersion] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    const fetchNativeVersion = async () => {
      try {
        const response = await request<{ appVersion: string }>(
          MODE.BLOCKING,
          GET_APP_VERSION,
          undefined,
          1000
        );
        if (response?.appVersion) {
          setNativeVersion(response.appVersion);
        }
      } catch (error) {
        console.error("[useNativeVersion] Failed to fetch native version:", error);
        // Fallback to null if not in native environment
        setNativeVersion(null);
      }
    };

    fetchNativeVersion();
  }, []);

  return { nativeVersion };
};
