import { QueryClient } from "@tanstack/react-query";

// Global React Query Client configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Don't refetch when switching tabs
      retry: 1, // Retry failing queries just once
      staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
      cacheTime: 10 * 60 * 1000, // Cache is kept for 10 minutes
    }}});
