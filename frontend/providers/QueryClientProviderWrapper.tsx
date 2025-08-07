"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export default function QueryClientProviderWrapper({ children }: { children: ReactNode }) {
  // Create the QueryClient on the client side
  const [queryClient] = useState(() => new QueryClient(
    {
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // 5 minutes
          gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
          retry: 1,
          refetchOnWindowFocus: false,
        },
      },
    }
  ));
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
