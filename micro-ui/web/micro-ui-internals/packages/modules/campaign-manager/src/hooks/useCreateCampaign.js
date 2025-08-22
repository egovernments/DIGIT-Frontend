import { useMutation } from "@tanstack/react-query";
import createCampaignService from "./services/createCampaignService";

const useCreateCampaign = (tenantId) => {
  return useMutation({
   mutaionFn: (reqData) => {
    return createCampaignService(reqData, tenantId);
  }
  });
};

export default useCreateCampaign;
