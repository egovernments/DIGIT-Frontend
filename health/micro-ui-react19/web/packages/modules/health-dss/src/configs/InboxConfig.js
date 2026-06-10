export const InboxConfig = {
  tenantId: "mz",
  moduleName: "commonDSSUiConfig",
  showTab: true,
  InboxConfig: [
    {
      headerLabel: "CAMPAIGN_SEARCH_TITLE",
      label: "ALL_CAMPAIGNS",
      type: "search",
      apiDetails: {
        serviceName:
           window?.globalConfigs?.getConfig("PROJECT_SERVICE_PATH")
             ? `/${String(window.globalConfigs.getConfig("PROJECT_SERVICE_PATH"))}/staff/v1/_search`
             : "/health-project/staff/v1/_search",
        requestParam: {},
        requestBody: {
          ProjectStaff: {},
        },
        minParametersForSearchForm: 0,
        minParametersForFilterForm: 0,
        masterName: "commonUiConfig",
        moduleName: "CampaignsInboxConfig",
        tableFormJsonPath: "requestBody.ProjectStaff",
        filterFormJsonPath: "requestBody.ProjectStaff",
        searchFormJsonPath: "requestBody.ProjectStaff",
      },
      sections: {
        search: {
          uiConfig: {
            headerLabel: "ES_COMMON_SEARCH",
            type: "search",
            typeMobile: "filter",
            headerStyle: null,
            primaryLabel: "FILTER",
            primaryLabelVariation: "teritiary",
            primaryLabelIcon: "FilterListAlt",
            secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
            minReqFields: 0,
            defaultValues: {
              campaignName: "",
              campaignType: "",
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
                  name: "campaignType",
                  optionsKey: "code",
                  allowMultiSelect: false,
                  masterName: "commonUiConfig",
                  moduleName: "CampaignsInboxConfig",
                  customfn: "populateCampaignTypeReqCriteria",
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
              customRowComponent: "DSSCampaignRowCard",
            },
            totalCountJsonPath: "totalCount",
            enableGlobalSearch: false,
            enableColumnSort: true,
            resultsJsonPath: "Project",
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
      customHookName: "DSS.useInboxSearch",
    },
    // {
    //   headerLabel: "CAMPAIGN_SEARCH_TITLE",
    //   label: "PAST_CAMPAIGNS",
    //   type: "search",
    //   apiDetails: {
    //     serviceName:
    //        window?.globalConfigs?.getConfig("PROJECT_SERVICE_PATH")
    //          ? `/${String(window.globalConfigs.getConfig("PROJECT_SERVICE_PATH"))}/staff/v1/_search`
    //          : "/health-project/staff/v1/_search",
    //     requestParam: {},
    //     requestBody: {
    //       ProjectStaff: {},
    //     },
    //     minParametersForSearchForm: 0,
    //     minParametersForFilterForm: 0,
    //     masterName: "commonUiConfig",
    //     moduleName: "CampaignsInboxConfig",
    //     tableFormJsonPath: "requestBody.ProjectStaff",
    //     filterFormJsonPath: "requestBody.ProjectStaff",
    //     searchFormJsonPath: "requestBody.ProjectStaff",
    //   },
    //   sections: {
    //     search: {
    //       uiConfig: {
    //         headerLabel: "ES_COMMON_SEARCH",
    //         type: "search",
    //         typeMobile: "filter",
    //         headerStyle: null,
    //         primaryLabel: "FILTER",
    //         primaryLabelVariation: "teritiary",
    //         primaryLabelIcon: "FilterListAlt",
    //         secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
    //         minReqFields: 0,
    //         defaultValues: {
    //           campaignName: "",
    //           campaignType: "",
    //         },
    //         fields: [
    //           {
    //             label: "CAMPAIGN_SEARCH_NAME",
    //             type: "text",
    //             isMandatory: false,
    //             disable: false,
    //             populators: {
    //               name: "campaignName",
    //               error: "TQM_ERR_VALID_CAMPAIGN_NAME",
    //               style: {
    //                 marginBottom: "0px",
    //               },
    //             },
    //           },
    //           {
    //             label: "CAMPAIGN_SEARCH_TYPE",
    //             type: "apidropdown",
    //             isMandatory: false,
    //             disable: false,
    //             populators: {
    //               name: "campaignType",
    //               optionsKey: "code",
    //               allowMultiSelect: false,
    //               masterName: "commonUiConfig",
    //               moduleName: "CampaignsInboxConfig",
    //               customfn: "populateCampaignTypeReqCriteria",
    //             },
    //           },
    //         ],
    //       },
    //       label: "",
    //       labelMobile: "ES_COMMON_SEARCH",
    //       children: {},
    //       show: true,
    //     },
    //     searchResult: {
    //       uiConfig: {
    //         customRow: {
    //           overRideRowWithCustomRowComponent: true,
    //           customRowComponent: "DSSCampaignRowCard",
    //         },
    //         totalCountJsonPath: "totalCount",
    //         enableGlobalSearch: false,
    //         enableColumnSort: true,
    //         resultsJsonPath: "Project",
    //         tableClassName: "table campaign-table",
    //       },
    //       children: {},
    //       show: true,
    //     },
    //     links: {
    //       show: false,
    //     },
    //     filter: {
    //       show: false,
    //     },
    //   },
    //   additionalSections: {},
    //   persistFormData: true,
    //   showAsRemovableTagsInMobile: true,
    //   customHookName: "DSS.useInboxSearch",
    // },
    // {
    //   headerLabel: "CAMPAIGN_SEARCH_TITLE",
    //   label: "LIVE_CAMPAIGNS",
    //   type: "search",
    //   apiDetails: {
    //     serviceName:
    //        window?.globalConfigs?.getConfig("PROJECT_SERVICE_PATH")
    //          ? `/${String(window.globalConfigs.getConfig("PROJECT_SERVICE_PATH"))}/staff/v1/_search`
    //          : "/health-project/staff/v1/_search",
    //     requestParam: {},
    //     requestBody: {
    //       ProjectStaff: {},
    //     },
    //     minParametersForSearchForm: 0,
    //     minParametersForFilterForm: 0,
    //     masterName: "commonUiConfig",
    //     moduleName: "CampaignsInboxConfig",
    //     tableFormJsonPath: "requestBody.ProjectStaff",
    //     filterFormJsonPath: "requestBody.ProjectStaff",
    //     searchFormJsonPath: "requestBody.ProjectStaff",
    //   },
    //   sections: {
    //     search: {
    //       uiConfig: {
    //         headerLabel: "ES_COMMON_SEARCH",
    //         type: "search",
    //         typeMobile: "filter",
    //         headerStyle: null,
    //         primaryLabel: "FILTER",
    //         primaryLabelVariation: "teritiary",
    //         primaryLabelIcon: "FilterListAlt",
    //         secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
    //         minReqFields: 0,
    //         defaultValues: {
    //           campaignName: "",
    //           campaignType: "",
    //         },
    //         fields: [
    //           {
    //             label: "CAMPAIGN_SEARCH_NAME",
    //             type: "text",
    //             isMandatory: false,
    //             disable: false,
    //             populators: {
    //               name: "campaignName",
    //               error: "TQM_ERR_VALID_CAMPAIGN_NAME",
    //               style: {
    //                 marginBottom: "0px",
    //               },
    //             },
    //           },
    //           {
    //             label: "CAMPAIGN_SEARCH_TYPE",
    //             type: "apidropdown",
    //             isMandatory: false,
    //             disable: false,
    //             populators: {
    //               name: "campaignType",
    //               optionsKey: "code",
    //               allowMultiSelect: false,
    //               masterName: "commonUiConfig",
    //               moduleName: "CampaignsInboxConfig",
    //               customfn: "populateCampaignTypeReqCriteria",
    //             },
    //           },
    //         ],
    //       },
    //       label: "",
    //       labelMobile: "ES_COMMON_SEARCH",
    //       children: {},
    //       show: true,
    //     },
    //     searchResult: {
    //       uiConfig: {
    //         customRow: {
    //           overRideRowWithCustomRowComponent: true,
    //           customRowComponent: "DSSCampaignRowCard",
    //         },
    //         totalCountJsonPath: "totalCount",
    //         enableGlobalSearch: false,
    //         enableColumnSort: true,
    //         resultsJsonPath: "Project",
    //         tableClassName: "table campaign-table",
    //       },
    //       children: {},
    //       show: true,
    //     },
    //     links: {
    //       show: false,
    //     },
    //     filter: {
    //       show: false,
    //     },
    //   },
    //   additionalSections: {},
    //   persistFormData: true,
    //   showAsRemovableTagsInMobile: true,
    //   customHookName: "DSS.useInboxSearch",
    // },
  ],
};
