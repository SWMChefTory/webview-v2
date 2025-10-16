import "@/styles/globals.css";
import type { AppProps } from "next/app";
import useInit from "@/src/app/init";
import { QueryClient, QueryClientProvider, HydrationBoundary } from "@tanstack/react-query";
import { useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  useInit();
  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={pageProps.dehydratedState}>
        <Component {...pageProps} />
        <div className="pb-safe"></div>
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
