import { QueryClient, QueryCache } from "@tanstack/react-query";
import localforage from "localforage";

/**
 * Configure localForage for persistent storage.
 * 
 * - Uses IndexedDB as the storage driver.
 * - Sets the database name to "DIGIT" and version to 1.0.
 * - Configures the store name as "states".
 * - Provides a description for the storage.
 * 
 * @author jagankumar-egov
 */
localforage.config({
  driver: localforage.INDEXEDDB, // Use IndexedDB for storage.
  name: "DIGIT", // Database name.
  version: 1.0, // Database version.
  storeName: "states", // Store name, should be alphanumeric with underscores.
  description: "Sandbox", // Description of the storage.
});

/**
 * Cache time duration for stored queries.
 * 
 * Queries are considered fresh for 24 hours (in milliseconds).
 */
const cacheTime = 1000 * 60 * 60 * 24; // 24 hours

/**
 * Initializes a new instance of QueryClient with custom cache and query options.
 * 
 * - `queryCache` is configured to store query results in localForage on success.
 * - `defaultOptions` sets the cache time, stale time, and disables automatic refetching.
 * 
 * @author jagankumar-egov
 */
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onSuccess: async (data, query) => {
      // Store query result in cache upon successful query.
      await setCache(query.queryKey, data);
    },
  }),
  defaultOptions: {
    queries: {
      cacheTime, // Duration to cache query results.
      staleTime: 111110, // Time to consider data fresh (in milliseconds).
      refetchInterval: false, // Disable periodic refetching.
      refetchOnMount: false, // Disable refetching on component mount.
      refetchOnWindowFocus: false, // Disable refetching on window focus.
      refetchOnReconnect: false, // Disable refetching on network reconnect.
      refetchIntervalInBackground: false, // Disable refetching in the background.
    },
  },
});

/**
 * Hydrates the query client with cached data for a specific query key.
 * 
 * Retrieves cached data from localForage and sets it in the query client if it is still fresh.
 * 
 * @param {string} queryKey - The key used to fetch cached data.
 */
const hydrateQuery = async (queryKey) => {
  const cachedData = await localforage.getItem(queryKey);
  if (cachedData && Date.now() - cachedData.updatedAt < cacheTime) {
    queryClient.setQueryData(queryKey, cachedData.data);
  }
};

/**
 * Hydrates all queries by fetching all cached keys from localForage.
 * 
 * Sets cached data for all keys in the query client.
 */
export const hydrateAllQueries = async () => {
  const keys = await localforage.keys();
  await Promise.all(keys.map((key) => hydrateQuery(key)));
};

/**
 * Retrieves a stored value from localForage.
 * 
 * @param {string} key - The key used to retrieve the stored value.
 * @returns {Promise<any>} - The stored data associated with the key.
 */
export const getStoredValue = async (key) => {
  const data = await localforage.getItem(key);
  return data;
};

/**
 * Sets cache for a specific key in localForage.
 * 
 * Stores data with a timestamp indicating when it was last updated.
 * 
 * @param {string} key - The key for storing the data.
 * @param {any} data - The data to be stored.
 */
export const setCache = async (key, data) => {
  const item = {
    data,
    updatedAt: Date.now(), // Timestamp of when the data was updated.
  };
  await localforage.setItem(key, item);
};

/**
 * Retrieves cached data for a specific key.
 * 
 * Returns cached data if it is still fresh, otherwise returns the initial data.
 * 
 * @param {string} key - The key used to retrieve cached data.
 * @param {any} initialData - The initial data to return if cache is stale or not found.
 * @returns {Promise<any>} - The cached data or the initial data.
 */
export const getCachedData = async (key, initialData) => {
  const cachedData = await getStoredValue(key);
  if (cachedData && Date.now() - cachedData.updatedAt < cacheTime) {
    return cachedData.data;
  }
  return initialData;
};
