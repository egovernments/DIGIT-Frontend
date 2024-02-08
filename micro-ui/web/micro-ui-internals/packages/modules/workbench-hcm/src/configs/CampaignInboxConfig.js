const CampaignInboxConfig = () => {
    return {
      label: "WORKBENCH_CAMPAIGN_INBOX",
      type: "inbox",
      apiDetails: {
        serviceName: "/hcm-bff/hcm/_searchmicroplan",
        requestParam: {
        },
        requestBody: {
          CampaignDetails: {
          },
        },
        minParametersForSearchForm: 0,
        masterName: "commonUiConfig",
        moduleName: "InboxCampaignConfig",
        tableFormJsonPath: "requestBody.CampaignDetails",
        filterFormJsonPath: "requestBody.CampaignDetails",
        searchFormJsonPath: "requestBody.CampaignDetails",
      },
      sections: {
        search: {
          uiConfig: {
            headerStyle: null,
            formClassName: "custom-both-clear-search",
            primaryLabel: "ES_COMMON_SEARCH",
            secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
            minReqFields: 0,
            defaultValues: {
              campaignName: "",
              campaignNumber: "",
              projectTypeId: "",
              campaignType: "",
            },
            fields: [
              {
                label: "WORKBENCH_CAMPAIGN_NAME",
                type: "text",
                isMandatory: false,
                disable: false,
                populators: {
                  name: "campaignName",
                //   validation: { minlength: 2 },
                },
              },
              {
                label: "WORKBENCH_CAMPAIGN_NUMBER",
                type: "text",
                isMandatory: false,
                disable: false,
                populators: {
                  name: "campaignNumber",
                },
              },
              {
                label: "WORKBENCH_PROJECT_TYPE_ID",
                type: "dropdown",
                isMandatory: false,
                disable: false,
                populators: {
                  name: "projectTypeId",
                  optionsKey: "campaignType",
                  mdmsConfig: {
                   moduleName: "HCM-PROJECT-TYPES",
                   masterName: "projectTypes",
                  },
                },
              },
              {
                isMandatory: true,
                key: "campaignType",
                type: "radioordropdown",
                label: "CAMPAIGN_TYPE",
                disable: false,
                populators: {
                  name: "campaignType",
                  optionsKey: "campaignType",
                  // error: "ES__REQUIRED",
                  required: true,
                  mdmsConfig: {
                    moduleName: "HCM",
                    masterName: "HCMTemplate",
                  },
                },
              }
            ],
          },
          label: "",
          children: {},
          show: true,
        },
        // links: {
        //   uiConfig: {
        //     links: [
        //       {
        //         text: "WORKBENCH_BOUNDARY",
        //         url: "/employee/hcmworkbench/boundary",
        //         roles: ["SYSTEM_ADMINISTRATOR","CAMPAIGN_ADMIN"],
        //       },
        //       {
        //         text: "WORKBENCH_PROJECT",
        //         url: "/employee/hcmworkbench/project",
        //         roles: ["SYSTEM_ADMINISTRATOR","CAMPAIGN_ADMIN"],
        //       },
        //       {
        //         text: "WORKBENCH_USER",
        //         url: "/employee/hcmworkbench/user",
        //         roles: ["SYSTEM_ADMINISTRATOR","CAMPAIGN_ADMIN"],
        //       },
        //       {
        //         text: "WORKBENCH_FACILITY",
        //         url: "/employee/hcmworkbench/facility",
        //         roles: ["SYSTEM_ADMINISTRATOR","CAMPAIGN_ADMIN"],
        //       }
  
        //     ],
        //   },
        //   children: {},
        //   show: true,
        // },
        filter: {
          uiConfig: {
            type: "filter",
            headerStyle: null,
            primaryLabel: "WORKBENCH_APPLY",
            secondaryLabel: "",
            minReqFields: 1,
            defaultValues: {
              state: "",
              ward: [],
              locality: [],
              SortBy: {
                code: "empty",
                name: "SortBy",
              },
            },
            fields: [
              {
                label: "",
                type: "radio",
                isMandatory: false,
                disable: false,
                populators: {
                  name: "SortBy",
                  options: [
                    {
                      code: "ASC",
                      name: "WORKBENCH_ASC",
                    },
                    {
                      code: "DESC",
                      name: "WORKBENCH_DESC",
                    },
                  ],
                  optionsKey: "name",
                  styles: {
                    gap: "1rem",
                    flexDirection: "column",
                  },
                  innerStyles: {
                    display: "flex",
                  },
                },
              },
              {
                label: "ES_COMMON_CREATED_BY",
                type: "dropdown",
                isMandatory: false,
                disable: false,
                populators: {
                  name: "createdBy",
                  optionsKey: "name",
                  optionsCustomStyle : {
                    top : "2.3rem"
                  },
                  mdmsConfig: {
                    masterName: "NatureOfWork",
                    moduleName: "works",
                    localePrefix: "COMMON_MASTERS"
                  }
                }
            },
            ],
          },
          label: "Sort By",
          show: true,
        },
        searchResult: {
          label: "",
          uiConfig: {
            columns: [
              {
                label: "WORKBENCH_CAMPAIGN_NUMBER",
                jsonPath: "campaignnumber",
                additionalCustomization: true,
              },
              {
                label: "WORKBENCH_CAMPAIGN_TYPE",
                jsonPath: "campaigntype",
              },
              {
                label: "WORKBENCH_CREATED_TIME",
                jsonPath: "createdTime",
                additionalCustomization: true,
              },
              {
                label: "WORKBENCH_CAMPAIGN_STATUS",
                jsonPath: "status",
              //   additionalCustomization: true,
              },
            ],
            enableGlobalSearch: false,
            enableColumnSort: true,
            resultsJsonPath: "job",
          },
          children: {},
          show: true,
        },
      },
    };
  };
  
  export default CampaignInboxConfig;