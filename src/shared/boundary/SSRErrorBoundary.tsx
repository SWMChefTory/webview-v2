// SSRErrorBoundary.tsx
import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface SSRErrorBoundaryProps {
  // fallback을 렌더 함수로 받아 resetErrorBoundary를 전달
  fallbackRender: (args: {
    error: unknown;
    resetErrorBoundary: () => void;
  }) => React.ReactNode;
  // QueryErrorResetBoundary의 reset을 전달받아 연결
  onReset?: () => void;
  children: React.ReactNode;
}

export const SSRErrorBoundary = ({
  fallbackRender,
  onReset,
  children,
}: SSRErrorBoundaryProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <></>;
  }

  return (
    <ErrorBoundary
      onReset={onReset}
      fallbackRender={({ error, resetErrorBoundary }) =>
        fallbackRender({ error, resetErrorBoundary })
      }
      onError={(e) => {
        console.log("[ErrorBoundary caught]", e?.name, (e as any)?.message, e);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
