import SearchPlanConfig from "./services/SearchPlanConfig";
import { useQuery } from "react-query";
const useSearchPlanConfig = (data, config = {}) => {
  return useQuery(["SEARCH_PLAN",data,config.queryKey], () => SearchPlanConfig(data), { ...config });
};

export default useSearchPlanConfig;
