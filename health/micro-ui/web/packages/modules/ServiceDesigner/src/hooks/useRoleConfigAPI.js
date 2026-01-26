import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

/**
 * Custom hook for role configuration API operations using Studio.ServiceConfigurationDrafts
 */
export const useRoleConfigAPI = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  /**
   * Save role configuration to Studio.ServiceConfigurationDrafts
   */
  const saveRoleConfig = useMutation({
    mutationFn: async (roleData) => {
      const { module, service, roleName, description, access, selfRegistration, isDefaultRole } = roleData;

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
        // Update existing draft by adding the new role to uiroles array
        const existingRoles = existingDraft.data?.uiroles || [];
        const updatedRoles = [...existingRoles, {
          code: roleName,
          description: description,
          category: `${module.toUpperCase()}_${service.toUpperCase()}`,
          active: true,
          additionalDetails: {
            access: access,
            selfRegistration: Boolean(selfRegistration),
            isDefaultRole: Boolean(isDefaultRole)
          },
          isActive: true
        }];

        const updatePayload = {
          id: existingDraft.id,
          tenantId: existingDraft.tenantId,
          schemaCode: existingDraft.schemaCode,
          uniqueIdentifier: existingDraft.uniqueIdentifier,
          data: {
            ...existingDraft.data,
            uiroles: updatedRoles
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
        // Create new draft with role
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
              uichecklists: [],
              boundary: {},
              workflow: {},
              apiconfig: [],
              applicant: {},
              documents: [],
              calculator: {},
              uiworkflow: {},
              localization: {},
              notification: {},
              uiroles: [{
                code: roleName,
                description: description,
                category: `${module.toUpperCase()}_${service.toUpperCase()}`,
                active: true,
                additionalDetails: {
                  access: access,
                  selfRegistration: Boolean(selfRegistration),
                  isDefaultRole: Boolean(isDefaultRole)
                },
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
    onError: (error) => {
      console.error("Error saving role config:", error);
      throw error;
    },
  });

  /**
   * Update role configuration in Studio.ServiceConfigurationDrafts
   */
  const updateRoleConfig = useMutation({
    mutationFn: async (roleData) => {
      const { module, service, roleName, description, access, oldRoleName, selfRegistration, isDefaultRole } = roleData;

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

      // Update the specific role in uiroles array
      const existingRoles = existingDraft.data?.uiroles || [];
      const updatedRoles = existingRoles.map(role =>
        t(role.code) === oldRoleName
          ? {
              ...role,
              code: roleName,
              description: description,
              additionalDetails: {
                access: access,
                selfRegistration: Boolean(selfRegistration),
                isDefaultRole: Boolean(isDefaultRole)
              }
            }
          : role
      );

      const updatePayload = {
        id: existingDraft.id,
        tenantId: existingDraft.tenantId,
        schemaCode: existingDraft.schemaCode,
        uniqueIdentifier: existingDraft.uniqueIdentifier,
        data: {
          ...existingDraft.data,
          uiroles: updatedRoles
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
    onError: (error) => {
      console.error("Error updating role config:", error);
      throw error;
    },
  });

  /**
   * Search role configurations by module and service from Studio.ServiceConfigurationDrafts
   */
  const searchRoleConfigs = (module, service) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useQuery({
      queryKey: ["roleConfigs", module, service],
      queryFn: async () => {
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
        if (draft && draft.data?.uiroles) {
          // Transform uiroles to the expected format
          return draft.data.uiroles.map((role, index) => ({
            id: `${draft.id}_${index}`,
            data: {
              code: role.code,
              description: role.description || "-",
              category: role.category,
              active: role.active,
              additionalDetails: role.additionalDetails,
              isActive: role.isActive
            },
            auditDetails: draft.auditDetails
          }));
        }
        return [];
      },
      enabled: !!module && !!service,
      gcTime: 5 * 60 * 1000,    // renamed from cacheTime
      staleTime: 2 * 60 * 1000,
    });
  };

  /**
   * Search role configuration by name from Studio.ServiceConfigurationDrafts
   */
  const searchRoleConfigByName = useMutation({
    mutationFn: async ({ module, service, roleName }) => {
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
      if (draft && draft.data?.uiroles) {
        const role = draft.data.uiroles.find(r => r.code === roleName);
        if (role) {
          return {
            id: draft.id,
            data: {
              code: role.code,
              description: role.description || "-",
              category: role.category,
              active: role.active,
              additionalDetails: role.additionalDetails,
              isActive: role.isActive
            },
            auditDetails: draft.auditDetails
          };
        }
      }
      return null;
    },
    onError: (error) => {
      console.error("Error searching role config:", error);
      throw error;
    },
  });

  /**
   * Delete role configuration from Studio.ServiceConfigurationDrafts
   */
  const deleteRoleConfig = useMutation({
    mutationFn: async (roleData) => {
      const { module, service, roleName } = roleData;
      
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

      // Remove the role from uiroles array
      const updatedRoles = existingDraft.data?.uiroles?.filter(role => role.code !== roleName) || [];

      const updatePayload = {
        id: existingDraft.id,
        tenantId: existingDraft.tenantId,
        schemaCode: existingDraft.schemaCode,
        uniqueIdentifier: existingDraft.uniqueIdentifier,
        data: {
          ...existingDraft.data,
          uiroles: updatedRoles
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
    onError: (error) => {
      console.error("Error deleting role config:", error);
      throw error;
    },
  });

  return {
    saveRoleConfig,
    updateRoleConfig,
    searchRoleConfigs,
    searchRoleConfigByName,
    deleteRoleConfig,
  };
};

/**
 * Utility function to transform role data to MDMS format
 */
export const transformRoleDataToMDMS = (roleState, module, service, roleName, description = "", access = {}) => {
  return {
    module: module,
    service: service,
    roleName: roleName,
    description: description,
    access: access,
    isActive: true
  };
};

/**
 * Utility function to transform MDMS data to role format
 */
export const transformMDMSToRoleData = (mdmsData) => {
  if (!mdmsData || !mdmsData.data) {
    return null;
  }
  
  return {
    code: mdmsData.data.code,
    description: mdmsData.data.description,
    category: mdmsData.data.category,
    active: mdmsData.data.active,
    additionalDetails: mdmsData.data.additionalDetails,
    isActive: mdmsData.data.isActive
  };
};