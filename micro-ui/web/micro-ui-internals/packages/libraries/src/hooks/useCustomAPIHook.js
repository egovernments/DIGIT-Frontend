import { useQuery, useQueryClient } from "react-query";
import { useMemo } from "react";
import { CustomService } from "../services/elements/CustomService";

/**
 * Custom hook which can make an API call and format the response.
 *
 * @author jagankumar-egov
 *
 * @example
 * 
 const requestCriteria = [
      "/user/_search",             // API details
    {},                            //requestParam
    {data : {uuid:[Useruuid]}},    // requestBody
    {} ,                           // privacy value 
    {                              // other configs
      enabled: privacyState,
      cacheTime: 100,
      select: (data) => {
                                    // format data
        return  _.get(data, loadData?.jsonPath, value);
      },
    },
  ];
  const { isLoading, data, revalidate } = Digit.Hooks.useCustomAPIHook(...requestCriteria);

 *
 * @returns {Object} Returns the object which contains data and isLoading flag
 */

const useCustomAPIHook = ({
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

export default useCustomAPIHook;