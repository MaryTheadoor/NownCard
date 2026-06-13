import { createContext, useContext, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const QueryContext = createContext<QueryClient | null>(null);

export function useQueryClient() {
  const ctx = useContext(QueryContext);
  if (!ctx) throw new Error("useQueryClient must be used within QueryProvider");
  return ctx;
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryContext.Provider value={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </QueryContext.Provider>
  );
}
