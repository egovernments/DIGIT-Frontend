import { CustomService } from "../services/CustomService";
import { useQuery, useQueryClient } from "react-query";
import { useMemo } from "react";

const useAPIHook = ({
  url,
  params = {},
  body = {},
  config = {},
  headers = {},
  method = "POST",
  plainAccessRequest,
  changeQueryName = "Random",
  options = {},
}) => {
  const client = useQueryClient();

  // Memoize body to prevent unnecessary re-fetching
  const stableBody = useMemo(() => JSON.stringify(body), [body]);

  const queryKey = useMemo(() => [url, changeQueryName, stableBody], [url, changeQueryName, stableBody]);

  // Fetch function with error handling
  const fetchData = async () => {
    try {
      const response = await CustomService.getResponse({ url, params, body, plainAccessRequest, headers, method, ...options });
      return response || null; // Ensure it never returns undefined
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // React Query will handle retries if needed
    }
  };

  const { isLoading, data, isFetching, refetch } = useQuery(queryKey, fetchData, {
    cacheTime: options?.cacheTime || 1000, 
    staleTime: options?.staleTime || 5000,
    keepPreviousData: true, 
    retry: 2,
    refetchOnWindowFocus: false,
    ...config,
  });

  return {
    isLoading,
    isFetching,
    data,
    refetch,
    revalidate: () => {
      if (data) {
        client.invalidateQueries(queryKey);
      }
    },
  };
};


export default useAPIHook;