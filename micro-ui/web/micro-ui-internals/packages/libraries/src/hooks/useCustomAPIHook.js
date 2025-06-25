import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { CustomService } from "../services/elements/CustomService";

/**
 * Custom hook which can make api call and format response
 *
 * @author jagankumar-egov
 *
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
      gcTime: 100,
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

  const stableBody = useMemo(() => JSON.stringify(body), [body]);

  const queryKey = useMemo(() => [url, changeQueryName, stableBody], [url, changeQueryName, stableBody]);

  const fetchData = async () => {
    try {
      const response = await CustomService.getResponse({
        url,
        params,
        body,
        plainAccessRequest,
        headers,
        method,
        ...options,
      });
      return response || null;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  const {
    isLoading,
    isFetching,
    data,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: fetchData,
    gcTime: options?.cacheTime || 1000,       // cacheTime is renamed to gcTime in v5
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
        client.invalidateQueries({ queryKey });
      }
    },
  };
};

export default useCustomAPIHook;
