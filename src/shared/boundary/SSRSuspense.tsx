import { Suspense, useEffect, useState } from "react";

export const SSRSuspense = (props: React.ComponentProps<typeof Suspense>) => {
  const { fallback, children } = props;

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <>{fallback}</>;
  }
  
  return <Suspense fallback={fallback}>{children}</Suspense>;
};
