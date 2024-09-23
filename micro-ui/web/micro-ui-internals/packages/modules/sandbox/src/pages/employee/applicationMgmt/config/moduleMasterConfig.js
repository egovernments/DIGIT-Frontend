export const moduleMasterConfig = (module) => ({
  tenantId: "mz",
  moduleName: "commonSandboxUiConfig",
  showTab: false,
  moduleMasterConfig: [
    {
      label: `SANDBOX_TITLE_${module}`,
      code: module,
      type: "search",
      additionalDetails: {
        moduleName: module,
      },
      apiDetails: {
        serviceName: `/${window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH")}/v1/_search`,
        requestParam: {},
        requestBody: {},
        minParametersForSearchForm: 0,
        minParametersForFilterForm: 0,
        masterName: "commonUiConfig",
        moduleName: "moduleMasterConfig",
        tableFormJsonPath: "requestBody.inbox",
        filterFormJsonPath: "requestBody.custom",
        searchFormJsonPath: "requestBody.custom",
        // customHookName:"useCustomMDMS"
      },
      sections: {
        search: {
          uiConfig: {
            headerLabel: "ES_COMMON_SEARCH",
            type: "search",
            typeMobile: "filter",
            searchWrapperStyles: {
              flexDirection: "column-reverse",
              marginTop: "1.4rem",
              alignItems: "center",
              justifyContent: "end",
              gridColumn: "3",
            },
            headerStyle: null,
            primaryLabel: "Search",
            secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
            minReqFields: 0,
            defaultValues: {
              name: "",
              type: "",
            },
            fields: [
              {
                label: "CAMPAIGN_SEARCH_NAME",
                type: "text",
                isMandatory: false,
                disable: false,
                populators: {
                  name: "campaignName",
                  error: "TQM_ERR_VALID_CAMPAIGN_NAME",
                  style: {
                    marginBottom: "0px",
                  },
                },
              },
              {
                label: "CAMPAIGN_SEARCH_TYPE",
                type: "apidropdown",
                isMandatory: false,
                disable: false,
                populators: {
                  optionsCustomStyle: {
                    top: "2.3rem",
                  },
                  name: "campaignType",
                  optionsKey: "code",
                  allowMultiSelect: false,
                  masterName: "commonUiConfig",
                  moduleName: "MyCampaignConfigOngoing",
                  customfn: "populateCampaignTypeReqCriteria",
                },
              },
            ],
          },
          label: "",
          labelMobile: "ES_COMMON_SEARCH",
          children: {},
          show: false,
        },
        searchResult: {
          uiConfig: {
            columns: [
              // {
              //   label: "SANDBOX_MODULE_NAME",
              //   jsonPath: "code",
              //   additionalCustomization: true,
              // },
              {
                label: "SANDBOX_MASTER_NAME",
                jsonPath: "master",
                additionalCustomization: true,
              },
              {
                label: "SANDBOX_MASTER_DESCRIPTION",
                jsonPath: "type",
                additionalCustomization: true,
              },
              {
                label: "SANDBOX_ACTIONS",
                jsonPath: "actions",
                additionalCustomization: true,
                module: module
                // disableSortBy: true,
              },
            ],
            enableGlobalSearch: false,
            enableColumnSort: true,
            resultsJsonPath: "master",
            tableClassName: "table sandbox-application-table",
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
      showAsRemovableTagsInMobile: false,
    },
  ],
});
