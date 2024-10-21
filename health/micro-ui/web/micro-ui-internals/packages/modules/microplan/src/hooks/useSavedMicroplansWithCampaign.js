import { useQuery } from "react-query";
import SearchSavedPlansWithCampaign from "./services/searchSavedPlansWithCampaign";

const useSavedMicroplansWithCampaign = (reqCriteria) => {
  const { body, config, params, state, url } = reqCriteria;
  const { isLoading, data, isFetching, refetch } = useQuery(["SAVED_MICROPLANS", url], () => SearchSavedPlansWithCampaign(body), {
    ...config,
    cacheTime: 0,
    staleTime: 0,
    onError: (err) => console.error("Error fetching saved microplans:", err),
  });

  return {
    isLoading,
    isFetching,
    data,
    refetch,
    revalidate: () => {},
  };
};

// () => SearchSavedPlans(data)
export default useSavedMicroplansWithCampaign;
