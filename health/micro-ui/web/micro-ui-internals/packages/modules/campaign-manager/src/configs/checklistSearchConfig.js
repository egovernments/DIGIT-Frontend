export const checklistSearchConfig = [
    {
      label: "Checklist Search",
      type: "search",
      apiDetails: {
        serviceName: "/service-request/service/definition/v1/_search",
        requestParam: {
            "tenantId":"mz",
        },
        requestBody: {
          ServiceDefinitionCriteria:{
            "tenantId": "mz",
             "code":[]
          },
        },
          Pagination:{
            "offset": 0,
            "limit": 100
          },
        masterName: "commonUiConfig",
        moduleName: "MyChecklistSearchConfig",
        minParametersForSearchForm: 2,
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
            fields: [
              {
                  label: "Role",
                  isMandatory: "false",
                  key: "Role",
                  type: "dropdown",
                  populators: {
                    name: "Role",
                    optionsKey: "code",
                    // options:[]
                  }
              },
              {
                label: "Checklist Type",
                isMandatory: "false",
                key: "Type",
                type: "dropdown",
                populators: {
                  name: "Type",
                  optionsKey: "list",
                  // options:[]
                }
              },
            ],
          },
  
          show: true
        },
        searchResult: {
          // tenantId: Digit.ULBService.getCurrentTenantId(),
          uiConfig: {
            columns: [
              {
                label: "Checklist Name",
                jsonpath: "additionalDetails.name",
                additionalCustomization: true
              },
              {
                label: "Checklist Role",
                jsonpath: "additionalDetails.role",
                additionalCustomization: true
              },
              {
                label: "Checklist Type",
                jsonPath: "additionalDetails.type",
                additionalCustomization: true
              },
              {
                label: "Status",
                jsonPath:"isActive",
                additionalCustomization: true
              }
            ],
  
            enableColumnSort: true,
            resultsJsonPath: "ServiceDefinitions"
          },
          show: true,
        },
      },
    },
  ];
  