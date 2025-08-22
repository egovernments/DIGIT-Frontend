
  
  const tenantId = Digit?.ULBService?.getCurrentTenantId();
  const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";
  export const MicroplanCampaignSearchConfig = [
    {
      label: "MICROPLAN_SEARCH",
      type: "search",
      apiDetails: {
        serviceName: "/plan-service/config/_search", 
        requestParam: {
        },
        requestBody: {
        "PlanConfigurationSearchCriteria": {
        "limit": 10,
        "offset": 0,
        "tenantId": tenantId,
    },
        },
        masterName: "commonUiConfig",
        moduleName: "MicroplanCampaignSearchConfig",
        minParametersForSearchForm: 0,
        tableFormJsonPath: "requestBody.PlanConfigurationSearchCriteria.pagination",
          // filterFormJsonPath: "requestBody.MdmsCriteria.customs",
          searchFormJsonPath: "requestBody.PlanConfigurationSearchCriteria",
      },
      sections: {
        search: {
          uiConfig: {
            formClassName: "custom-both-clear-search",
            primaryLabel: "ES_COMMON_SEARCH",
            secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
            minReqFields: 0,
            defaultValues:{
                microplanName: "",
                campaignType: "",
            },
            fields: [
              {
                label: "NAME_OF_MICROPLAN",
                isMandatory: false,
                key: "microplanName",
                type: "text",
                populators: {
                  name: "microplanName"
                },
              },
              // {
              //   label: "CAMPAIGN_SEARCH_TYPE",
              //   type: "apidropdown",
              //   isMandatory: false,
              //   disable: false,
              //   populators: {
              //     optionsCustomStyle: {
              //       top: "2.3rem",
              //     },
              //     name: "campaignType",
              //     optionsKey: "code",
              //     allowMultiSelect: false,
              //     masterName: "commonUiConfig",
              //     moduleName: "MyCampaignConfigDrafts",
              //     customfn: "populateCampaignTypeReqCriteria",
              //   },
              // },
            ],
          },

          show: true,
        },
        searchResult: {
          uiConfig: {
            columns: [
              {
                label: "NAME_OF_MICROPLAN",
                jsonPath: "name",
                additionalCustomization:true
              },
              {
                label:"CAMPAIGN_TYPE",
                jsonPath:"additionalDetails.campaignType",
                additionalCustomization:true
              },
              {
                label:"LAST_MODIFIED_TIME",
                jsonPath:"auditDetails.lastModifiedTime",
                additionalCustomization:true
              },
            ],
            resultsJsonPath: "PlanConfiguration",

            enableColumnSort: true,
            tableClassName: "table campaign-table",
          },
          show: true,
        },
        
      },
    },
  ];

  
