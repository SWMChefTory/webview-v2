// _app.tsx (pages 라우터)
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import useInit from "@/src/app/init";
import {
  MODE,
  onUnblockingRequest,
  request,
} from "@/src/shared/client/native/client";
import { UNBLOCKING_HANDLER_TYPE } from "@/src/shared/client/native/unblockingHandlerType";
import { RecipeCreationInfoSchema } from "@/src/pages/home/entities/creating_info/recipeCreationInfo";
import { Toaster } from "sonner";
import { useRouter } from "next/router";
import { SSRErrorBoundary } from "@/src/shared/boundary/SSRErrorBoundary";
import { motion } from "motion/react";
import { WiCloud } from "react-icons/wi";
import {
  QueryClient,
  QueryClientProvider,
  HydrationBoundary,
  QueryErrorResetBoundary,
  useQueryClient,
} from "@tanstack/react-query";
import { RecipeCreatingView } from "@/src/widgets/recipe-creating-view/recipeCreatingView";
import { useRecipeCreatingViewOpenStore } from "@/src/widgets/recipe-creating-view/recipeCreatingViewOpenStore";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";

// import  Toaster  from "@/components/ui/sonner";

export default function App(props: AppProps) {
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
      })
  );

  useInit();

  return (
    <QueryClientProvider client={queryClient}>
      <AppInner {...props} />
    </QueryClientProvider>
  );
}

enum loadingRequestType {
  LOAD_START = "LOAD_START",
  LOAD_END = "LOAD_END",
}

function AppInner({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { open } = useRecipeCreatingViewOpenStore();
  const [recipeDetailLinkUrl, setRecipeDetailLinkUrl] = useState<
    string | undefined
  >(undefined);

  function handleRecipeDeepLink({path}: {path: string}) {
    const recipeId = path.split('/')[2];
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
          open(info.videoUrl);
          return;
        }
        if (message.type === "ROUTE") {
          handleRecipeDeepLink({path: message.data.route});
        }
      }
    });
  }, []);

  function nextPaint() {
    return new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
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
        console.log(JSON.stringify(info, null, 2));
        open(info.videoUrl);
      }
    );
    return cleanup;
  }, []);

  useEffect(() => {
    const cleanup = onUnblockingRequest(
      UNBLOCKING_HANDLER_TYPE.ROUTE,
      (_type, payload) => {
        handleRecipeDeepLink({path: payload.route});
      }
    );
    return () => {
      cleanup();
    };
  }, [router]);

  return (
    <HydrationBoundary state={pageProps.dehydratedState}>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <SSRErrorBoundary
            onReset={reset}
            fallbackRender={({ resetErrorBoundary }) => (
              <NetworkFallback
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
            {recipeDetailLinkUrl && (
              <RouteDialog
                deepLinkUrl={recipeDetailLinkUrl}
                setDeepLinkUrl={setRecipeDetailLinkUrl}
              />
            )}
          </SSRErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </HydrationBoundary>
  );
}

export function NetworkFallback({ onRetry }: { onRetry: () => void }) {
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
          console.log("다시 시도하기");

          // 1) 바운더리 리셋
          onRetry?.();

          // 2) 쿼리 캐시/에러 상태 제거
          queryClient.clear(); // 또는 queryClient.removeQueries();

          // 3) 홈으로 이동 (필요시 하드 리로드)
          await router.replace("/");
          // 하드 리로드가 확실히 필요하면:
          // window.location.href = "/";
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
  return (
    <>
      <Dialog.Root open={true}>
        <Dialog.Overlay
          className="fixed inset-0 bg-black/50"
          onClick={() => setDeepLinkUrl(undefined)}
        />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] bg-white rounded-lg p-6 flex flex-col gap-2">
          <Dialog.Title className="text-center">
            해당 레시피로 이동하시겠습니까?
          </Dialog.Title>
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
