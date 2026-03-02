// _app.tsx (pages 라우터)
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Suspense, useEffect, useState } from "react";
import { communication } from "@/src/shared/client/native/client";
import {
  MODE,
  onUnblockingRequest,
  request,
} from "@/src/shared/client/native/client";
import { UNBLOCKING_HANDLER_TYPE } from "@/src/shared/client/native/unblockingHandlerType";
import { RecipeCreationInfoSchema } from "@/src/views/home/entities/creating_info/recipeCreationInfo";
import { useRouter } from "next/router";
import { motion } from "motion/react";
import { WiCloud } from "react-icons/wi";
import { Toaster } from "sonner";
import {
  QueryClient,
  QueryClientProvider,
  HydrationBoundary,
  QueryErrorResetBoundary,
  useQueryClient,
} from "@tanstack/react-query";
import { RecipeCreatingView } from "@/src/widgets/recipe-creating-form/recipeCreatingForm";
import { useRecipeCreatingViewOpenStore } from "@/src/widgets/recipe-creating-form/recipeCreatingFormOpenStore";
import { CreditRechargeModal } from "@/src/widgets/credit-recharge-modal/ui";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "react-error-boundary";
import { appWithTranslation } from "next-i18next";
import { useAmplitude } from "@/src/shared/analytics/useAmplitude";
import { Agentation } from "agentation";
import { useOnboardingStore } from "@/src/views/onboarding/stores/useOnboardingStore";
import { authEventBus } from "@/src/shared/client/main/authEventBus";
import {
  getMainAccessToken,
  setMainAccessToken,
  setMainRefreshToken,
  clearAuthTokens,
} from "@/src/shared/client/main/client";
import { isNativeApp, isWebBrowser } from "@/src/shared/lib/platform";
import { useFetchRecipe } from "@/src/entities/recipe";

export default appWithTranslation(App);

function App(props: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            retryDelay: 1000,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchOnMount: false,
          },
        },
      }),
  );
  useAmplitude();

  useEffect(() => {
    authEventBus.register(() => {
      clearAuthTokens();
      queryClient.clear();

      if (isNativeApp()) {
        window.ReactNativeWebView!.postMessage(
          JSON.stringify({ type: "LOGOUT" }),
        );
        return;
      }
      // 이미 /auth에 있으면 새로고침 방지
      if (window.location.pathname.endsWith("/auth")) return;
      // 현재 경로를 redirect 파라미터로 전달하여 로그인 후 복귀
      const currentPath = window.location.pathname + window.location.search;
      window.location.href = `/auth?redirect=${encodeURIComponent(currentPath)}`;
    });

    return () => {
      authEventBus.unregister();
    };
  }, [queryClient]);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AppInner {...props} />
      </QueryClientProvider>
      {process.env.NODE_ENV === "development" && <Agentation />}
    </>
  );
}

enum loadingRequestType {
  LOAD_START = "LOAD_START",
  LOAD_END = "LOAD_END",
}

function AppInner({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useInit();
  const { open } = useRecipeCreatingViewOpenStore();
  const [recipeDetailLinkUrl, setRecipeDetailLinkUrl] = useState<
    string | undefined
  >(undefined);
  const { isOnboardingCompleted, _hasHydrated } = useOnboardingStore();

  useEffect(() => {
    // hydration 완료 전에는 라우팅 결정하지 않음
    if (!_hasHydrated) return;

    // 온보딩 미완료 시 온보딩 페이지로 교체 (뒤로가기 방지)
    // /auth는 스킵: 로그인 전에는 온보딩 리다이렉트 불필요
    if (
      !isOnboardingCompleted &&
      router.pathname !== "/onboarding" &&
      router.pathname !== "/auth"
    ) {
      router.replace("/onboarding");
    }
  }, [_hasHydrated, isOnboardingCompleted, router.pathname]);

  // 웹 브라우저 전용: 토큰 없으면 /auth로 리다이렉트
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isNativeApp()) return;
    if (router.pathname === "/auth") return;

    const token = getMainAccessToken();
    if (!token) {
      // 현재 경로를 redirect 파라미터로 전달하여 로그인 후 복귀
      router.replace(`/auth?redirect=${encodeURIComponent(router.asPath)}`);
    }
  }, [router.pathname]);

  function handleRecipeDeepLink({ path }: { path: string }) {
    const recipeId = path.split("/")[2];
    if (!recipeId) return;
    if (router.asPath === `/recipe/${recipeId}/detail`) {
      return;
    }
    if (router.asPath === `/recipe/${recipeId}/step`) {
      return;
    }
    setRecipeDetailLinkUrl(path);
  }

  useEffect(() => {
    request(MODE.BLOCKING, "CONSUME_INITIAL_DATA").then((result) => {
      if (result.messagesConsumed.length <= 0) return;
      for (const message of result.messagesConsumed) {
        if (message.type === "OPEN_CREATING_VIEW") {
          const info = RecipeCreationInfoSchema.parse(message.data);
          open(info.videoUrl, "external_share");
          return;
        }
        if (message.type === "ROUTE") {
          handleRecipeDeepLink({ path: message.data.route });
        }
      }
    });
  }, []);

  function nextPaint() {
    return new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );
  }

  useEffect(() => {
    (async () => {
      await nextPaint();
      request(MODE.UNBLOCKING, loadingRequestType.LOAD_END);
    })();
  }, []);

  useEffect(() => {
    const cleanup = onUnblockingRequest(
      UNBLOCKING_HANDLER_TYPE.OPEN_CREATING_VIEW,
      (_type, payload) => {
        const info = RecipeCreationInfoSchema.parse(payload);
        open(info.videoUrl, "external_share");
      },
    );
    return cleanup;
  }, []);

  useEffect(() => {
    const cleanup = onUnblockingRequest(
      UNBLOCKING_HANDLER_TYPE.ROUTE,
      (_type, payload) => {
        handleRecipeDeepLink({ path: payload.route });
      },
    );
    return () => {
      cleanup();
    };
  }, []);

  // Zustand persist hydration 완료 전에는 아무것도 렌더링하지 않음
  // → 새 사용자: 홈 화면이 먼저 보이는 flash 방지
  // → 기존 사용자: 온보딩으로 잘못 리다이렉트되는 것 방지
  if (!_hasHydrated) {
    return (
      <div className="h-dvh bg-gradient-to-b from-orange-50 via-white to-white" />
    );
  }

  return (
    <HydrationBoundary state={pageProps.dehydratedState}>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            fallbackRender={({ error, resetErrorBoundary }) => (
              <NetworkFallback
                error={error}
                onRetry={async () => {
                  resetErrorBoundary();
                  reset();
                }}
              />
            )}
          >
            <Toaster />
            <Component {...pageProps} />
            <RecipeCreatingView />
            <CreditRechargeModal />
            {recipeDetailLinkUrl && (
              <Suspense>
                <RouteDialog
                  deepLinkUrl={recipeDetailLinkUrl}
                  setDeepLinkUrl={setRecipeDetailLinkUrl}
                />
              </Suspense>
            )}
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </HydrationBoundary>
  );
}

