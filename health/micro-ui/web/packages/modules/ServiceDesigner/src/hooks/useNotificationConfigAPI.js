import { useMutation, useQuery } from "@tanstack/react-query";

const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

export const useNotificationConfigAPI = () => {
  // Search all notification configs for a module/service
  const searchNotificationConfigs = (module, service) => {
    return useQuery({
      queryKey: ["notificationConfigs", module, service],
      queryFn: async () => {
        const requestCriteria = {
          url: `/${mdms_context_path}/v2/_search`,
          body: {
            MdmsCriteria: {
              tenantId: Digit.ULBService.getCurrentTenantId(),
              schemaCode: "Studio.ServiceConfigurationDrafts",
              filters: {
                module: module,
                service: service,
              },
            },
          },
        };
        const response = await Digit.CustomService.getResponse(requestCriteria);
        const draft = response?.mdms?.[0];
        return draft?.data?.uinotifications || [];
      },
      enabled: !!module && !!service,
    });
  };

  // Search notification config by name
  const searchNotificationConfigByName = useMutation({
    mutationFn: async ({ module, service, notificationName }) => {
      const requestCriteria = {
        url: `/${mdms_context_path}/v2/_search`,
        body: {
          MdmsCriteria: {
            tenantId: Digit.ULBService.getCurrentTenantId(),
            schemaCode: "Studio.ServiceConfigurationDrafts",
            filters: {
              module: module,
              service: service,
            },
          },
        },
      };
      const response = await Digit.CustomService.getResponse(requestCriteria);
      const draft = response?.mdms?.[0];
      const notifications = draft?.data?.uinotifications || [];
      return notifications.find(notification => notification.title === notificationName);
    },
  });

  // Save new notification config
  const saveNotificationConfig = useMutation({
    mutationFn: async (notificationData) => {
      const { module, service, title, messageBody, subject, type, additionalDetails } = notificationData;
      
      // Search for existing draft
      const searchCriteria = {
        url: `/${mdms_context_path}/v2/_search`,
        body: {
          MdmsCriteria: {
            tenantId: Digit.ULBService.getCurrentTenantId(),
            schemaCode: "Studio.ServiceConfigurationDrafts",
            filters: {
              module: module,
              service: service,
            },
          },
        },
      };
      
      const searchResponse = await Digit.CustomService.getResponse(searchCriteria);
      const existingDraft = searchResponse?.mdms?.[0];

      if (existingDraft) {
        // Update existing draft by adding the new notification to uinotifications array
        const existingNotifications = existingDraft.data?.uinotifications || [];
        const newNotification = {
          title: title,
          messageBody: messageBody,
          subject: subject || "",
          additionalDetails: {
            type: type,
            category: `${module.toUpperCase()}_${service.toUpperCase()}`,
            ...additionalDetails
          },
          isActive: true
        };
        const updatedNotifications = [...existingNotifications, newNotification];
        
        const updatePayload = {
          Mdms: {
            tenantId: Digit.ULBService.getCurrentTenantId(),
            schemaCode: "Studio.ServiceConfigurationDrafts",
            id: existingDraft.id,
            uniqueIdentifier: existingDraft.uniqueIdentifier,
            data: {
              ...existingDraft.data,
              uinotifications: updatedNotifications
            },
            isActive: existingDraft.isActive,
            auditDetails: existingDraft?.auditDetails
          }
        };
        
        
        return Digit.CustomService.getResponse({
          url: `/${mdms_context_path}/v2/_update/Studio.Checklists`,
          body: updatePayload
        });
      } else {
        // Create new draft with notification
        const newDraftPayload = {
          Mdms: {
            tenantId: Digit.ULBService.getCurrentTenantId(),
            schemaCode: "Studio.ServiceConfigurationDrafts",
            data: {
              module: module,
              service: service,
              uinotifications: [{
                title: title,
                messageBody: messageBody,
                subject: subject || "",
                additionalDetails: {
                  type: type,
                  category: `${module.toUpperCase()}_${service.toUpperCase()}`,
                  ...additionalDetails
                },
                isActive: true
              }]
            },
            auditDetails: {
              createdBy: Digit.UserService.getUser()?.info?.uuid || "",
              createdTime: Date.now(),
              lastModifiedBy: Digit.UserService.getUser()?.info?.uuid || "",
              lastModifiedTime: Date.now()
            }
          }
        };
        
        return Digit.CustomService.getResponse({
          url: `/${mdms_context_path}/v2/_create`,
          body: newDraftPayload
        });
      }
    },
  });

  // Update existing notification config
  const updateNotificationConfig = useMutation({
    mutationFn: async (notificationData) => {
      const { module, service, title, messageBody, subject, type, additionalDetails, originalTitle } = notificationData;
      
      // Search for existing draft
      const searchCriteria = {
        url: `/${mdms_context_path}/v2/_search`,
        body: {
          MdmsCriteria: {
            tenantId: Digit.ULBService.getCurrentTenantId(),
            schemaCode: "Studio.ServiceConfigurationDrafts",
            filters: {
              module: module,
              service: service,
            },
          },
        },
      };
      
      const searchResponse = await Digit.CustomService.getResponse(searchCriteria);
      const existingDraft = searchResponse?.mdms?.[0];

      if (existingDraft) {
        // Update existing notification in uinotifications array
        const existingNotifications = existingDraft.data?.uinotifications || [];
        const updatedNotifications = existingNotifications.map(notification => {
          if (notification.title === originalTitle) {
            return {
              ...notification,
              title: title,
              messageBody: messageBody,
              subject: subject || "",
              additionalDetails: {
                ...notification.additionalDetails,
                type: type,
                category: `${module.toUpperCase()}_${service.toUpperCase()}`,
                ...additionalDetails
              }
            };
          }
          return notification;
        });
        
        const updatePayload = {
          Mdms: {
            tenantId: Digit.ULBService.getCurrentTenantId(),
            schemaCode: "Studio.ServiceConfigurationDrafts",
            id: existingDraft.id,
            uniqueIdentifier: existingDraft.uniqueIdentifier,
            data: {
              ...existingDraft.data,
              uinotifications: updatedNotifications
            },
            isActive: existingDraft.isActive,
            auditDetails: existingDraft?.auditDetails
          }
        };
        
        return Digit.CustomService.getResponse({
          url: `/${mdms_context_path}/v2/_update/Studio.Checklists`,
          body: updatePayload
        });
      }
      
      throw new Error("No existing draft found for update");
    },
  });

  // Delete notification config
  const deleteNotificationConfig = useMutation({
    mutationFn: async ({ module, service, notificationTitle }) => {
      // Search for existing draft
      const searchCriteria = {
        url: `/${mdms_context_path}/v2/_search`,
        body: {
          MdmsCriteria: {
            tenantId: Digit.ULBService.getCurrentTenantId(),
            schemaCode: "Studio.ServiceConfigurationDrafts",
            filters: {
              module: module,
              service: service,
            },
          },
        },
      };
      
      const searchResponse = await Digit.CustomService.getResponse(searchCriteria);
      const existingDraft = searchResponse?.mdms?.[0];

      if (existingDraft) {
        // Remove notification from uinotifications array
        const existingNotifications = existingDraft.data?.uinotifications || [];
        const updatedNotifications = existingNotifications.filter(notification => notification.title !== notificationTitle);
        
        const updatePayload = {
          Mdms: {
            tenantId: Digit.ULBService.getCurrentTenantId(),
            schemaCode: "Studio.ServiceConfigurationDrafts",
            id: existingDraft.id,
            uniqueIdentifier: existingDraft.uniqueIdentifier,
            data: {
              ...existingDraft.data,
              uinotifications: updatedNotifications
            },
            isActive: existingDraft.isActive,
            auditDetails: existingDraft?.auditDetails
          }
        };
        
        return Digit.CustomService.getResponse({
          url: `/${mdms_context_path}/v2/_update/Studio.Checklists`,
          body: updatePayload
        });
      }
      
      throw new Error("No existing draft found for deletion");
    },
  });

  return {
    searchNotificationConfigs,
    searchNotificationConfigByName,
    saveNotificationConfig,
    updateNotificationConfig,
    deleteNotificationConfig,
  };
}; 