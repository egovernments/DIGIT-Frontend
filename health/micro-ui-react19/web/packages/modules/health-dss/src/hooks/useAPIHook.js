import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { CustomService } from "../services/CustomService";

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

  const stableBody = useMemo(() => JSON.stringify(body), [body]);
  const queryKey = useMemo(() => [url, changeQueryName, stableBody], [url, changeQueryName, stableBody]);

  const fetchData = async () => {
    try {
      const response = await CustomService.getResponse({ url, params, body, plainAccessRequest, headers, method, ...options });
      return response || null;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  const { isLoading, data, isFetching, refetch } = useQuery({
    queryKey,
    queryFn: fetchData,
    gcTime: options?.gcTime || 1000,
    staleTime: options?.staleTime || 5000,
    placeholderData: (prev) => prev,
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
        client.invalidateQueries({ queryKey });
      }
    },
  };
};

export default useAPIHook;