import { useMutation } from "@tanstack/react-query";
import { genericService } from "../services/genericService";
import { queryClient } from "../states/stateConfigs";
/**
 * Custom hook that makes an API call using the provided default configuration and formats the response.
 *
 * @author
 * jagankumar-egov
 *
 * @example
 * // Define the default configuration for the API call
 * const defaultConfig = {
 *   url: '/user/_search',       // API endpoint URL
 *   params: {},                 // Request parameters (query params)
 *   body: { data: { uuid: [Useruuid] } }, // Request body (payload)
 *   options: {                  // Additional options such as method, headers, etc.
 *     method: 'POST',
 *   },
 * };
 *
 * // Using the custom mutation hook with the default configuration
 * const { mutation, revalidate } = useCustomAPIMutationHook(defaultConfig);
 *
 * // To mutate (make the API call) with custom parameters:
 * mutation.mutate({
 *   params: { additionalParam: 'value' }, // Override or add custom query params
 *   body: {
 *     payload: {
 *       // Custom data to send in the request body
 *     }
 *   }},
 *   {
 *     onError: () => {           // Custom error handling logic
 *       // Handle error
 *     },
 *     onSuccess: () => {         // Custom success handling logic
 *       // Handle success
 *     },
 *   }
 * );
 *
 * @returns {Object} Returns an object containing the mutation object and a revalidate function.
 */
const useCustomAPIMutationHook = (defaultConfig) => {
  const client = queryClient; // Initialize the query client

  const mutation = useMutation({
    mutationFn: async (config) => {
      const mergedConfig = { ...defaultConfig, ...config };
      return await genericService({
        url: mergedConfig?.url,
        params: mergedConfig?.params,
        body: mergedConfig?.body,
        headers: mergedConfig?.headers,
        options: mergedConfig?.options,
      });
    },
  });

  return {
    mutation,
    revalidate: () => {
      // Optionally, invalidate queries related to this mutation
      // Example: client.invalidateQueries({ queryKey: [defaultConfig?.url].filter(Boolean) });
    },
  };
};

export default useCustomAPIMutationHook;
