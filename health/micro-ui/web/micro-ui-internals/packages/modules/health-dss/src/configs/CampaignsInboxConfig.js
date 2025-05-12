const tenantId = Digit.ULBService.getCurrentTenantId();

export const CampaignsInboxConfig = ({ headerLabel }) => {
  return {
    moduleName: "CampaignsInboxConfig",
    CampaignsInboxConfig: [
      // for live campaigns
      {
        headerLabel: headerLabel,
        type: "inbox",
        apiDetails: {
          serviceName: `/health-project/staff/v1/_search`,
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
              primaryLabel: "Search",
              secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
              minReqFields: 0,
              defaultValues: {
                dateRange: "",
              },
              fields: [
                {
                  label: "Date Range",
                  key: "dateRange",
                  type: "dateRange",
                  isMandatory: false,
                  populators: {
                    name: "dateRange",
                  },
                },
              ],
            },
            label: "",
            children: {},
            show: true,
          },
          searchResult: {
            uiConfig: {
              columns: [
                {
                  label: "CAMPAIGN_NAME",
                  jsonPath: "name",
                  additionalCustomization: true,
                },
                {
                  label: "BOUNDARY_NAME",
                  jsonPath: "address.boundary",
                  additionalCustomization: true,
                },
                {
                  label: "START_DATE",
                  jsonPath: "startDate",
                  additionalCustomization: true,
                },
                {
                  label: "PLANNED_END_DATE",
                  jsonPath: "endDate",
                  additionalCustomization: true,
                },
                {
                  label: "ACTIONS",
                  jsonPath: "",
                  additionalCustomization: true,
                },
              ],
              enableGlobalSearch: false,
              enableColumnSort: true,
              resultsJsonPath: "Project",
            },
            children: {},
            show: true,
          },
          links: {
            uiConfig: {
              links: [
                {
                  text: "BULK_UPLOAD_USERS",
                  url: "/employee/microplan/upload-user",
                  roles: ["MICROPLAN_ADMIN"],
                },
                {
                  text: "DOWNLOAD_USER_DATA",
                  url: "/employee/microplan/user-download",
                  roles: ["MICROPLAN_ADMIN"],
                },
              ],
              label: headerLabel,
              logoIcon: {
                component: "Population",
                customClass: "inbox-links-icon",
              },
            },
            children: {},
            show: true,
          },
          filter: {
            uiConfig: {
              // headerLabel: "ROLES",
              secondaryLabel: "ES_COMMON_CLEAR_FILTER",
              formClassName: "filter",
              type: "filter",
              typeMobile: "sort",
              headerStyle: null,
              primaryLabel: "ES_COMMON_FILTER",
              minReqFields: 0,
              defaultValues: {
                inboxFilter: "",
              },
              fields: [
                {
                  type: "component",
                  component: "InboxFilter",
                  key: "inboxFilter",
                  customProps: {
                    name: "inboxFilter",
                  },
                },
              ],
            },
            show: true,
          },
        },
        customHookName: "DSS.useCampaignsInboxSearch",
        additionalSections: {},
        persistFormData: true,
      },
      // for past campaigns
      {
        headerLabel: headerLabel,
        type: "inbox",
        apiDetails: {
          serviceName: `/health-project/staff/v1/_search`,
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
              primaryLabel: "Search",
              secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
              minReqFields: 0,
              defaultValues: {
                dateRange: "",
              },
              fields: [
                {
                  label: "Date Range",
                  key: "dateRange",
                  type: "dateRange",
                  isMandatory: false,
                  populators: {
                    name: "dateRange",
                  },
                },
              ],
            },
            label: "",
            children: {},
            show: true,
          },
          searchResult: {
            uiConfig: {
              columns: [
                {
                  label: "CAMPAIGN_NAME",
                  jsonPath: "name",
                  additionalCustomization: true,
                },
                {
                  label: "YEAR",
                  jsonPath: "",
                  additionalCustomization: true,
                },
                {
                  label: "BOUNDARY_NAME",
                  jsonPath: "address.boundary",
                  additionalCustomization: true,
                },
                {
                  label: "START_DATE",
                  jsonPath: "startDate",
                  additionalCustomization: true,
                },
                {
                  label: "END_DATE",
                  jsonPath: "endDate",
                  additionalCustomization: true,
                },
                {
                  label: "ACTIONS",
                  jsonPath: "",
                  additionalCustomization: true,
                },
              ],
              enableGlobalSearch: false,
              enableColumnSort: true,
              resultsJsonPath: "Project",
            },
            children: {},
            show: true,
          },
          links: {
            uiConfig: {
              links: [
                {
                  text: "",
                  url: "",
                  roles: [],
                },
              ],
              label: headerLabel,
              logoIcon: {
                component: "Population",
                customClass: "inbox-links-icon",
              },
            },
            children: {},
            show: true,
          },
          filter: {
            uiConfig: {
              // headerLabel: "ROLES",
              secondaryLabel: "ES_COMMON_CLEAR_FILTER",
              formClassName: "filter",
              type: "filter",
              typeMobile: "sort",
              headerStyle: null,
              primaryLabel: "ES_COMMON_FILTER",
              minReqFields: 0,
              defaultValues: {
                inboxFilter: "",
              },
              fields: [
                {
                  type: "component",
                  component: "InboxFilter",
                  key: "inboxFilter",
                  customProps: {
                    name: "inboxFilter",
                  },
                },
              ],
            },
            show: true,
          },
        },
        customHookName: "DSS.useCampaignsInboxSearch",
        additionalSections: {},
        persistFormData: true,
      },
    ],
  };
};
