import { useRouter } from "next/router";
import { motion } from "motion/react";
import { ShieldAlert, Home, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ChallengeErrorFallbackProps {
  resetErrorBoundary: () => void;
}

export function ChallengeErrorFallback({
  resetErrorBoundary,
}: ChallengeErrorFallbackProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md rounded-2xl border border-gray-200/70 bg-white/80 p-6 shadow-sm backdrop-blur-sm"
      >
        {/* 헤더 아이콘 */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100">
          <ShieldAlert className="h-7 w-7 text-orange-500" />
        </div>

        {/* 타이틀/설명 */}
        <h2 className="mb-2 text-center text-xl font-bold tracking-tight text-gray-900">
          챌린지 정보를 불러올 수 없어요
        </h2>
        <p className="mb-6 text-center text-sm text-gray-600">
          네트워크 연결을 확인하고 다시 시도해주세요.
        </p>

        {/* 액션 */}
        <div className="flex flex-col gap-3">
          <button
            onClick={resetErrorBoundary}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 active:scale-[0.99]"
          >
            <RefreshCw className="h-4 w-4" />
            다시 시도
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center gap-2 rounded-full border border-gray-300/70 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" />
              뒤로가기
            </button>

            <Link
              href="/"
              className="flex items-center justify-center gap-2 rounded-full border border-gray-300/70 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-gray-50"
            >
              <Home className="h-4 w-4" />
              홈으로
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
