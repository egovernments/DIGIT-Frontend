const tenantId = Digit?.ULBService?.getCurrentTenantId() || "mz";
const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";
export const campaignTemplateConfig = {
  tenantId: tenantId,
  moduleName: "campaignTemplateConfig",
  showTab: false,
  campaignTemplateConfig: [
    {
      headerLabel: "CAMPAIGN_TEMPLATES",
      label: "CAMPAIGN_TEMPLATES",
      type: "search",
      apiDetails: {
        serviceName: `/${mdms_context_path}/v2/_search`,
        requestParam: {},
        requestBody: {
          MdmsCriteria: {
            tenantId: tenantId,
            schemaCode: "HCM-ADMIN-CONSOLE.campaignTypeTemplates",
            limit: "10000",
            isActive: true
          },
        },
        minParametersForSearchForm: 0,
        minParametersForFilterForm: 0,
        masterName: "commonUiConfig",
        moduleName: "CampaignTemplateConfig",
        tableFormJsonPath: "requestBody.MdmsCriteria",
        filterFormJsonPath: "requestBody.MdmsCriteria.filters",
        searchFormJsonPath: "requestBody.MdmsCriteria.filters",
      },
      sections: {
        search: {
          uiConfig: {
            headerLabel: "ES_COMMON_SEARCH",
            type: "search",
            typeMobile: "filter",
            searchWrapperStyles: {
            },
            headerStyle: null,
            primaryLabel: "Search",
            secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
            minReqFields: 0,
            defaultValues: {
              templateName: "",
              campaignType: null,
              disease: "",
            },
            fields: [
              {
                label: "SEARCH_TEMPLATES",
                type: "text",
                isMandatory: false,
                disable: false,
                populators: {
                  name: "templateName",
                  error: "INVALID_TEMPLATE_NAME",
                },
              },
              {
                label: "FILTER_BY_CAMPAIGN_TYPE",
                type: "apidropdown",
                isMandatory: false,
                disable: false,
                populators: {
                  name: "campaignType",
                  optionsKey: "code",
                  allowMultiSelect: false,
                  masterName: "commonUiConfig",
                  moduleName: "CampaignTemplateConfig",
                  customfn: "populateCampaignTypeReqCriteria",
                },
              },
              {
                label: "FILTER_BY_DISEASE",
                type: "apidropdown",
                isMandatory: false,
                disable: false,
                populators: {
                  name: "disease",
                  optionsKey: "code",
                  allowMultiSelect: false,
                  masterName: "commonUiConfig",
                  moduleName: "CampaignTemplateConfig",
                  customfn: "populateDiseasesReqCriteria",
                },
              },
            ],
          },
          label: "",
          labelMobile: "ES_COMMON_SEARCH",
          children: {},
          show: true,
        },
        searchResult: {
          uiConfig: {
            customRow: {
              overRideRowWithCustomRowComponent: true,
              customRowComponent: "CampaignTemplateRowCard",
            },
            totalCountJsonPath: "totalCount",
            enableGlobalSearch: false,
            enableColumnSort: false,
            resultsJsonPath: "mdms",
            tableClassName: "table campaign-table",
          },
          children: {},
          show: true,
        },
        links: {
          show: false,
        },
        filter: {
          show: false,
        },
      },
      additionalSections: {},
      persistFormData: true,
      showAsRemovableTagsInMobile: true,
    },
  ],
};
