import { useMutation, useQuery } from "react-query";
import { useTranslation } from "react-i18next";

const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

/**
 * Custom hook for checklist configuration API operations using Studio.ServiceConfigurationDrafts
 */
export const useChecklistConfigAPI = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  /**
   * Save checklist configuration to Studio.ServiceConfigurationDrafts
   */
  const saveChecklistConfig = useMutation(
    async (checklistData) => {
      const { module, service, checklistName, description, data } = checklistData;
      
      // First, check if a draft exists for this module and service
      const searchPayload = {
        MdmsCriteria: {
          tenantId: tenantId,
          schemaCode: "Studio.ServiceConfigurationDrafts",
          filters: {
            module: module,
            service: service,
          },
        },
      };

      const searchResponse = await Digit.CustomService.getResponse({
        url: `/${mdms_context_path}/v2/_search`,
        params: { tenantId: tenantId },
        body: searchPayload,
      });

      const existingDraft = searchResponse?.mdms?.[0];

      if (existingDraft) {
        // Update existing draft by adding the new checklist to uichecklists array
        const existingChecklists = existingDraft.data?.uichecklists || [];
        const updatedChecklists = [...existingChecklists, {
          name: checklistName,
          description: description,
          data: data,
          isActive: true
        }];

        const updatePayload = {
          id: existingDraft.id,
          tenantId: existingDraft.tenantId,
          schemaCode: existingDraft.schemaCode,
          uniqueIdentifier: existingDraft.uniqueIdentifier,
          data: {
            ...existingDraft.data,
            uichecklists: updatedChecklists
          },
          isActive: existingDraft.isActive,
          auditDetails: existingDraft.auditDetails
        };

        const response = await Digit.CustomService.getResponse({
          url: `/${mdms_context_path}/v2/_update/Studio.Checklists`,
          params: { tenantId: tenantId },
          body: { Mdms: updatePayload },
        });
        return response;
      } else {
        // Create new draft with checklist and default STUDIO_CITIZEN role
        const newDraftPayload = {
          Mdms: {
            tenantId: tenantId,
            schemaCode: "Studio.ServiceConfigurationDrafts",
            uniqueIdentifier: `${module}.${service}`,
            data: {
              module: module,
              service: service,
              pdf: [],
              bill: {},
              idgen: [],
              inbox: {},
              rules: {},
              access: {},
              fields: [],
              enabled: [],
              payment: {},
              uiforms: [],
              uiroles: [
                {
                  code: "STUDIO_CITIZEN",
                  active: true,
                  category: `${module.toUpperCase()}_${service.toUpperCase()}`,
                  isActive: true,
                  description: "Default Citizen Role",
                  additionalDetails: {
                    access: {
                      editor: true,
                      viewer: true,
                      creater: true
                    },
                    selfRegistration: false,
                    isDefaultRole: true // Flag to mark this as non-deletable
                  }
                }
              ],
              boundary: {},
              workflow: {},
              apiconfig: [],
              applicant: {},
              documents: [],
              calculator: {},
              uiworkflow: {},
              localization: {},
              notification: {},
              uichecklists: [{
                name: checklistName,
                description: description,
                data: data,
                isActive: true
              }],
              uinotifications: []
            },
            isActive: true,
          },
        };

        const response = await Digit.CustomService.getResponse({
          url: `/${mdms_context_path}/v2/_create`,
          params: { tenantId: tenantId },
          body: newDraftPayload,
        });
        return response;
      }
    },
    {
      onError: (error) => {
        console.error("Error saving checklist config:", error);
        throw error;
      },
    }
  );

  /**
   * Update checklist configuration in Studio.ServiceConfigurationDrafts
   */
  const updateChecklistConfig = useMutation(
    async (checklistData) => {
      const { module, service, checklistName, description, data, oldChecklistName } = checklistData;
      
      // Search for the draft
      const searchPayload = {
        MdmsCriteria: {
          tenantId: tenantId,
          schemaCode: "Studio.ServiceConfigurationDrafts",
          filters: {
            module: module,
            service: service,
          },
        },
      };

      const searchResponse = await Digit.CustomService.getResponse({
        url: `/${mdms_context_path}/v2/_search`,
        params: { tenantId: tenantId },
        body: searchPayload,
      });

      const existingDraft = searchResponse?.mdms?.[0];
      
      if (!existingDraft) {
        throw new Error("Service configuration draft not found");
      }

      // Update the specific checklist in uichecklists array
      const existingChecklists = existingDraft.data?.uichecklists || [];
      const updatedChecklists = existingChecklists.map(checklist => 
        checklist.name === oldChecklistName 
          ? {
              ...checklist,
              name: checklistName,
              description: description,
              data: data
            }
          : checklist
      );

      const updatePayload = {
        id: existingDraft.id,
        tenantId: existingDraft.tenantId,
        schemaCode: existingDraft.schemaCode,
        uniqueIdentifier: existingDraft.uniqueIdentifier,
        data: {
          ...existingDraft.data,
          uichecklists: updatedChecklists
        },
        isActive: existingDraft.isActive,
        auditDetails: existingDraft.auditDetails
      };

      const response = await Digit.CustomService.getResponse({
        url: `/${mdms_context_path}/v2/_update/Studio.Checklists`,
        params: { tenantId: tenantId },
        body: { Mdms: updatePayload },
      });
      return response;
    },
    {
      onError: (error) => {
        console.error("Error updating checklist config:", error);
        throw error;
      },
    }
  );

  /**
   * Search checklist configurations by module and service from Studio.ServiceConfigurationDrafts
   */
  const searchChecklistConfigs = (module, service) => {
    return useQuery(
      ["checklistConfigs", module, service],
      async () => {
        const payload = {
          MdmsCriteria: {
            tenantId: tenantId,
            schemaCode: "Studio.ServiceConfigurationDrafts",
            filters: {
              module: module,
              service: service,
            },
          },
        };

        const response = await Digit.CustomService.getResponse({
          url: `/${mdms_context_path}/v2/_search`,
          params: { tenantId: tenantId },
          body: payload,
        });

        const draft = response?.mdms?.[0];
        if (draft && draft.data?.uichecklists) {
          // Transform uichecklists to the expected format
          return draft.data.uichecklists.map((checklist, index) => ({
            id: `${draft.id}_${index}`,
            data: {
              module: module,
              service: service,
              name: checklist.name,
              description: checklist.description || "-",
              data: checklist.data,
              isActive: checklist.isActive
            },
            auditDetails: draft.auditDetails
          }));
        }
        return [];
      },
      {
        enabled: !!module && !!service,
        cacheTime: 5 * 60 * 1000, // 5 minutes
        staleTime: 2 * 60 * 1000, // 2 minutes
      }
    );
  };

  /**
   * Search checklist configuration by name from Studio.ServiceConfigurationDrafts
   */
  const searchChecklistConfigByName = useMutation({
    mutationFn: async ({ module, service, checklistName }) => {
      const payload = {
        MdmsCriteria: {
          tenantId: tenantId,
          schemaCode: "Studio.ServiceConfigurationDrafts",
          filters: {
            module: module,
            service: service,
          },
        },
      };

      const response = await Digit.CustomService.getResponse({
        url: `/${mdms_context_path}/v2/_search`,
        params: { tenantId: tenantId },
        body: payload,
      });

      const draft = response?.mdms?.[0];
      if (draft && draft.data?.uichecklists) {
        const checklist = draft.data.uichecklists.find(c => c.name === checklistName);
        if (checklist) {
          return {
            id: draft.id,
            data: {
              module: module,
              service: service,
              name: checklist.name,
              description: checklist.description || "-",
              data: checklist.data,
              isActive: checklist.isActive
            },
            auditDetails: draft.auditDetails
          };
        }
      }
      return null;
    },
    onError: (error) => {
      console.error("Error searching checklist config:", error);
      throw error;
    },
  });

  /**
   * Delete checklist configuration from Studio.ServiceConfigurationDrafts
   */
  const deleteChecklistConfig = useMutation(
    async (checklistData) => {
      const { module, service, checklistName } = checklistData;
      
      // Search for the draft
      const searchPayload = {
        MdmsCriteria: {
          tenantId: tenantId,
          schemaCode: "Studio.ServiceConfigurationDrafts",
          filters: {
            module: module,
            service: service,
          },
        },
      };

      const searchResponse = await Digit.CustomService.getResponse({
        url: `/${mdms_context_path}/v2/_search`,
        params: { tenantId: tenantId },
        body: searchPayload,
      });

      const existingDraft = searchResponse?.mdms?.[0];
      
      if (!existingDraft) {
        throw new Error("Service configuration draft not found");
      }

      // Remove the checklist from uichecklists array
      const updatedChecklists = existingDraft.data?.uichecklists?.filter(checklist => checklist.name !== checklistName) || [];

      const updatePayload = {
        id: existingDraft.id,
        tenantId: existingDraft.tenantId,
        schemaCode: existingDraft.schemaCode,
        uniqueIdentifier: existingDraft.uniqueIdentifier,
        data: {
          ...existingDraft.data,
          uichecklists: updatedChecklists
        },
        isActive: existingDraft.isActive,
        auditDetails: existingDraft.auditDetails
      };

      const response = await Digit.CustomService.getResponse({
        url: `/${mdms_context_path}/v2/_update/Studio.Checklists`,
        params: { tenantId: tenantId },
        body: { Mdms: updatePayload },
      });
      return response;
    },
    {
      onError: (error) => {
        console.error("Error deleting checklist config:", error);
        throw error;
      },
    }
  );

  return {
    saveChecklistConfig,
    updateChecklistConfig,
    searchChecklistConfigs,
    searchChecklistConfigByName,
    deleteChecklistConfig,
  };
};

/**
 * Utility function to transform checklist data to MDMS format
 */
export const transformChecklistDataToMDMS = (checklistState, module, service, checklistName, description = "") => {
  return {
    module: module,
    service: service,
    checklistName: checklistName,
    description: description,
    data: checklistState,
    isActive: true
  };
};

/**
 * Utility function to transform MDMS data to checklist format
 */
export const transformMDMSToChecklistData = (mdmsData) => {
  if (!mdmsData || !mdmsData.data) {
    return null;
  }
  
  return {
    name: mdmsData.data.name,
    description: mdmsData.data.description,
    data: mdmsData.data.data,
    isActive: mdmsData.data.isActive
  };
}; 