export function NetworkFallback({
  onRetry,
}: {
  error: unknown;
  onRetry: () => void;
}) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-[100vh] text-center px-4 py-10 bg-orange-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-4"
      >
        <WiCloud className="text-orange-400" size={80} />
      </motion.div>

      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-600 text-xl mb-6 font-bold"
      >
        네트워크 연결이 끊어졌어요
      </motion.p>

      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-600 mb-6"
      >
        네트워크를 확인하고 다시 시도해주세요!
      </motion.p>

      <motion.button
        whileTap={{ scale: 0.95 }}
        className="bg-orange-500 text-white font-semibold px-5 py-2 rounded-full shadow-md hover:bg-orange-600 transition"
        onClick={async () => {
          onRetry?.();
          queryClient.clear();
          await router.replace("/");
        }}
      >
        다시 시도하기
      </motion.button>
    </div>
  );
}

function RouteDialog({
  deepLinkUrl,
  setDeepLinkUrl,
}: {
  deepLinkUrl: string;
  setDeepLinkUrl: (deepLinkUrl: string | undefined) => void;
}) {
  const router = useRouter();
  const recipeId = deepLinkUrl.split("/")[2];
  const { data: recipe } = useFetchRecipe(recipeId!);
  const recipeTitle = recipe.videoInfo.videoTitle;

  return (
    <>
      <Dialog.Root open={true}>
        <Dialog.Overlay
          className="fixed inset-0 bg-black/50 z-[99]"
          onClick={() => setDeepLinkUrl(undefined)}
        />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] bg-white rounded-lg p-6 flex flex-col gap-2 z-[100]">
          <Dialog.Title className="text-center font-bold">
            {recipeTitle}
          </Dialog.Title>
          <Dialog.Description className="text-center text-sm text-gray-600">
            해당 레시피로 이동하시겠습니까?
          </Dialog.Description>
          <div className="h-[12]"></div>
          <div className="flex flex-1 gap-2">
            <Button
              variant="outline"
              className="flex-1 "
              onClick={() => setDeepLinkUrl(undefined)}
            >
              취소
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                router.push(deepLinkUrl);
                setDeepLinkUrl(undefined);
              }}
            >
              이동
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}

const useInit = () => {
  useEffect(() => {
    // 웹 브라우저 환경에서만 URL 파라미터 추출
    if (isWebBrowser()) {
      const params = new URLSearchParams(window.location.search);
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      const locale = params.get("locale");
      const isRecharge = params.get("recharge");

      // 토큰이 있으면 localStorage에 저장
      if (accessToken && refreshToken) {
        setMainAccessToken(accessToken);
        setMainRefreshToken(refreshToken);

        // locale도 저장 (i18n 설정용)
        if (locale) {
          localStorage.setItem("locale", locale);
        }

        // 보안: URL에서 파라미터 제거 (브라우저 히스토리에 남지 않도록)
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);

        console.log("[WebView] Tokens saved from URL parameters");
      }

      // 충전 복귀 처리
      if (isRecharge === "true") {
        window.dispatchEvent(new CustomEvent("rechargeComplete"));
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, "", cleanUrl);
      }
    }

    // Native bridge communication (기존 로직 유지)
    if (isNativeApp()) {
      //사파리 전용
      window.addEventListener("message", communication);
      //크로미움 전용
      document.addEventListener("message" as any, communication);
    }

    return () => {
      console.log("brigdeEnd");
      if (isNativeApp()) {
        window.removeEventListener("message", communication);
        document.removeEventListener("message" as any, communication);
      }
    };
  }, []);

  // return { isAuthenticated: !!user, isLoading, error };
};
