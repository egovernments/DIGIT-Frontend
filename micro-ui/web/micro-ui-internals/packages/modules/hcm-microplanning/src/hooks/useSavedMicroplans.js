
import { useQuery } from "react-query";
import SearchSavedPlans from "../services/searchSavedPlans";

const useSavedMicroplans = (reqCriteria) => {
  return useQuery([reqCriteria?.tenantId, reqCriteria?.id, reqCriteria?.name, reqCriteria?.executionPlanId, reqCriteria?.userUuid, reqCriteria?.offset, reqCriteria?.limit], () =>[], { ...reqCriteria.config });
};

// () => SearchSavedPlans(data)
export default useSavedMicroplans;
