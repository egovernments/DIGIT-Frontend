  
  const tenantId = Digit.ULBService.getCurrentTenantId();
  export const checklistSearchConfig = [
    {
      label: "Checklist Search",
      type: "search",
      apiDetails: {
        serviceName: "/mdms-v2/v2/_search",
        requestParam: {
            "tenantId":tenantId,
        },
        requestBody: {
          MdmsCriteria: {
            tenantId: tenantId,
            // schemaCode: "HCMadminconsole.checklisttemplates"
            schemaCode: "HCM-ADMIN-CONSOLE.Checklist-Templates",
            filters : {}
          }
        },
          Pagination:{
            "offset": 0,
            "limit": 5
          },
        masterName: "commonUiConfig",
        moduleName: "MyChecklistSearchConfig",
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
            fields: [
              {
                  label: "ROLE",
                  isMandatory: "false",
                  key: "Role",
                  type: "dropdown",
                  populators: {
                    name: "Role",
                    optionsKey: "code",
                    error: "ES_REQUIRED"
                                        
                    // options:[]
                  }

              },
              {
                label: "CHECKLIST_TYPE",
                isMandatory: "false",
                key: "Type",
                type: "dropdown",
                populators: {
                  name: "Type",
                  optionsKey: "list",
                  error: "ES_REQUIRED"
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
              // {
              //   label: "UNIQUE_IDENTIFIER",
              //   jsonpath: "uniqueIdentifier",
              //   additionalCustomization: true
              // },
              {
                label: "CHECKLIST_ROLE",
                jsonpath: "additionalDetails.role",
                additionalCustomization: true
              },  
              {
                label: "CHECKLIST_TYPE",
                jsonPath: "additionalDetails.type",
                additionalCustomization: true
              },
              {
                label: "STATUS",
                jsonPath:"isActive",
                additionalCustomization: true
              },
              {
                label: "ACTION",
                jsonpath: "",
                additionalCustomization: true
              }
            ],
  
            enableColumnSort: true,
            resultsJsonPath: "mdms"
          },
          show: true,
        },
      },
      additionalDetails: {
      }
    },
  ];

  