import { useMutation } from "@tanstack/react-query";
import updateCampaignService from "./services/updateCampaignService";

const useUpdateCampaign = (tenantId, config = {}) => {
  return useMutation({
    mutationFn: (reqData) => updateCampaignService(reqData, tenantId),
    ...config,
  });
};

export default useUpdateCampaign;