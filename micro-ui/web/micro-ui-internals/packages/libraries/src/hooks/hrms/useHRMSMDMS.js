import { MdmsService } from "../../services/elements/MDMS";
import { useQuery } from "@tanstack/react-query";

const useHrmsMDMS = (tenantId, moduleCode, type, config = {}) => {
  const useHrmsRolesandDesignations = () => {
    return useQuery({
      queryKey: ["HRMS_EMP_RD", tenantId],
      queryFn: () => MdmsService.getHrmsEmployeeRolesandDesignation(tenantId),
      ...config
    });
  };

  const useHrmsEmployeeTypes = () => {
    return useQuery({
      queryKey: ["HRMS_EMP_TYPE", tenantId],
      queryFn: () => MdmsService.getHrmsEmployeeTypes(tenantId, moduleCode, type),
      ...config
    });
  };

  const useHrmsEmployeeReasons = () => {
    return useQuery({
      queryKey: ["HRMS_EMP_REASON", tenantId],
      queryFn: () => MdmsService.getHrmsEmployeeReason(tenantId, moduleCode, type),
      ...config
    });
  };

  switch (type) {
    case "HRMSRolesandDesignation":
      return useHrmsRolesandDesignations();
    case "EmployeeType":
      return useHrmsEmployeeTypes();
    case "DeactivationReason":
      return useHrmsEmployeeReasons();
    default:
      return null; // return null for unmatched types to avoid returning nothing
  }
};
export default useHrmsMDMS;
