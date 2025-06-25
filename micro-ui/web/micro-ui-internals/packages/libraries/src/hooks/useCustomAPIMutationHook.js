import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  const mutation = Digit.Hooks.useCustomAPIMutationHook(...requestCriteria);


while mutating use the following format 

mutation.mutate({
          params: {},
          body: { "payload": {
                   // custom data
                } 
          }},
          {
            onError : ()=> { // custom logic},
            onSuccess : ()=> { // custom logic}
          }
        );

 *
 * @returns {Object} Returns the object which contains data and isLoading flag
 */

const useCustomAPIMutationHook = ({
  url,
  params = {},
  body = {},
  headers = {},
  method = "POST",
  config = {},
  plainAccessRequest,
  changeQueryName = "Random",
}) => {
  const client = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) =>
      CustomService.getResponse({
        url,
        params: { ...params, ...data?.params },
        body: { ...body, ...data?.body },
        headers: { ...headers, ...data?.headers },
        plainAccessRequest,
        method,
      }),
    gcTime: 0, // cacheTime is now gcTime in v5
    ...config,
  });

  const { isPending: isLoading, data, isSuccess, isError, isIdle, mutate, mutateAsync, ...rest } = mutation;

  return {
    ...rest,
    isLoading,
    data,
    mutate,
    mutateAsync,
    isSuccess,
    isError,
    isIdle,
    revalidate: () => {
      if (data) {
        client.invalidateQueries({ queryKey: [url].filter(Boolean) });
      }
    },
  };
};

export default useCustomAPIMutationHook;
