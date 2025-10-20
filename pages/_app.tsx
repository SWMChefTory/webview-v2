// _app.tsx (pages 라우터)
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider, HydrationBoundary } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import useInit from "@/src/app/init";
import { onUnblockingRequest } from "@/src/shared/client/native/client";
import { UNBLOCKING_HANDLER_TYPE } from "@/src/shared/client/native/unblockingHandlerType";
import { RecipeCreationInfoSchema } from "@/src/pages/home/entities/creating_info/recipeCreationInfo";
import { toast, Toaster } from "sonner";
import { useCreateRecipe } from "@/src/entities/user_recipe/model/useUserRecipe";

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
    if (error) toast.error("레시피 생성 중 오류가 발생했습니다.");
  }, [error]);

  useEffect(() => {
    if (isLoading) toast("레시피 생성 중...");
  }, [isLoading]);

  return (
    <HydrationBoundary state={pageProps.dehydratedState}>
      <Toaster />
      <Component {...pageProps} />
    </HydrationBoundary>
  );
}
