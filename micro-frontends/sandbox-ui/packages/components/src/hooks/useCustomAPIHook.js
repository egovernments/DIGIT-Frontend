import { useQuery } from "@tanstack/react-query";
import { genericService } from "../services/genericService";
import { queryClient } from "../states/stateConfigs";

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
  params,
  body,
  config = {},
  changeQueryName = "Random",
  options,
}) => {
  const client = queryClient;

  const { isLoading, data, isFetching, refetch } = useQuery({
    queryKey: [url, JSON.stringify(params), JSON.stringify(body)].filter(
      (e) => e
    ),
    queryFn: () => genericService({ url, params, body, options }),

    cacheTime: 0,
    ...config,
  });

  return {
    isLoading,
    isFetching,
    data,
    refetch,
    revalidate: () => {
      data && client.invalidateQueries({ queryKey: [url].filter((e) => e) });
    },
  };
};

export default useCustomAPIHook;
