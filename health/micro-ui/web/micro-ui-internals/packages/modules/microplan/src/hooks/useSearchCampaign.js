import { useQuery } from "react-query";
import SearchCampaignConfig from "./services/SearchCampaignConfig";

const useSearchCampaign = (data, config = {}) => {
  return useQuery(["SEARCH_CAMPAIGN",data,config.queryKey], () => SearchCampaignConfig(data), { ...config });
};

export default useSearchCampaign;
