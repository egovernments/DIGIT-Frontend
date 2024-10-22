  
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
            schemaCode: "HCM-ADMIN-CONSOLE.ChecklistTemplates_DEMO",
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
                prefix:"ACCESSCONTROL_ROLES_ROLES_",
                jsonPath: "data.role",
                translate:true
                // additionalCustomization: true
              },  
              {
                label: "CHECKLIST_TYPE",
                prefix:"HCM_CHECKLIST_TYPE_",

                jsonPath: "data.checklistType",
                translate:true
                // additionalCustomization: true
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
            resultsJsonPath: "mdmsData"
          },
          show: true,
        },
      },
      additionalDetails: {
      },
      customHookName:"campaign.useMDMSServiceSearch"
    },
  ];

  