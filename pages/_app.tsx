// _app.tsx (pages 라우터)
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import {
  QueryClient,
  QueryClientProvider,
  HydrationBoundary,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";
import useInit from "@/src/app/init";
import { onUnblockingRequest } from "@/src/shared/client/native/client";
import { UNBLOCKING_HANDLER_TYPE } from "@/src/shared/client/native/unblockingHandlerType";
import { RecipeCreationInfoSchema } from "@/src/pages/home/entities/creating_info/recipeCreationInfo";
import { toast, Toaster } from "sonner";
import { useCreateRecipe } from "@/src/entities/user_recipe/model/useUserRecipe";
import { useRouter } from "next/router";
import { SSRErrorBoundary } from "@/src/shared/boundary/SSRErrorBoundary";
import { motion } from "motion/react";
import { WiCloud } from "react-icons/wi";
import { QueryErrorResetBoundary } from "@tanstack/react-query";

export default function App(props: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  useInit();

  return (
    <QueryClientProvider client={queryClient}>
      <AppInner {...props} />
    </QueryClientProvider>
  );
}

function AppInner({ Component, pageProps }: AppProps) {
  const { create, error, isLoading } = useCreateRecipe();
  const router = useRouter();

  useEffect(() => {
    const cleanup = onUnblockingRequest(
      UNBLOCKING_HANDLER_TYPE.RECIPE_CREATE,
      (_type, payload) => {
        const info = RecipeCreationInfoSchema.parse(payload);
        create({
          youtubeUrl: info.videoUrl,
          targetCategoryId: info.categoryId || null,
        });
      }
    );
    return cleanup;
  }, [create]);

  useEffect(() => {
    const cleanup = onUnblockingRequest(
      UNBLOCKING_HANDLER_TYPE.ROUTE,
      (_type, payload) => {
        // 같은 경로면 무시

        router.push(payload.route); // 일단 주석
      }
    );

    return () => {
      cleanup();
    };
  }, [router]);

  useEffect(() => {
    if (error) toast.error("레시피 생성 중 오류가 발생했습니다.");
  }, [error]);

  useEffect(() => {
    if (isLoading) toast("레시피 생성 중...");
  }, [isLoading]);

  return (
    <HydrationBoundary state={pageProps.dehydratedState}>
      <QueryErrorWrapper>
        <Toaster />
        <Component {...pageProps} />
      </QueryErrorWrapper>
    </HydrationBoundary>
  );
}

export function QueryErrorWrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <SSRErrorBoundary
          fallback={<NetworkFallback resetErrorBoundary={reset} />}
        >
          {children}
        </SSRErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

export function NetworkFallback({
  resetErrorBoundary,
}: {
  resetErrorBoundary: () => void;
}) {
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
        className="text-gray-600 text-xl mb-6"
      >
        네트워크에 연결이 끊어졌어요
      </motion.p>

      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-600 text-sm mb-6"
      >
        네트워크를 확인하고 다시 시도해주세요!
      </motion.p>

      <motion.button
        whileTap={{ scale: 0.95 }}
        className="bg-orange-500 text-white font-semibold px-5 py-2 rounded-full shadow-md hover:bg-orange-600 transition"
        onClick={() => resetErrorBoundary()}
      >
        다시 시도하기
      </motion.button>
    </div>
  );
}
