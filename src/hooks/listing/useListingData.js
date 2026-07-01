import { useInfiniteQuery } from "@tanstack/react-query";
import http from "../../lib/axios";

export const useListingData = (endpoint, queryKeyPrefix, queryParams) => {
  return useInfiniteQuery({
    queryKey: [queryKeyPrefix, ...Object.values(queryParams)],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const res = await http.get(endpoint, {
        params: {
          page: pageParam,
          limit: 12,
          ...Object.fromEntries(
            Object.entries(queryParams).filter(([_, v]) => v !== undefined && v !== "")
          ),
        },
      });
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage?.hasNextPage && lastPage?.currentPage < lastPage?.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
};
