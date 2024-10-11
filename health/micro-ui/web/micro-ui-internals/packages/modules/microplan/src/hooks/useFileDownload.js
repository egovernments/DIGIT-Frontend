import { useQuery } from "react-query";
import SearchFileIds from "./services/SearchCampaignConfig";

const useSearchCampaign = (data, config = {}) => {
  return useQuery(["SEARCH_FILES",data,config?.queryKey], () => SearchFileIds(data), { ...config });
};

export default useSearchCampaign;

