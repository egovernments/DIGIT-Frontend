import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Request } from "./Request";

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

const useCustomAPIMutationHook = ({ url, params, body, headers, method, useCache=true,userService=true,setTimeParam=true ,userDownload=false, config = {}, plainAccessRequest, changeQueryName = "Random" }) => {
  const client = useQueryClient();

  const { isLoading, data, isFetching, ...rest } = useMutation({
    mutationFn: (data) => Request({
      url: url,
      data: { ...body, ...data?.body },
      useCache,
      userService,
      headers: headers,
      method: method,
      auth: true,
      params: { ...params, ...data?.params },
      plainAccessRequest: plainAccessRequest,
      userDownload: userDownload,
      setTimeParam
    }),
    gcTime: 0,
    ...config,
  });

  return {
    ...rest,
    isLoading,
    isFetching,
    data,
    revalidate: () => {
      data && client.invalidateQueries({ queryKey: [url].filter((e) => e) });
    },  
  };
};

export default useCustomAPIMutationHook;