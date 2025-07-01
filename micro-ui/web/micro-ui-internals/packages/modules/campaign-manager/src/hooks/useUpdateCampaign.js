import { useMutation } from "@tanstack/react-query";
import updateCampaignService from "./services/updateCampaignService";

const useUpdateCampaign = (tenantId) => {
  return useMutation((reqData) => {
    return updateCampaignService(reqData, tenantId);
  });
};

export default useUpdateCampaign;
