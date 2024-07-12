import { useQuery } from "@tanstack/react-query";
import { getStoredValue, queryClient } from "./stateConfigs";
import localforage from "localforage";
import { useEffect, useState, useCallback } from "react";

const cacheTime = 1000 * 60 * 60 * 24; // 24 hours

async function getCachedData(queryKey, initialData) {
  const cachedData = await getStoredValue(queryKey);
  if (cachedData && Date.now() - cachedData.updatedAt < cacheTime) {
    return cachedData.data;
  }
  return initialData;
}

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
        await localforage.setItem(queryKey, {
          data: newData,
          updatedAt: Date.now(),
        });
      },
      [queryKey]
    );

    const resetData = useCallback(() => {
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
