export const commodityCampaignConfig = {
  tenantId: "mz",
  moduleName: "commonCampaignUiConfig",
  showTab: true,
  commodityCampaignConfig: [
    {
      headerLabel: "CAMPAIGN_SEARCH_TITLE",
      label: "CAMPAIGN_ONGOING",
      type: "search",
      apiDetails: {
        serviceName: "/project-factory/v1/project-type/search",
        requestParam: {
          isLikeSearch: true,
          isOverrideDatesFromProject: true,
        },
        requestBody: {},
        minParametersForSearchForm: 0,
        minParametersForFilterForm: 0,
        masterName: "commonUiConfig",
        moduleName: "CommodityCampaignConfigOngoing",
        tableFormJsonPath: "requestBody.inbox",
        filterFormJsonPath: "requestBody.custom",
        searchFormJsonPath: "requestBody.custom",
      },
      sections: {
        search: {
          uiConfig: {
            headerLabel: "ES_COMMON_SEARCH",
            type: "search",
            headerStyle: null,
            primaryLabel: "Search",
            secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
            minReqFields: 0,
            defaultValues: {
              campaignName: "",
              campaignType: "",
            },
            sortConfig: {
              initialSortOrder: "desc",
              label: "SORT",
              variation: "teritiary",
              icon: "ImportExport",
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
                  moduleName: "CommodityCampaignConfigOngoing",
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
              customRowComponent: "HCMCommodityRowCard",
            },
            totalCountJsonPath: "totalCount",
            enableGlobalSearch: false,
            enableColumnSort: true,
            resultsJsonPath: "CampaignDetails",
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
    {
      headerLabel: "CAMPAIGN_SEARCH_TITLE",
      label: "CAMPAIGN_UPCOMING",
      type: "search",
      apiDetails: {
        serviceName: "/project-factory/v1/project-type/search",
        requestParam: {
          isLikeSearch: true,
          isOverrideDatesFromProject: true,
        },
        requestBody: {},
        minParametersForSearchForm: 0,
        minParametersForFilterForm: 0,
        masterName: "commonUiConfig",
        moduleName: "CommodityCampaignConfigUpcoming",
        tableFormJsonPath: "requestBody.inbox",
        filterFormJsonPath: "requestBody.custom",
        searchFormJsonPath: "requestBody.custom",
      },
      sections: {
        search: {
          uiConfig: {
            headerLabel: "ES_COMMON_SEARCH",
            type: "search",
            headerStyle: null,
            primaryLabel: "Search",
            secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
            minReqFields: 0,
            defaultValues: {
              campaignName: "",
              campaignType: "",
            },
            sortConfig: {
              initialSortOrder: "desc",
              label: "SORT",
              variation: "teritiary",
              icon: "ImportExport",
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
                  moduleName: "CommodityCampaignConfigUpcoming",
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
              customRowComponent: "HCMCommodityRowCard",
            },
            totalCountJsonPath: "totalCount",
            enableGlobalSearch: false,
            enableColumnSort: true,
            resultsJsonPath: "CampaignDetails",
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
    {
      headerLabel: "CAMPAIGN_SEARCH_TITLE",
      label: "CAMPAIGN_COMPLETED",
      type: "search",
      apiDetails: {
        serviceName: "/project-factory/v1/project-type/search",
        requestParam: {
          isLikeSearch: true,
          isOverrideDatesFromProject: true,
        },
        requestBody: {},
        minParametersForSearchForm: 0,
        minParametersForFilterForm: 0,
        masterName: "commonUiConfig",
        moduleName: "CommodityCampaignConfigCompleted",
        tableFormJsonPath: "requestBody.inbox",
        filterFormJsonPath: "requestBody.custom",
        searchFormJsonPath: "requestBody.custom",
      },
      sections: {
        search: {
          uiConfig: {
            headerLabel: "ES_COMMON_SEARCH",
            type: "search",
            headerStyle: null,
            primaryLabel: "Search",
            secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
            minReqFields: 0,
            defaultValues: {
              campaignName: "",
              campaignType: "",
            },
            sortConfig: {
              initialSortOrder: "desc",
              label: "SORT",
              variation: "teritiary",
              icon: "ImportExport",
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
                  moduleName: "CommodityCampaignConfigCompleted",
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
              customRowComponent: "HCMCommodityRowCard",
            },
            totalCountJsonPath: "totalCount",
            enableGlobalSearch: false,
            enableColumnSort: true,
            resultsJsonPath: "CampaignDetails",
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
