import { useQuery } from "react-query";
import SearchSavedPlans from "./services/searchSavedPlans";
import { useRef } from "react";

const useSavedMicroplans = (reqCriteria) => {
  const { body, config, params, state, url } = reqCriteria;
  const { tabId = undefined} = Digit.Hooks.useQueryParams();

  const lastCallTimeRef = useRef(0); // Keeps track of last call time between renders

  const throttledFetch = async () => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTimeRef.current;

    const waitTime = Math.max(0, 2000 - timeSinceLastCall); // Minimum 2 sec gap

    if (waitTime > 0) {
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }

    lastCallTimeRef.current = Date.now(); // Update timestamp
    return await SearchSavedPlans(body);
  };

  const { isLoading, data, isFetching, refetch } = useQuery(
    ["SAVED_MICROPLANS", url,tabId],
    ()=>throttledFetch(),
    {
      ...config,
      cacheTime: 10000,
      staleTime: 10000,
      onError: (err) =>
        console.error("Error fetching saved microplans:", err),
    }
  );

  return {
    isLoading,
    isFetching,
    data,
    refetch,
    revalidate: () => {},
  };
};

export default useSavedMicroplans;
