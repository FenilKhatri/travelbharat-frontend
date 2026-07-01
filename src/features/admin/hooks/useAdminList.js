import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import http from "../../../lib/axios";

export const useAdminList = ({ queryKey, endpoint, defaultLimit = 10, extractParams = () => ({}) }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  
  // Allow caller to extract their specific params (stateId, role, etc)
  const extraParams = extractParams(searchParams);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [queryKey, page, search, ...Object.values(extraParams)],
    queryFn: async () => {
      const params = { page, limit: defaultLimit };
      if (search) params.search = search;
      
      // Merge and clean extra params
      Object.entries(extraParams).forEach(([key, value]) => {
        if (value) params[key] = value;
      });
      
      const response = await http.get(endpoint, { params });
      return response?.data || response;
    },
    keepPreviousData: true
  });

  return {
    data,
    isLoading,
    isError,
    error,
    page,
    search,
    searchParams,
    setSearchParams
  };
};
