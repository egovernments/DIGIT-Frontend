// default values of search input component
const defaultSearchValues = {
  individualName: "",
  mobileNumber: "",
  IndividualID: "",
};
  //[TODO: MDMS data need to be integrated for Search Fields]

//config for tab search sceeen
export const TabSearchconfig = {
  tenantId: "pg",
  moduleName: "homeHearingUIConfig",
  showTab: true, // setting true will enable tab screen
  TabSearchconfig: [ // all tab config should be added in json array
    {
      label: "Your Cases",
      type: "search",
      apiDetails: {
        serviceName: "/pgr-services/mock/inbox/cases",
        requestParam: {
          tenantId: Digit.ULBService.getCurrentTenantId(),
        },
        requestBody: {
          apiOperation: "SEARCH",
        },
        masterName: "commonUiConfig",
        moduleName: "homeHearingUIConfig",
        minParametersForSearchForm: 0,
        tableFormJsonPath: "requestParam",
        filterFormJsonPath: "requestBody",
        searchFormJsonPath: "requestBody",
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
                label: "Pending Task",
                isMandatory: false,
                key: "pendingTask",
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
              {
                label: "Case Name",
                isMandatory: false,
                type: "text",
                placeholder: "placeholder",
                key: "caseName",
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
                label: "Case Name",
                jsonPath: "caseTitle",
              },
              {
                label: "Stage",
                jsonPath: "caseStage",
              },

              {
                label: "Case ID",
                jsonPath: "cnrNumber",
              },
              {
                label: "Case Type",
                jsonPath: "statutes[0]",
              },
              {
                label: "Info",
                jsonPath: "numTasksDue",
              },
            ],

            enableColumnSort: true,
            resultsJsonPath: "cases",
          },
          show: true,
        },
      },
    },
    {
      label: "Ongoing",
      type: "search",
      apiDetails: {
        serviceName: "/pgr-services/mock/inbox/cases",
        requestParam: {
          tenantId: Digit.ULBService.getCurrentTenantId(),
        },
        requestBody: {
          apiOperation: "SEARCH",
        },
        masterName: "commonUiConfig",
        moduleName: "homeHearingUIConfig",
        minParametersForSearchForm: 0,
        tableFormJsonPath: "requestParam",
        filterFormJsonPath: "requestBody",
        searchFormJsonPath: "requestBody",
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
                label: "Pending Task",
                isMandatory: false,
                key: "pendingTask",
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
              {
                label: "Case Name",
                isMandatory: false,
                type: "text",
                placeholder: "placeholder",
                key: "caseName",
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
                label: "Case Name",
                jsonPath: "caseTitle",
              },
              {
                label: "Stage",
                jsonPath: "caseStage",
              },

              {
                label: "Case ID",
                jsonPath: "cnrNumber",
              },
              {
                label: "Case Type",
                jsonPath: "statutes[0]",
              },
              {
                label: "Info",
                jsonPath: "numTasksDue",
              },
            ],

            enableColumnSort: true,
            resultsJsonPath: "cases",
          },
          show: true,
        },
      },
    },
    {
      label: "Registered",
      type: "search",
      apiDetails: {
        serviceName: "/pgr-services/mock/inbox/cases",
        requestParam: {
          tenantId: Digit.ULBService.getCurrentTenantId(),
        },
        requestBody: {
          apiOperation: "SEARCH",
        },
        masterName: "commonUiConfig",
        moduleName: "homeHearingUIConfig",
        minParametersForSearchForm: 0,
        tableFormJsonPath: "requestParam",
        filterFormJsonPath: "requestBody",
        searchFormJsonPath: "requestBody",
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
                label: "Pending Task",
                isMandatory: false,
                key: "pendingTask",
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
              {
                label: "Case Name",
                isMandatory: false,
                type: "text",
                placeholder: "placeholder",
                key: "caseName",
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
                label: "Case Name",
                jsonPath: "caseTitle",
              },
              {
                label: "Stage",
                jsonPath: "caseStage",
              },

              {
                label: "Case ID",
                jsonPath: "cnrNumber",
              },
              {
                label: "Case Type",
                jsonPath: "statutes[0]",
              },
              {
                label: "Info",
                jsonPath: "numTasksDue",
              },
            ],

            enableColumnSort: true,
            resultsJsonPath: "cases",
          },
          show: true,
        },
      },
    },
    {
      label: "Closed",
      type: "search",
      apiDetails: {
        serviceName: "/pgr-services/mock/inbox/cases",
        requestParam: {
          tenantId: Digit.ULBService.getCurrentTenantId(),
        },
        requestBody: {
          apiOperation: "SEARCH",
        },
        masterName: "commonUiConfig",
        moduleName: "homeHearingUIConfig",
        minParametersForSearchForm: 0,
        tableFormJsonPath: "requestParam",
        filterFormJsonPath: "requestBody",
        searchFormJsonPath: "requestBody",
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
                label: "Pending Task",
                isMandatory: false,
                key: "pendingTask",
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
              {
                label: "Case Name",
                isMandatory: false,
                type: "text",
                placeholder: "placeholder",
                key: "caseName",
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
                label: "Case Name",
                jsonPath: "caseTitle",
              },
              {
                label: "Stage",
                jsonPath: "caseStage",
              },

              {
                label: "Case ID",
                jsonPath: "cnrNumber",
              },
              {
                label: "Case Type",
                jsonPath: "statutes[0]",
              },
              {
                label: "Info",
                jsonPath: "numTasksDue",
              },
            ],

            enableColumnSort: true,
            resultsJsonPath: "cases",
          },
          show: true,
        },
      },
    },
  ],

};

