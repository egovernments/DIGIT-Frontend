const createTabConfig = (label, moduleName) => ({
  headerLabel: "CAMPAIGN_SEARCH_TITLE",
  label,
  type: "search",
  apiDetails: {
    serviceName: "",
    requestParam: {},
    requestBody: {},
    minParametersForSearchForm: 0,
    minParametersForFilterForm: 0,
    masterName: "commonUiConfig",
    moduleName,
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
  customHookName: "campaign.useCommodityProjectSearch",
});

export const commodityCampaignConfig = {
  tenantId: "mz",
  moduleName: "commonCampaignUiConfig",
  showTab: true,
  commodityCampaignConfig: [
    createTabConfig("CAMPAIGN_ONGOING", "CommodityProjectOngoing"),
    createTabConfig("CAMPAIGN_UPCOMING", "CommodityProjectUpcoming"),
    createTabConfig("CAMPAIGN_COMPLETED", "CommodityProjectCompleted"),
  ],
};
