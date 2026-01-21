import { useMutation, useQuery } from "react-query";

export const useServiceConfigAPI = () => {
  const saveServiceConfig = useMutation({
    mutationFn: async (serviceConfigData) => {
      const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";
      
      const payload = {
        Mdms: {
          tenantId: Digit.ULBService.getCurrentTenantId(),
          schemaCode: "Studio.ServiceConfigurationDrafts",
          data: serviceConfigData
        }
      };

      return Digit.CustomService.getResponse({
        url: `/${mdms_context_path}/v2/_create/Studio.Checklists`,
        body: payload
      });
    }
  });

  const updateServiceConfig = useMutation({
    mutationFn: async ({ serviceConfigData, existingConfig }) => {
      const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";
      
      const payload = {
        Mdms: {
          id: existingConfig.id,
          tenantId: existingConfig.tenantId,
          schemaCode: existingConfig.schemaCode,
          uniqueIdentifier: existingConfig.uniqueIdentifier,
          isActive: existingConfig.isActive,
          auditDetails: existingConfig.auditDetails,
          data: serviceConfigData
        }
      };

      return Digit.CustomService.getResponse({
        url: `/${mdms_context_path}/v2/_update/Studio.Checklists`,
        body: payload
      });
    }
  });

  const fetchServiceConfig = (module, service) => {
    return useQuery({
      queryKey: ["serviceConfig", module, service],
      queryFn: async () => {
        const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";
        
        const response = await Digit.CustomService.getResponse({
          url: `/${mdms_context_path}/v2/_search`,
          body: {
            MdmsCriteria: {
              tenantId: Digit.ULBService.getCurrentTenantId(),
              schemaCode: "Studio.ServiceConfigurationDrafts",
              isActive: true
            }
          }
        });

        if (response && response.mdms && response.mdms.length > 0) {
          // Find the specific service config for the given module and service
          const serviceConfig = response.mdms.find(config => 
            config.data.module === module && config.data.service === service
          );
          return serviceConfig || null;
        }
        return null;
      },
      enabled: !!module && !!service,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000 // 10 minutes
    });
  };

  return {
    saveServiceConfig,
    updateServiceConfig,
    fetchServiceConfig
  };
}; 