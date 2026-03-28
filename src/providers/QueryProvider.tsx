"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, type ReactNode } from "react";

export default function QueryProvider({ children }: { children: ReactNode }) {
  // Une instance QueryClient par session utilisateur
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Les données restent fraîches 1 minute avant un refetch automatique
            staleTime: 60 * 1000,
            // Retry automatique une seule fois en cas d'erreur
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools visibles uniquement en développement */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
