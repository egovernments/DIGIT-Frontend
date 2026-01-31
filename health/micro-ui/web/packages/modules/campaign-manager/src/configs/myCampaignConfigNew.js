/* The above code defines a JavaScript object `myCampaignConfig` which contains configurations for
different types of campaigns - ongoing, completed, and drafts. Each campaign type has its own search
configuration with fields like campaign name, type, start date, end date, etc. The configurations
also include API details for fetching data, UI styles, search result columns, pagination settings,
and more. The object is exported for use in other parts of the codebase. */
export const myCampaignConfigNew = {
  tenantId: "mz",
  moduleName: "commonCampaignUiConfig",
  showTab: true,
  myCampaignConfigNew: [
    {
      headerLabel: "CAMPAIGN_SEARCH_TITLE",
      label: "CAMPAIGN_ONGOING",
      type: "search",
      apiDetails: {
        serviceName: "/project-factory/v1/project-type/search",
        requestParam: {
          isLikeSearch: true,
          isOverrideDatesFromProject: true
        },
        requestBody: {},
        minParametersForSearchForm: 0,
        minParametersForFilterForm: 0,
        masterName: "commonUiConfig",
        moduleName: "MyCampaignConfigOngoing",
        tableFormJsonPath: "requestBody.inbox",
        filterFormJsonPath: "requestBody.custom",
        searchFormJsonPath: "requestBody.custom",
      },
      sections: {
        search: {
          uiConfig: {
            headerLabel: "ES_COMMON_SEARCH",
            type: "search",
            // typeMobile: "filter",
            headerStyle: null,
            primaryLabel: "Search",
            // primaryLabelVariation: "teritiary",
            // primaryLabelIcon: "FilterListAlt",
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
                  moduleName: "MyCampaignConfigOngoing",
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
              customRowComponent: "HCMMyCampaignRowCard",
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
          isOverrideDatesFromProject: true
        },
        requestBody: {},
        minParametersForSearchForm: 0,
        minParametersForFilterForm: 0,
        masterName: "commonUiConfig",
        moduleName: "MyCampaignConfigUpcoming",
        tableFormJsonPath: "requestBody.inbox",
        filterFormJsonPath: "requestBody.custom",
        searchFormJsonPath: "requestBody.custom",
      },
      sections: {
        search: {
          uiConfig: {
            headerLabel: "ES_COMMON_SEARCH",
            type: "search",
            // typeMobile: "filter",
            headerStyle: null,
            primaryLabel: "Search",
            // primaryLabelVariation: "teritiary",
            // primaryLabelIcon: "FilterListAlt",
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
                  moduleName: "MyCampaignConfigUpcoming",
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
              customRowComponent: "HCMMyCampaignRowCard",
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
      label: "CAMPAIGN_DRAFTS",
      type: "search",
      apiDetails: {
        serviceName: "/project-factory/v1/project-type/search",
        requestParam: {
          isLikeSearch: true,
          isOverrideDatesFromProject: true
        },
        requestBody: {},
        minParametersForSearchForm: 0,
        minParametersForFilterForm: 0,
        masterName: "commonUiConfig",
        moduleName: "MyCampaignConfigDrafts",
        tableFormJsonPath: "requestBody.inbox",
        filterFormJsonPath: "requestBody.custom",
        searchFormJsonPath: "requestBody.custom",
      },
      sections: {
        search: {
          uiConfig: {
            headerLabel: "ES_COMMON_SEARCH",
            type: "search",
            // typeMobile: "filter",
            headerStyle: null,
            primaryLabel: "Search",
            // primaryLabelVariation: "teritiary",
            // primaryLabelIcon: "FilterListAlt",
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
                  moduleName: "MyCampaignConfigDrafts",
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
              customRowComponent: "HCMMyCampaignRowCard",
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
          isOverrideDatesFromProject: true
        },
        requestBody: {},
        minParametersForSearchForm: 0,
        minParametersForFilterForm: 0,
        masterName: "commonUiConfig",
        moduleName: "MyCampaignConfigCompleted",
        tableFormJsonPath: "requestBody.inbox",
        filterFormJsonPath: "requestBody.custom",
        searchFormJsonPath: "requestBody.custom",
      },
      sections: {
        search: {
          uiConfig: {
            headerLabel: "ES_COMMON_SEARCH",
            type: "search",
            // typeMobile: "filter",
            headerStyle: null,
            primaryLabel: "Search",
            // primaryLabelVariation: "teritiary",
            // primaryLabelIcon: "FilterListAlt",
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
                  moduleName: "MyCampaignConfigCompleted",
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
              customRowComponent: "HCMMyCampaignRowCard",
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
      label: "CAMPAIGN_FAILED",
      type: "search",
      apiDetails: {
        serviceName: "/project-factory/v1/project-type/search",
        requestParam: {
          isLikeSearch: true,
          isOverrideDatesFromProject: true
        },
        requestBody: {},
        minParametersForSearchForm: 0,
        minParametersForFilterForm: 0,
        masterName: "commonUiConfig",
        moduleName: "MyCampaignConfigFailed",
        tableFormJsonPath: "requestBody.inbox",
        filterFormJsonPath: "requestBody.custom",
        searchFormJsonPath: "requestBody.custom",
      },
      sections: {
        search: {
          uiConfig: {
            headerLabel: "ES_COMMON_SEARCH",
            type: "search",
            // typeMobile: "filter",
            headerStyle: null,
            primaryLabel: "Search",
            // primaryLabelVariation: "teritiary",
            // primaryLabelIcon: "FilterListAlt",
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
                  moduleName: "MyCampaignConfigCompleted",
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
              customRowComponent: "HCMMyCampaignRowCard",
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
