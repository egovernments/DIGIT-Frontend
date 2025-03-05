import { MdmsService, getGeneralCriteria } from "../../services/elements/MDMS";
import { useQuery } from "@tanstack/react-query";

export const useEngagementMDMS = (tenantId, moduleCode, type, config = {}, payload = []) => {
  const useDocumentCategory = () => {
    return useQuery({
      queryKey: [type, tenantId, moduleCode],
      queryFn: () => MdmsService.getDataByCriteria(tenantId, getGeneralCriteria(tenantId, moduleCode, type), moduleCode),
      ...config,
    });
  };

  const _default = () => {
    return useQuery({
      queryKey: [tenantId, moduleCode, type],
      queryFn: () => MdmsService.getMultipleTypes(tenantId, moduleCode, type),
      ...config,
    });
  };

  switch (type) {
    case "DocumentsCategory":
      return useDocumentCategory();
    default:
      return _default();
  }
};
