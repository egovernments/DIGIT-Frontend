import { QueryClient, QueryCache } from "@tanstack/react-query";
import localforage from "localforage";

localforage.config({
  driver: localforage.INDEXEDDB, // Force IndexedDB; same as using setDriver()
  name: "DIGIT",
  version: 1.0,
  storeName: "keyvaluepairs", // Should be alphanumeric, with underscores.
  description: "Sandbox",
});

const cacheTime = 1000 * 60 * 60 * 24; // 24 hours

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onSuccess: async (data, query) => {
      console.log(data, "querydata");
      await localforage.setItem(query.queryKey, {
        data,
        updatedAt: Date.now(),
      });
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
    console.log(queryKey, cachedData.data, "queryKey, cachedData.data");
    queryClient.setQueryData(queryKey, cachedData.data);
  }
};

export const hydrateAllQueries = async () => {
  const keys = await localforage.keys();
  console.log(keys, "keys");
  await Promise.all(keys.map((key) => hydrateQuery(key)));
};
