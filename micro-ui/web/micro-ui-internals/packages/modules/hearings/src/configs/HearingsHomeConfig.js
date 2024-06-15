// default values of search input component
const defaultSearchValues = {
  individualName: "",
  mobileNumber: "",
  IndividualID: "",
};

//config for tab search sceeen
export const TabSearchconfig = {
  tenantId: "mz",
  moduleName: "commonCampaignUiConfig",
  showTab: true, // setting true will enable tab screen
  TabSearchconfig: [ // all tab config should be added in json array
    {
      label: "All",
      type: "search",
      apiDetails: {
        serviceName: "/individual/v1/_search",
        requestParam: {
          tenantId: Digit.ULBService.getCurrentTenantId(),
        },
        requestBody: {
          apiOperation: "SEARCH",
          Individual: {
            tenantId: Digit.ULBService.getCurrentTenantId(),
          },
        },
        masterName: "commonUiConfig",
        moduleName: "SearchIndividualConfig",
        minParametersForSearchForm: 0,
        tableFormJsonPath: "requestParam",
        filterFormJsonPath: "requestBody.Individual",
        searchFormJsonPath: "requestBody.Individual",
      },
      sections: {
        search: {
          uiConfig: {
            formClassName: "custom-both-clear-search",
            primaryLabel: "ES_COMMON_SEARCH",
            secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
            minReqFields: 0,
            defaultValues: defaultSearchValues, // Set default values for search fields
            fields: [
              {
                label: "Panding Task",
                isMandatory: false,
                key: "pandingTask",
                type: "dropdown",
                populators: {
                  name: "individualName",
                  error: "Required",
                  validation: { pattern: /^[A-Za-z]+$/i },
                },
              },
              {
                label: "Case Type",
                isMandatory: false,
                key: "caseType",
                type: "dropdown",
                disable: false,
                populators: { name: "mobileNumber", error: "sample error message", validation: { min: 0, max: 999999999 } },
              },
              {
                label: "Stage",
                isMandatory: false,
                type: "dropdown",
                key: "stage",
                disable: false,
                populators: {
                  name: "individualId",
                },
              },
              {
                label: "Case ID",
                isMandatory: false,
                type: "text",
                key: "caseId",
                disable: false,
                placeholder: "Search Case ID or Case Name",
                populators: {
                  name: "individualId",
                },
              },
            ],
          },

          show: true,
        },
        searchResult: {
          tenantId: Digit.ULBService.getCurrentTenantId(),
          uiConfig: {
            columns: [
              {
                label: "IndividualID",
                jsonPath: "individualId",
              },

              {
                label: "Name",
                jsonPath: "name.givenName",
              },
              {
                label: "Address",
                jsonPath: "address.locality.code",
              },

            ],

            enableColumnSort: true,
            resultsJsonPath: "Individual",
          },
          show: true,
        },
      },
    },
    {
      label: "Ongoing",
      type: "search",
      apiDetails: {
        serviceName: "/individual/v1/_search",
        requestParam: {
          tenantId: Digit.ULBService.getCurrentTenantId(),
        },
        requestBody: {
          apiOperation: "SEARCH",
          Individual: {
            tenantId: Digit.ULBService.getCurrentTenantId(),
          },
        },
        masterName: "commonUiConfig",
        moduleName: "SearchIndividualConfig",
        minParametersForSearchForm: 0,
        tableFormJsonPath: "requestParam",
        filterFormJsonPath: "requestBody.Individual",
        searchFormJsonPath: "requestBody.Individual",
      },
      sections: {
        search: {
          uiConfig: {
            formClassName: "custom-both-clear-search",
            primaryLabel: "ES_COMMON_SEARCH",
            secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
            minReqFields: 0,
            defaultValues: defaultSearchValues, // Set default values for search fields
            fields: [
              {
                label: "Panding Task",
                isMandatory: false,
                key: "pandingTask",
                type: "dropdown",
                populators: {
                  name: "individualName",
                  error: "Required",
                  validation: { pattern: /^[A-Za-z]+$/i },
                },
              },
              {
                label: "Case Type",
                isMandatory: false,
                key: "caseType",
                type: "dropdown",
                disable: false,
                populators: { name: "mobileNumber", error: "sample error message", validation: { min: 0, max: 999999999 } },
              },
              {
                label: "Stage",
                isMandatory: false,
                type: "dropdown",
                key: "stage",
                disable: false,
                populators: {
                  name: "individualId",
                },
              },
              {
                label: "Case ID",
                isMandatory: false,
                type: "text",
                key: "caseId",
                disable: false,
                placeholder: "Search Case ID or Case Name",
                populators: {
                  name: "individualId",
                },
              },
            ],
          },

          show: true,
        },
        searchResult: {
          tenantId: Digit.ULBService.getCurrentTenantId(),
          uiConfig: {
            columns: [
              {
                label: "IndividualID",
                jsonPath: "individualId",
              },

              {
                label: "Name",
                jsonPath: "name.givenName",
              },
              {
                label: "Address",
                jsonPath: "address.locality.code",
              },

            ],

            enableColumnSort: true,
            resultsJsonPath: "Individual",
          },
          show: true,
        },
      },
    },
    {
      label: "Registered",
      type: "search",
      apiDetails: {
        serviceName: "/individual/v1/_search",
        requestParam: {
          tenantId: Digit.ULBService.getCurrentTenantId(),
        },
        requestBody: {
          apiOperation: "SEARCH",
          Individual: {
            tenantId: Digit.ULBService.getCurrentTenantId(),
          },
        },
        masterName: "commonUiConfig",
        moduleName: "SearchIndividualConfig",
        minParametersForSearchForm: 0,
        tableFormJsonPath: "requestParam",
        filterFormJsonPath: "requestBody.Individual",
        searchFormJsonPath: "requestBody.Individual",
      },
      sections: {
        search: {
          uiConfig: {
            formClassName: "custom-both-clear-search",
            primaryLabel: "ES_COMMON_SEARCH",
            secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
            minReqFields: 0,
            defaultValues: defaultSearchValues, // Set default values for search fields
            fields: [
              {
                label: "Panding Task",
                isMandatory: false,
                key: "pandingTask",
                type: "dropdown",
                populators: {
                  name: "individualName",
                  error: "Required",
                  validation: { pattern: /^[A-Za-z]+$/i },
                },
              },
              {
                label: "Case Type",
                isMandatory: false,
                key: "caseType",
                type: "dropdown",
                disable: false,
                populators: { name: "mobileNumber", error: "sample error message", validation: { min: 0, max: 999999999 } },
              },
              {
                label: "Stage",
                isMandatory: false,
                type: "dropdown",
                key: "stage",
                disable: false,
                populators: {
                  name: "individualId",
                },
              },
              {
                label: "Case ID",
                isMandatory: false,
                type: "text",
                placeholder: "placeholder",
                key: "caseId",
                disable: false,
                placeholder: "Search Case ID or Case Name",
                populators: {
                  name: "individualId",
                },
              },
            ],
          },

          show: true,
        },
        searchResult: {
          tenantId: Digit.ULBService.getCurrentTenantId(),
          uiConfig: {
            columns: [
              {
                label: "IndividualID",
                jsonPath: "individualId",
              },

              {
                label: "Name",
                jsonPath: "name.givenName",
              },
              {
                label: "Address",
                jsonPath: "address.locality.code",
              },
            ],

            enableColumnSort: true,
            resultsJsonPath: "Individual",
          },
          show: true,
        },
      },
    },
    {
      label: "Closed",
      type: "search",
      apiDetails: {
        serviceName: "/individual/v1/_search",
        requestParam: {
          tenantId: Digit.ULBService.getCurrentTenantId(),
        },
        requestBody: {
          apiOperation: "SEARCH",
          Individual: {
            tenantId: Digit.ULBService.getCurrentTenantId(),
          },
        },
        masterName: "commonUiConfig",
        moduleName: "SearchIndividualConfig",
        minParametersForSearchForm: 0,
        tableFormJsonPath: "requestParam",
        filterFormJsonPath: "requestBody.Individual",
        searchFormJsonPath: "requestBody.Individual",
      },
      sections: {
        search: {
          uiConfig: {
            formClassName: "custom-both-clear-search",
            primaryLabel: "ES_COMMON_SEARCH",
            secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
            minReqFields: 0,
            defaultValues: defaultSearchValues, // Set default values for search fields
            fields: [
              {
                label: "Panding Task",
                isMandatory: false,
                key: "pandingTask",
                type: "dropdown",
                populators: {
                  name: "individualName",
                  error: "Required",
                  validation: { pattern: /^[A-Za-z]+$/i },
                },
              },
              {
                label: "Case Type",
                isMandatory: false,
                key: "caseType",
                type: "dropdown",
                disable: false,
                populators: { name: "mobileNumber", error: "sample error message", validation: { min: 0, max: 999999999 } },
              },
              {
                label: "Stage",
                isMandatory: false,
                type: "dropdown",
                key: "stage",
                disable: false,
                populators: {
                  name: "individualId",
                },
              },
              {
                label: "Case ID",
                isMandatory: false,
                type: "text",
                key: "caseId",
                disable: false,
                placeholder: "Search Case ID or Case Name",
                populators: {
                  name: "individualId",
                },
              },
            ],
          },

          show: true,
        },
        searchResult: {
          tenantId: Digit.ULBService.getCurrentTenantId(),
          uiConfig: {
            columns: [
              {
                label: "IndividualID",
                jsonPath: "individualId",
              },

              {
                label: "Name",
                jsonPath: "name.givenName",
              },
              {
                label: "Address",
                jsonPath: "address.locality.code",
              },
            ],

            enableColumnSort: true,
            resultsJsonPath: "Individual",
          },
          show: true,
        },
      },
    },
  ],

};
