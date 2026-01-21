import { useMutation, useQuery } from "react-query";
import { useTranslation } from "react-i18next";

const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

/**
 * Custom hook for form configuration API operations using Studio.ServiceConfigurationDrafts
 */
export const useFormConfigAPI = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  /**
   * Save form configuration to Studio.ServiceConfigurationDrafts
   */
  const saveFormConfig = useMutation(
    async (formData) => {
      const { module, service, formName, formDescription, formConfig } = formData;
      
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
        // Update existing draft by adding the new form to uiforms array
        const updatedUiforms = existingDraft.data?.uiforms || [];
        const newForm = {
          formName: formName,
          isActive: true,
          formConfig: formConfig,
          localization: {},
          formDescription: formDescription
        };
        
        // Check if form with same name already exists
        const existingFormIndex = updatedUiforms.findIndex(form => form.formName === formName);
        if (existingFormIndex >= 0) {
          updatedUiforms[existingFormIndex] = newForm;
        } else {
          updatedUiforms.push(newForm);
        }

        const updatePayload = {
          id: existingDraft.id,
          tenantId: existingDraft.tenantId,
          schemaCode: existingDraft.schemaCode,
          uniqueIdentifier: existingDraft.uniqueIdentifier,
          data: {
            ...existingDraft.data,
            uiforms: updatedUiforms
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
        // Create new draft with the form
        const createPayload = {
          MdmsCriteria: {
            tenantId: tenantId,
            schemaCode: "Studio.ServiceConfigurationDrafts",
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
              uiforms: [{
                formName: formName,
                isActive: true,
                formConfig: formConfig,
                localization: {},
                formDescription: formDescription
              }],
              uiroles: [],
              boundary: {},
              workflow: {},
              apiconfig: [],
              applicant: {},
              documents: [],
              calculator: {},
              uiworkflow: {},
              localization: {},
              notification: {},
              uichecklists: [],
              uinotifications: []
            }
          },
        };

        const response = await Digit.CustomService.getResponse({
          url: `/${mdms_context_path}/v2/_create`,
          params: { tenantId: tenantId },
          body: createPayload,
        });
        return response;
      }
    },
    {
      onError: (error) => {
        console.error("Error saving form config:", error);
        throw error;
      },
    }
  );

  /**
   * Update existing form configuration in Studio.ServiceConfigurationDrafts
   */
  const updateFormConfig = useMutation(
    async (formData) => {
      const { module, service, formName, formDescription, formConfig, formId, originalFormName } = formData;

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

      // Update the specific form in uiforms array
      // Use originalFormName to find the form, or fallback to formName if originalFormName is not provided
      const updatedUiforms = existingDraft.data?.uiforms || [];
      const searchFormName = originalFormName || formName;
      const formIndex = updatedUiforms.findIndex(form => form.formName === searchFormName);
      
      if (formIndex >= 0) {
        updatedUiforms[formIndex] = {
          formName: formName,
          isActive: true,
          formConfig: formConfig,
          localization: {},
          formDescription: formDescription
        };
      } else {
        // If form not found, add it
        updatedUiforms.push({
          formName: formName,
          isActive: true,
          formConfig: formConfig,
          localization: {},
          formDescription: formDescription
        });
      }

      const updatePayload = {
        id: existingDraft.id,
        tenantId: existingDraft.tenantId,
        schemaCode: existingDraft.schemaCode,
        uniqueIdentifier: existingDraft.uniqueIdentifier,
        data: {
          ...existingDraft.data,
          uiforms: updatedUiforms
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
        console.error("Error updating form config:", error);
        throw error;
      },
    }
  );

  /**
   * Search form configurations by module and service from Studio.ServiceConfigurationDrafts
   */
  const searchFormConfigs = (module, service) => {
    return useQuery(
      ["formConfigs", module, service],
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
        if (draft && draft.data?.uiforms) {
          // Transform uiforms to the expected format
          return draft.data.uiforms.map((form, index) => ({
            id: `${draft.id}_${index}`,
            data: {
              module: module,
              service: service,
              formName: form.formName,
              formDescription: form.formDescription || "-",
              formConfig: form.formConfig,
              isActive: form.isActive
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
   * Search form configuration by unique identifier (module.service) from Studio.ServiceConfigurationDrafts
   */
  const searchFormConfigById = (module, service) => {
    return useQuery(
      ["formConfig", module, service],
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
        if (draft && draft.data?.uiforms && draft.data.uiforms.length > 0) {
          // Return the first form (or you can modify this logic based on your needs)
          const form = draft.data.uiforms[0];
          return {
            id: draft.id,
            data: {
              module: module,
              service: service,
              formName: form.formName,
              formDescription: form.formDescription,
              formConfig: form.formConfig,
              isActive: form.isActive
            },
            auditDetails: draft.auditDetails
          };
        }
        return null;
      },
      {
        enabled: !!module && !!service,
        cacheTime: 5 * 60 * 1000, // 5 minutes
        staleTime: 2 * 60 * 1000, // 2 minutes
      }
    );
  };

  /**
   * Fetch form configuration by formName for edit mode from Studio.ServiceConfigurationDrafts
   */
  const fetchFormConfigByName = (formName) => {
    return useQuery(
      ["formConfigByName", formName],
      async () => {
        const payload = {
          MdmsCriteria: {
            tenantId: tenantId,
            schemaCode: "Studio.ServiceConfigurationDrafts",
          },
        };
        const response = await Digit.CustomService.getResponse({
          url: `/${mdms_context_path}/v2/_search`,
          params: { tenantId: tenantId },
          body: payload,
        });
        
        // Search through all drafts to find the form with matching name
        const drafts = response?.mdms || [];
        for (const draft of drafts) {
          if (draft.data?.uiforms) {
            const form = draft.data.uiforms.find(f => f.formName === formName);
            if (form) {
              return {
                id: draft.id,
                data: {
                  module: draft.data.module,
                  service: draft.data.service,
                  formName: form.formName,
                  formDescription: form.formDescription,
                  formConfig: form.formConfig,
                  isActive: form.isActive
                },
                auditDetails: draft.auditDetails
              };
            }
          }
        }
        return null;
      },
      {
        enabled: !!formName,
        cacheTime: 5 * 60 * 1000, // 5 minutes
        staleTime: 2 * 60 * 1000, // 2 minutes
      }
    );
  };

  /**
   * Delete form configuration from Studio.ServiceConfigurationDrafts
   */
  const deleteFormConfig = useMutation(
    async (formData) => {
      const { module, service, formName } = formData;
      
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

      // Remove the form from uiforms array
      const updatedUiforms = existingDraft.data?.uiforms?.filter(form => form.formName !== formName) || [];

      const updatePayload = {
        id: existingDraft.id,
        tenantId: existingDraft.tenantId,
        schemaCode: existingDraft.schemaCode,
        uniqueIdentifier: existingDraft.uniqueIdentifier,
        data: {
          ...existingDraft.data,
          uiforms: updatedUiforms
        },
        isActive: existingDraft.isActive,
        auditDetails: existingDraft.auditDetails
      };

      const response = await Digit.CustomService.getResponse({
        url: `/${mdms_context_path}/v2/_update`,
        params: { tenantId: tenantId },
        body: { MdmsCriteria: updatePayload },
      });
      return response;
    },
    {
      onError: (error) => {
        console.error("Error deleting form config:", error);
        throw error;
      },
    }
  );

  return {
    saveFormConfig,
    updateFormConfig,
    searchFormConfigs,
    searchFormConfigById,
    fetchFormConfigByName,
    deleteFormConfig,
  };
};

/**
 * Utility function to transform form data to MDMS format
 */
export const transformFormDataToMDMS = (formState, module, service, formName, formDescription = "") => {
  const currentDate = new Date().toISOString();
  const user = Digit.UserService.getUser();

  // Clean the form data to ensure no localization keys are stored
  const cleanFormData = {
    ...formState,
    screenData: formState?.screenData?.map(screen => ({
      ...screen,
      cards: screen?.cards?.map(card => ({
        ...card,
        headerFields: card?.headerFields?.map(headerField => ({
          ...headerField,
          // Ensure we store the actual value, not a localization key
          value: typeof headerField.value === 'string' ? headerField.value : headerField.value || ''
        })),
        fields: card?.fields?.map(field => ({
          ...field,
          // Ensure we store the actual label, not a localization key
          label: typeof field.label === 'string' ? field.label : field.label || '',
          // Ensure other text fields are also stored as plain text
          helpText: typeof field.helpText === 'string' ? field.helpText : field.helpText || '',
          innerLabel: typeof field.innerLabel === 'string' ? field.innerLabel : field.innerLabel || '',
          tooltip: typeof field.tooltip === 'string' ? field.tooltip : field.tooltip || '',
          errorMessage: typeof field.errorMessage === 'string' ? field.errorMessage : field.errorMessage || '',
          defaultValue: typeof field.defaultValue === 'string' ? field.defaultValue : field.defaultValue || ''
        }))
      }))
    }))
  };

  return {
    module: module,
    service: service,
    formName: formName,
    formDescription: formDescription,
    version: "1.0.0",
    isActive: true,
    formConfig: {
      screens: cleanFormData?.screenData || [],
    },
    // Remove localization data completely - we don't need it
     localization: {},
  };
};

/**
 * Utility function to transform MDMS data to form format
 */
export const transformMDMSToFormData = (mdmsData) => {
  if (!mdmsData) return null;

  return {
    screenData: mdmsData.formConfig?.screens || [],
    localization: mdmsData.localization || {},
    metadata: {
      module: mdmsData.module,
      service: mdmsData.service,
      formName: mdmsData.formName,
      version: mdmsData.version,
      createdDate: mdmsData.createdDate,
      lastModifiedDate: mdmsData.lastModifiedDate,
      createdBy: mdmsData.createdBy,
    },
  };
}; 