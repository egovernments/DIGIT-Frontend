import { QueryClient, QueryCache } from "@tanstack/react-query";
import localforage from "localforage";

localforage.config({
  driver: localforage.INDEXEDDB, // Force IndexedDB; same as using setDriver()
  name: "DIGIT",
  version: 1.0,
  storeName: "states", // Should be alphanumeric, with underscores.
  description: "Sandbox",
});

const cacheTime = 1000 * 60 * 60 * 24; // 24 hours

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onSuccess: async (data, query) => {
      await setCache(query.queryKey,data)
    },
  }),
  defaultOptions: {
    queries: {
      cacheTime,
      staleTime: 111110,
      refetchInterval: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchIntervalInBackground: false,
    },
  },
});

const hydrateQuery = async (queryKey) => {
  const cachedData = await localforage.getItem(queryKey);
  if (cachedData && Date.now() - cachedData.updatedAt < cacheTime) {
    queryClient.setQueryData(queryKey, cachedData.data);
  }
};

export const hydrateAllQueries = async () => {
  const keys = await localforage.keys();
  await Promise.all(keys.map((key) => hydrateQuery(key)));
};


export const getStoredValue =async(key)=>{
  const data=await localforage.getItem(key);
  return data;
}


export const setCache = async (key, data) => {
  const item = {
    data,
    updatedAt: Date.now(),
  };
  await localforage.setItem(key, item);
};


export const getCachedData = async (key,initialData) => {
  const cachedData = await getStoredValue(key);
  if (cachedData && Date.now() - cachedData.updatedAt < cacheTime) {
    return cachedData.data;
  }
  return initialData;
};