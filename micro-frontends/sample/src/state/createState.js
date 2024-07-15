import { useQuery } from "@tanstack/react-query";
import { getCachedData, getStoredValue, queryClient, setCache } from "./stateConfigs";
import localforage from "localforage";
import { useEffect, useState, useCallback } from "react";



export function createGlobalState(queryKey, initialData = null,cacheEnabled=true) {
  return function useGlobalState() {

    useEffect(() => {
      fetchData();
    }, [queryKey, initialData]);

    async function fetchData() {
      const data = await getCachedData(queryKey, initialData);
      return data;
    }

    const { data } = useQuery({
      queryKey: [queryKey],
      queryFn: fetchData,
      refetchInterval: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchIntervalInBackground: false,
    });

    const setData = useCallback(
      async (newData) => {
        cacheEnabled&&queryClient.setQueryData([queryKey], newData);
        await setCache(queryKey,newData)
      },
      [queryKey]
    );

    const resetData = useCallback(async() => {
      await  setCache(queryKey,initialData)
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });
      queryClient.refetchQueries({
        queryKey: [queryKey],
      });
      
    }, [queryKey]);

    return { data, setData, resetData };
  };
}
