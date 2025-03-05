import { useQuery } from "@tanstack/react-query";
import { MdmsService } from "../../services/elements/MDMS";

const useDssMDMS = (tenantId, moduleCode, type, config = {}) => {
  const useDssDashboard = () => {
    return useQuery({
      queryKey: ["DSS_DASHBOARD", tenantId, moduleCode],
      queryFn: () => MdmsService.getDssDashboard(tenantId, moduleCode),
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
    case "DssDashboard":
      return useDssDashboard();
    default:
      return _default();
  }
};

export default useDssMDMS;
