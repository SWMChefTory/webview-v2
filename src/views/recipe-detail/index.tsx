import { ResponsiveSwitcher } from "@/src/shared/ui/responsive";
import {
  RecipeDetailPageReadyMobile,
  RecipeDetailPageSkeletonMobile,
} from "./mobile/index.mobile";
import {
  RecipeDetailPageReadyTablet,
  RecipeDetailPageSkeletonTablet,
} from "./tablet/index.tablet";
import {
  RecipeDetailPageReadyDesktop,
  RecipeDetailPageSkeletonDesktop,
} from "./desktop/index.desktop";
import { SSRErrorBoundary } from "@/src/shared/boundary/SSRErrorBoundary";
import { SSRSuspense } from "@/src/shared/boundary/SSRSuspense";
import axios from "axios";
import { useRouter } from "next/router";

import { motion } from "motion/react";
import { ShieldAlert, Home, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRecipeDetailTranslation } from "./common/hook/useRecipeDetailTranslation";

const RecipeDetailPage = () => {
  const router = useRouter();
  const id = router.query.id as string | undefined;

  return (
    <div className="w-full h-dvh bg-white">
      <ConditionalBoundary recipeId={id}>
        <SSRSuspense fallback={<RecipeDetailPageSkeleton />}>
          {id ? (
            <RecipeDetailPageReady id={id} />
          ) : (
            <RecipeDetailPageSkeleton />
          )}
        </SSRSuspense>
      </ConditionalBoundary>
    </div>
  );
};

export const RecipeDetailPageSkeleton = () => {
  return (
    <ResponsiveSwitcher
      mobile={RecipeDetailPageSkeletonMobile}
      tablet={RecipeDetailPageSkeletonTablet}
      desktop={RecipeDetailPageSkeletonDesktop}
      props={{}}
    />
  );
};

export const RecipeDetailPageReady = ({ id }: { id: string }) => {
  return (
    <ResponsiveSwitcher
      mobile={RecipeDetailPageReadyMobile}
      tablet={RecipeDetailPageReadyTablet}
      desktop={RecipeDetailPageReadyDesktop}
      props={{ id }}
    />
  );
};

const isWantedError = (e: unknown) => {
  if (axios.isAxiosError(e) && e.response?.data?.errorCode === "RECIPE_001") {
    return true;
  }
  return false;
};

function ConditionalBoundary({
  children,
  recipeId,
}: {
  children: React.ReactNode;
  recipeId?: string;
}) {
  return (
    <SSRErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) =>
        isWantedError(error) ? (
          <SectionFallback
            error={error}
            resetErrorBoundary={resetErrorBoundary}
            recipeId={recipeId}
          />
        ) : (
          // 원하지 않는 에러는 "그대로 터지게" 해서 상위 바운더리로 올리기
          (() => {
            throw error;
          })()
        )
      }
    >
      {children}
    </SSRErrorBoundary>
  );
}

type SectionFallbackProps = {
  error?: unknown;
  resetErrorBoundary: () => void;
  homeHref?: string;
  backHref?: string;
  recipeId?: string;
};

export function SectionFallback({
  error,
  resetErrorBoundary,
  homeHref = "/",
  backHref,
  recipeId,
}: SectionFallbackProps) {
  const router = useRouter();
  const { t } = useRecipeDetailTranslation();

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md rounded-2xl border border-gray-200/70 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
      >
        {/* 헤더 아이콘 */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 dark:bg-orange-500/20">
          <ShieldAlert className="h-7 w-7 text-orange-500 dark:text-orange-300" />
        </div>

        {/* 타이틀/설명 */}
        <h2 className="mb-2 text-center text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          {t("error.title")}
        </h2>
        <p className="mb-6 text-center text-sm text-gray-600 dark:text-gray-300">
          {t("error.description")}
        </p>

        {/* 액션 */}
        <div className="flex flex-col gap-3">
          {/* 다시 시도 */}
          <button
            onClick={resetErrorBoundary}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 active:scale-[0.99]"
          >
            <RefreshCw className="h-4 w-4" />
            {t("error.retry")}
          </button>

          {/* 뒤로가기 / 홈으로 */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => (backHref ? router.push(backHref) : router.back())}
              className="flex items-center justify-center gap-2 rounded-full border border-gray-300/70 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-gray-50 dark:border-white/15 dark:bg-white/10 dark:text-gray-100 dark:hover:bg-white/15"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("error.back")}
            </button>

            <Link
              href={homeHref}
              className="flex items-center justify-center gap-2 rounded-full border border-gray-300/70 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-gray-50 dark:border-white/15 dark:bg-white/10 dark:text-gray-100 dark:hover:bg-white/15"
            >
              <Home className="h-4 w-4" />
              {t("error.home")}
            </Link>
          </div>
        </div>

        {/* (선택) 디버그 텍스트 */}
        {/* <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          {axios.isAxiosError(error) ? (error.response?.data?.errorCode || error.message) : ""}
        </p> */}
      </motion.div>
    </div>
  );
}

export default RecipeDetailPage;