import { useMutation } from "@tanstack/react-query";
import createCampaignService from "./services/createCampaignService";

const useCreateCampaign = (tenantId) => {
  return useMutation({
    mutationFn: (reqData) => {
      return createCampaignService(reqData, tenantId);
    }
  });
};

export default useCreateCampaign;
