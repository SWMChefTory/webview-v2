import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface SSRErrorBoundaryProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
}

export const SSRErrorBoundary = ({
  fallback,
  children,
}: SSRErrorBoundaryProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <>{fallback}</>;
  }

  return <ErrorBoundary fallback={fallback}>{children}</ErrorBoundary>;
};
