import Urls from "../../services/urls";

export const AssignCampaignInboxConfig = (tenantId) => {
  return {
    tenantId: tenantId || "mz",
    moduleName: "HRMS",
    AssignCampaignInboxConfig: [
      {
        type: "search",
        label: "SEARCH_PROJECT",
        sections: {
          search: {
            show: true,
            label: "",
            uiConfig: {
              fields: [
                {
                  key: "PROJECT_TYPE",
                  type: "dropdown",
                  label: "PROJECT_TYPE",
                  disable: false,
                  populators: {
                    name: "projectType",
                    optionsKey: "code",
                    error: "PROJECT_TYPE_ERR_MSG",
                    mdmsv2: true,
                    mdmsConfig: {
                      masterName: "projectTypes",
                      moduleName: "HCM-PROJECT-TYPES",
                      localePrefix: "CAMPAIGN_TYPE",
                    },
                  },
                  preProcess: {
                    convertStringToRegEx: ["populators.validation.pattern"],
                  },
                  isMandatory: false,
                },
                {
                  key: "PROJECT_NAME",
                  type: "text",
                  label: "PROJECT_NAME",
                  disable: false,
                  populators: {
                    name: "name",
                    error: "PROJECT_NAME_ERR_MSG",
                    validation: {
                      pattern: "^[^\\$<>?\\\\~!@$%^()+={}\\[\\]*:;“”‘’]{1,50}$",
                    },
                  },
                  preProcess: {
                    convertStringToRegEx: ["populators.validation.pattern"],
                  },
                  isMandatory: false,
                },
                {
                  key: "PROJECT_NUMBER",
                  type: "text",
                  label: "PROJECT_NUMBER",
                  disable: false,
                  populators: {
                    name: "projectNumber",
                    error: "PROJECT_NUMBER_ERR_MSG",
                    validation: {
                      pattern: "^[^\\$<>?\\\\~!@$%^()+={}\\[\\]*:;“”‘’]{1,50}$",
                    },
                  },
                  preProcess: {
                    convertStringToRegEx: ["populators.validation.pattern"],
                  },
                  isMandatory: false,
                },
                {
                  label: "HR_JURISDICTION_BOUNDARY",
                  isMandatory: false,
                  key: "boundary",
                  type: "dropdown",
                  disable: false,
                  preProcess: {
                    updateDependent: ["populators.options"],
                  },
                  populators: {
                    name: "boundary",
                    optionsKey: "i18nKey",
                    defaultText: "",
                    selectedText: "COMMON_SELECTED",
                    allowMultiSelect: false,
                    options: [],
                    isDropdownWithChip: false,
                  },
                },
                {
                  key: "START_DATE",
                  type: "date",
                  label: "START_DATE",
                  disable: false,
                  populators: {
                    name: "startDate",
                    error: "PROJECT_START_DATE_ERR_MSG",
                    validation: {},
                  },
                  isMandatory: false,
                },
                {
                  key: "END_DATE",
                  type: "date",
                  label: "END_DATE",
                  disable: false,
                  populators: {
                    name: "endDate",
                    error: "PROJECT_END_DATE_ERR_MSG",
                    validation: {},
                  },
                  isMandatory: false,
                },
              ],
              headerStyle: null,
              minReqFields: 0,
              primaryLabel: "ES_COMMON_SEARCH",
              defaultValues: {
                id: "",
                name: "",
                endDate: "",
                boundary: "",
                startDate: "",
                projectType: "",
                projectNumber: "",
              },
              formClassName: "custom-both-clear-search",
              secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
            },
          },
          searchResult: {
            show: true,
            label: "",
            children: {},
            uiConfig: {
              columns: [
                {
                  label: "PROJECT_NUMBER",
                  jsonPath: "projectNumber",
                },
                {
                  label: "PROJECT_NAME",
                  jsonPath: "name",
                },
                {
                  label: "PROJECT_TYPE",
                  jsonPath: "projectType",
                  additionalCustomization: true,
                },
                {
                  label: "PROJECT_BOUNDARY_TYPE",
                  jsonPath: "address.boundaryType",
                  additionalCustomization: true,
                },
                {
                  label: "PROJECT_BOUNDARY",
                  jsonPath: "address.boundary",
                  additionalCustomization: true,
                },
                {
                  label: "ASSIGNMENT",
                  //   jsonPath: "",
                  additionalCustomization: true,
                },
              ],
              resultsJsonPath: "Project",
              enableColumnSort: true,
              enableGlobalSearch: false,
            },
          },
        },
        apiDetails: {
          masterName: "commonUiConfig",
          moduleName: "AssignCampaignInboxConfig",
          requestBody: {
            limit: 10,
            offset: 0,
            Projects: [
              {
                tenantId: tenantId || "mz",
              },
            ],
            tenantId: tenantId || "mz",
            apiOperation: "SEARCH",
          },
          serviceName: Urls.hcm.searchProject,
          requestParam: {
            limit: 10,
            offset: 0,
            tenantId: tenantId || "mz",
          },
          tableFormJsonPath: "requestParam",
          filterFormJsonPath: "requestBody.Projects",
          searchFormJsonPath: "requestBody.Projects",
          minParametersForSearchForm: 0,
        },
      },
    ],
  };
};
