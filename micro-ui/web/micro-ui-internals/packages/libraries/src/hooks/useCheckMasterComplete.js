import { useQuery, useQueryClient } from "react-query";
import CheckMasterStatusService from "../services/elements/CheckMasterStatusService";

export const useCheckMasterComplete = ({ tenantId, module, config = {} }) => {
  // const client = useQueryClient();
  // const queryData = useQuery(["MASTER_COMPLETE_CHECK", module], () => CheckMasterStatusService.getMasterSetupStatus(tenantId, module), options);
  // return { ...queryData, revalidate: () => client.invalidateQueries(["USER_SEARCH", filters, data]) };
  return useQuery(["MASTER_COMPLETE_CHECK", module], () => CheckMasterStatusService.getMasterSetupStatus(tenantId, module), config);
};
