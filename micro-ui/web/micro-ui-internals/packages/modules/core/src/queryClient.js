import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15 * 60 * 1000,
      gcTime: 50 * 60 * 1000,
      retry: false,
      retryDelay: (attemptIndex) => Infinity,
    },
  },
});
