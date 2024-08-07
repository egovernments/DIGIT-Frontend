import { useQuery } from "@tanstack/react-query";
import { getCachedData, getStoredValue, queryClient, setCache } from "./stateConfigs";
import { useEffect, useState, useCallback } from "react";

/**
 * Creates a custom hook for managing global state with caching and querying.
 * 
 * This function generates a custom hook to manage global state using `react-query` for data fetching,
 * caching, and updating. It supports optional caching and provides methods to set and reset the state.
 * 
 * @param {string} queryKey - The key used for querying and caching data.
 * @param {any} [initialData=null] - Initial data to be used if no cached data is available.
 * @param {boolean} [cacheEnabled=true] - Flag to enable or disable caching.
 * 
 * @returns {object} - An object containing:
 *  - `data`: The current data from the query.
 *  - `setData`: A function to update the data and cache.
 *  - `resetData`: A function to reset the data to its initial state.
 * 
 * @example
 * const useMyGlobalState = createGlobalState('myQueryKey', initialData);
 * const { data, setData, resetData } = useMyGlobalState();
 * 
 * @author jagankumar-egov
 */
export function createGlobalState(queryKey, initialData = null, cacheEnabled = true) {
  return function useGlobalState() {
    // Fetch data on mount and when queryKey or initialData changes
    useEffect(() => {
      fetchData();
    }, [queryKey, initialData]);

    // Function to fetch data from cache or initial data
    async function fetchData() {
      const data = await getCachedData(queryKey, initialData);
      return data;
    }

    // Query to fetch and cache data with no automatic refetching
    const { data } = useQuery({
      queryKey: [queryKey],
      queryFn: fetchData,
      refetchInterval: false, // Disable refetching at intervals
      refetchOnMount: false, // Disable refetching on component mount
      refetchOnWindowFocus: false, // Disable refetching on window focus
      refetchOnReconnect: false, // Disable refetching on network reconnect
      refetchIntervalInBackground: false, // Disable refetching in background
    });

    // Function to update data and cache
    const setData = useCallback(
      async (newData) => {
        if (cacheEnabled) {
          queryClient.setQueryData([queryKey], newData);
        }
        await setCache(queryKey, newData);
      },
      [queryKey, cacheEnabled]
    );

    // Function to reset data to initial state
    const resetData = useCallback(async () => {
      await setCache(queryKey, initialData);
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });
      queryClient.refetchQueries({
        queryKey: [queryKey],
      });
    }, [queryKey, initialData]);

    // Return state and methods
    return { data, setData, resetData };
  };
}
