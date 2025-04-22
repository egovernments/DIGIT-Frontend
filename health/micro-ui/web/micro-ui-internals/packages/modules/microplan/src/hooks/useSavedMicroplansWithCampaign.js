import { useQuery } from "react-query";
import SearchSavedPlansWithCampaign from "./services/searchSavedPlansWithCampaign";
import { useRef } from "react";

const useSavedMicroplansWithCampaign = (reqCriteria) => {
  const { body, config, params, state, url } = reqCriteria;
  const { tabId = undefined} = Digit.Hooks.useQueryParams();

  // To track the last time the fetch function was executed
  const lastCallTimeRef = useRef(0);

  // Throttled version of the fetch function
  const throttledFetch = async () => {

    const now = Date.now(); // Current timestamp
    const timeSinceLastCall = now - lastCallTimeRef.current;

    const waitTime = Math.max(0, 2000 - timeSinceLastCall); // Enforce 2 sec gap

    if (waitTime > 0) {
      await new Promise((resolve) => setTimeout(resolve, waitTime)); // Pause if called too soon
    }

    lastCallTimeRef.current = Date.now(); // Update timestamp after waiting
    return await SearchSavedPlansWithCampaign(body); // Actual API call
  };

  // React Query with throttled fetch
  const { isLoading, data, isFetching, refetch } = useQuery(
    ["SAVED_MICROPLANS", url,tabId],
    () => throttledFetch(),
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
    revalidate: () => {}, // placeholder, you can expand this later
  };
};

export default useSavedMicroplansWithCampaign;
