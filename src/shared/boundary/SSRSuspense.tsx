import { Suspense, useEffect, useState } from "react";

export const SSRSuspense = (props: React.ComponentProps<typeof Suspense>) => {
  const { fallback } = props;   

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isMounted) {
    return <Suspense {...props} />;
  }
  return <>{fallback}</>;
};
