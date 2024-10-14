import { useQuery } from "react-query";
import UserSearchConfig from "./services/SearchCampaignConfig";

const useUserSearch = (data, config = {}) => {
  return useQuery(["USER_SEARCH",data,config.queryKey], () => UserSearchConfig(data), { ...config });
};

export default useUserSearch;
