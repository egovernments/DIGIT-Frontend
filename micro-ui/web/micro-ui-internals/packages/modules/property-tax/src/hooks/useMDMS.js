import { useQuery } from "react-query";
import { MdmsService } from "../services/elements/MDMS";

const getCommonFieldsCriteria = (tenantId, moduleCode, type) => ({
  type,
  details: {
    tenantId,
    moduleDetails: [
      {
        moduleName: moduleCode,
        masterDetails: [
          {
            name: "CommonFieldsConfig",
            filter: null,
          },
        ],
      },
    ],
  },
});

export const getGeneralCriteria = (tenantId, moduleCode, type) => ({
  details: {
    moduleDetails: [
      {
        moduleName: moduleCode,
        masterDetails: [
          {
            name: type,
          },
        ],
      },
    ],
  },
});

const useMDMS = (tenantId, moduleCode, type, config = {}, payload = []) => {
  const useFinancialYears = () => {
    return useQuery("PT_FINANCIAL_YEARLS", () => MdmsService.getDataByCriteria(tenantId, payload, moduleCode));
  };
  const useCommonFieldsConfig = () => {
    return useQuery("COMMON_FIELDS", () => MdmsService.getDataByCriteria(tenantId, getCommonFieldsCriteria(tenantId, moduleCode, type, payload), moduleCode));
  };

  const usePropertyTaxDocuments = () => {
    return useQuery("PT_PROPERTY_TAX_DOCUMENTS", () => MdmsService.getDataByCriteria(tenantId, payload, moduleCode));
  };

  switch (type) {
    case "FINANCIAL_YEARLS":
      return useFinancialYears();
    case "PROPERTY_TAX_DOCUMENTS":
      return usePropertyTaxDocuments();
    case "CommonFieldsConfig":
      return useCommonFieldsConfig();
    default:
      return useQuery(type, () => MdmsService.getDataByCriteria(tenantId, getGeneralCriteria(tenantId, moduleCode, type), moduleCode), config);
  }
};

export default useMDMS;
