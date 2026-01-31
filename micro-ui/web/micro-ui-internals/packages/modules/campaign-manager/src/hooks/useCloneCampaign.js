import { useSearchCampaign } from "./services/useSearchCampaign";
import { useMutation } from "@tanstack/react-query";
import useCreateCampaign from "./useCreateCampaign";
import getMDMSUrl from "../utils/getMDMSUrl";
import { useMemo, useEffect, useState } from "react";
import { HCMCONSOLE_APPCONFIG_MODULENAME } from "../pages/employee/NewCampaignCreate/CampaignDetails";

const useCloneCampaign = ({ tenantId, campaignId, campaignName, startDate, endDate, setStep }) => {
  // Constants for MDMS schema and localization modules
  const CONSOLE_MDMS_MODULENAME = "HCM-ADMIN-CONSOLE";
  const SCHEMA_CODES = [HCMCONSOLE_APPCONFIG_MODULENAME];

  const url = getMDMSUrl(true);
  const SERVICE_REQUEST_CONTEXT_PATH = window?.globalConfigs?.getConfig("SERVICE_REQUEST_CONTEXT_PATH") || "health-service-request";

  // Fetch the existing campaign data to clone
  const { data: campaignData, isLoading: campaignLoading, error: campaignError } = useSearchCampaign({
    tenantId,
    filter: { ids: [campaignId] },
    config: {
      enabled: !!campaignId,
      select: (data) => data?.[0],
    },
  });

  // Fetch checklist codes from MDMS
  const reqChecklistCodes = {
    url: `${url}/v2/_search`,
    body: {
      MdmsCriteria: {
        tenantId,
        schemaCode: `HCM.CHECKLIST_TYPES`,
        isActive: true,
      },
    },
  };

  const { data: checklistCodesData, isLoading: isChecklistMDMSLoading, error: checklistCodesError } = Digit.Hooks.useCustomAPIHook(reqChecklistCodes);

  // Fetch roles relevant to checklists
  const reqRoles = {
    url: `/${Digit.Hooks.workbench.getMDMSContextPath()}/v2/_search`,
    body: {
      MdmsCriteria: {
        tenantId,
        schemaCode: `${CONSOLE_MDMS_MODULENAME}.rolesForChecklist`,
        isActive: true,
      },
    },
  };

  const { data: roleData, isLoading: isRolesLoading, error: rolesError } = Digit.Hooks.useCustomAPIHook(reqRoles);

  // Generate service codes based on campaign, checklist, and role data
  const serviceCodes = useMemo(() => {
    return (
      checklistCodesData?.mdms
        ?.flatMap((checklist) => roleData?.mdms?.map((role) => `${campaignData?.campaignName}.${checklist?.data?.code}.${role?.data?.code}`))
        .filter(Boolean) || []
    );
  }, [checklistCodesData, roleData, campaignData]);

  // Fetch service definitions based on generated service codes
  const serviceDefinitionFetchReq = {
    url: `/${SERVICE_REQUEST_CONTEXT_PATH}/service/definition/v1/_search`,
    body: {
      ServiceDefinitionCriteria: {
        tenantId,
        code: serviceCodes,
      },
      includeDeleted: true,
    },
    config: {
      enabled: !!serviceCodes.length && !!campaignData?.campaignName && !!checklistCodesData?.mdms?.length && !!roleData?.mdms?.length,
    },
  };

  // Prepare request to fetch service definitions for cloning
  const { isLoading: isServiceDefsLoading, data: serviceDefinitionsData } = Digit.Hooks.useCustomAPIHook(serviceDefinitionFetchReq);

  // State for storing MDMS data and loading/errors
  const [mdmsData, setMdmsData] = useState([]);
  const [isMDMSLoading, setIsMDMSLoading] = useState(true);
  const [formConfigError, setFormConfigError] = useState(null);
  const [error, setError] = useState(null);

  // Fetch MDMS entries based on the schema codes and campaign project ID
  useEffect(() => {
    const fetchAllSchemas = async () => {
      try {
        const results = await Promise.all(
          SCHEMA_CODES.map((schemaCode) =>
            Digit.CustomService.getResponse({
              url: `${url}/v2/_search`,
              body: {
                MdmsCriteria: {
                  tenantId,
                  schemaCode: `${CONSOLE_MDMS_MODULENAME}.${schemaCode}`,
                  isActive: true,
                  filters: { project: campaignData?.campaignNumber },
                },
              },
            }).then(
              (res) =>
                res?.mdms?.map((mdms) => ({
                  schemaCode: `${CONSOLE_MDMS_MODULENAME}.${schemaCode}`,
                  data: mdms?.data,
                })) || []
            )
          )
        );
        setMdmsData(results.flat());
        setIsMDMSLoading(false);
      } catch (error) {
        console.error("MDMS fetch error:", error);
        setFormConfigError(error);
        setIsMDMSLoading(false);
      }
    };

    if (campaignData?.campaignNumber) fetchAllSchemas();
  }, [campaignData?.campaignNumber]);

  // Hook to create a new campaign
  const createCampaign = useCreateCampaign(tenantId);

  // Mutation to create new MDMS entries using a dynamic URL with schemaCode
  const mdmsCreateMutation = useMutation(
    async ({ schemaCode, body }) => {
      const dynamicUrl = `/${Digit.Hooks.workbench.getMDMSContextPath()}/v2/_create/${schemaCode}`;
      const res = await Digit.CustomService.getResponse({
        url: dynamicUrl,
        body,
      });
      return res;
    },
    {
      select: (data) => data?.SchemaDefinitions?.[0] || {},
    }
  );

  // Mutation to create new MDMS entries using a dynamic URL with schemaCode
  const mdmsUpdateMutation = useMutation(
    async ({ schemaCode, body }) => {
      const dynamicUrl = `/${Digit.Hooks.workbench.getMDMSContextPath()}/v2/_update/${schemaCode}`;
      const res = await Digit.CustomService.getResponse({
        url: dynamicUrl,
        body,
      });
      return res;
    },
    {
      select: (data) => data?.SchemaDefinitions?.[0] || {},
    }
  );

  // Hook to create service definitions (checklists)
  const useCreateChecklist = Digit.Hooks.campaign.useCreateChecklist(tenantId);

  // Clone all MDMS records by regenerating uniqueIdentifiers and replacing campaignNumber
  const createAllMDMSRecords = async (newCampaignNumber) => {
    const existingCampaignConfig = await Promise.all(
      SCHEMA_CODES.map((schemaCode) =>
        Digit.CustomService.getResponse({
          url: `${url}/v2/_search`,
          body: {
            MdmsCriteria: {
              tenantId,
              schemaCode: `${CONSOLE_MDMS_MODULENAME}.${schemaCode}`,
              isActive: true,
              filters: { project: newCampaignNumber },
            },
          },
        }).then((res) => res?.mdms || [])
      )
    );
    const existingCampaignConfigList = existingCampaignConfig?.flat();

    if (existingCampaignConfigList?.length > 0) {
      for (const newItem of mdmsData) {
        // find the existing MDMS object whose data.name matches
        const existingItem = existingCampaignConfigList?.find((e) => e.data?.name === newItem.data?.name);
        if (!existingItem) continue; // nothing to update if no match

        // build payload by taking the full existing object,
        // but swapping in the fresh data + project number
        const payload = {
          Mdms: {
            ...existingItem,
            data: {
              ...newItem.data,
              project: newCampaignNumber,
            },
          },
        };
        try {
          await mdmsUpdateMutation.mutateAsync({
            schemaCode: existingItem.schemaCode,
            body: payload,
          });
        } catch (err) {
          setError(err);
          console.error(`Failed to update MDMS entry for ${existingItem.data?.name}`, err);
          throw new Error(`MDMS update failed for ${existingItem.data?.name}`);
        }
      }
    } else {
      for (const mdmsItem of mdmsData) {
        const payload = {
          Mdms: {
            tenantId,
            schemaCode: mdmsItem.schemaCode,
            data: {
              ...mdmsItem.data,
              project: newCampaignNumber,
            },
            isActive: true,
          },
        };
        try {
          const res = await mdmsCreateMutation.mutateAsync({
            schemaCode: mdmsItem.schemaCode,
            body: payload,
          });
        } catch (err) {
          setError(err);
          console.error(`Failed to create MDMS entry for ${mdmsItem.data?.name}`, err);
          throw new Error(`MDMS creation failed for ${mdmsItem.data?.name}`);
        }
      }
    }
  };

  // Clone all checklists by resetting their IDs and updating their codes
  const createAllChecklists = async (campaignName) => {
    if (!serviceDefinitionsData?.ServiceDefinitions?.length) return;
    await Promise.all(
      serviceDefinitionsData.ServiceDefinitions.map(async (def) => {
        const modifiedDefinition = {
          ...def,
          id: null,
          code: def.code.replace(`${campaignData?.campaignName}`, campaignName),
        };
        try {
          await useCreateChecklist.mutateAsync(modifiedDefinition);
        } catch (err) {
          setError(err);
          console.error("Checklist creation failed for:", modifiedDefinition.code, err);
          throw new Error(`Checklist creation failed for ${modifiedDefinition.code}`);
        }
      })
    );
  };

  // Main mutation to orchestrate the entire cloning flow
  const { mutateAsync, isLoading: mutationLoading, error: mutationError } = useMutation(async () => {
    try {
      // Step 0: Set initial progress step after fetching campaign details
      setStep(0);
      if (!campaignData) throw new Error("Campaign not found");

      // Step 1: Prepare modified campaign payload
      const modifiedCampaign = {
        ...campaignData,
        campaignName,
        deliveryRules: [],
        // resources: [],
        parentId: null,
        isActive: true,
        campaignNumber: null,
        projectId: null,
        id: null,
        startDate: startDate ? new Date(startDate).getTime() : null,
        endDate: endDate ? new Date(endDate).getTime() : null,
        action: "draft",
        status: "drafted",
      };

      setStep(1);
      const createRes = await createCampaign.mutateAsync(modifiedCampaign);
      const newCampaignNumber = createRes?.CampaignDetails?.campaignNumber;
      if (!newCampaignNumber) {
        setError(mutationError);
        throw new Error("Campaign creation returned no campaign number");
      }

      // Step 2: Clone MDMS and checklist definitions
      setStep(2);
      await Promise.all([createAllMDMSRecords(newCampaignNumber), createAllChecklists(campaignName)]);
      setStep(3);
      const languages = Digit?.SessionStorage.get("initData")?.languages || [];
      const mdmsModules = mdmsData
        .map((item) => {
          const moduleBase = item?.data?.name?.toString()?.toLowerCase();
          return moduleBase ? `hcm-${moduleBase}` : null;
        })
        .filter(Boolean);

      for (const lang of languages) {
        const locale = lang?.value;
        if (!locale) continue;

        for (const mod of mdmsModules) {
          const oldModule = `${mod}-${campaignData?.campaignNumber}`;
          const newModule = `${mod}-${newCampaignNumber}`;

          try {
            // SEARCH localization entries for old module
            const localisationData = await Digit.CustomService.getResponse({
              url: `/localization/messages/v1/_search`,
              params: {
                locale,
                module: oldModule,
                tenantId,
              },
            });

            if (localisationData?.messages?.length) {
              const updatedMessages = localisationData.messages.map((msg) => ({
                ...msg,
                locale,
                module: newModule, // Replace module with new module name
              }));

              // UPSERT updated messages under new module
              await Digit.CustomService.getResponse({
                url: "/localization/messages/v1/_upsert",
                body: {
                  tenantId,
                  messages: updatedMessages,
                },
              });
            }
          } catch (error) {
            setError(error);
            console.error(`Localization upsert failed for locale ${locale}, module ${mod}:`, error);
            throw new Error(`Localization upsert failed for locale ${locale}, module ${mod}`);
          }
        }
      }
      setStep(4);
      return {
        success: true,
        CampaignDetails: createRes?.CampaignDetails,
      };
    } catch (error) {
      setError(error);
      console.error("Error during campaign copy:", error);
      throw error;
    }
  });

  // Return hook results
  return {
    mutateAsync,
    isLoading: mutationLoading,
    campaignDetailsLoading: campaignLoading || isMDMSLoading || isChecklistMDMSLoading || isRolesLoading || isServiceDefsLoading,
    error: error || mutationError || campaignError || formConfigError || checklistCodesError || rolesError,
    CampaignDetails: campaignData,
  };
};

export default useCloneCampaign;
