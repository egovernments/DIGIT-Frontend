import { useMutation } from "react-query";
import SearchPlanConfig from "../services/SearchPlanConfig";

const useSearchPlanConfig = (data, config = {}) => {
  return useQuery([data?.tenantId, data?.id, data?.name, data?.campaignId, data?.userUuid, data?.offset, data?.limit], () => SearchPlanConfig(data), { ...config });
};

export default useSearchPlanConfig;
