  const tenantId = Digit?.ULBService?.getCurrentTenantId() || "mz";
  const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";
  export const checklistSearchConfig = [
    {
      label: "Checklist Search",
      type: "search",
      apiDetails: {
        serviceName: `/${mdms_context_path}/v2/_search`,
        requestParam: {
            "tenantId":tenantId,
        },
        requestBody: {
          MdmsCriteria: {
            tenantId: tenantId,
            schemaCode: `HCM-ADMIN-CONSOLE.ChecklistTemplates`,
            isActive: true,
            filters : {},
            limit: 10,
            offset: 0,
          }
        },
          Pagination:{
            "offset": 0,
            "limit": 1
          },
        masterName: "commonUiConfig",
        moduleName: "MyChecklistSearchConfig",
        minParametersForSearchForm: 0,
        tableFormJsonPath: "requestBody.MdmsCriteria",
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
                  label: "CHECKLIST_ROLE",
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

              {
                label: "CHECKLIST_ROLE",
                prefix:"ACCESSCONTROL_ROLES_ROLES_",
                jsonPath: "data.role",
                translate:true
              },  
              {
                label: "CHECKLIST_TYPE",
                prefix:"HCM_CHECKLIST_TYPE_",
                jsonPath: "data.checklistType",
                translate:true
              },
              {
                label: "HCM_CHECKLIST_STATUS",
                jsonPath:"isActive",
                additionalCustomization: true
              },
              {
                label: "CHECKLIST_LAST_UPDATE",
                jsonpath: "auditDetails",
                additionalCustomization: true
              },
              {
                label: "HCM_CHECKLIST_ACTION",
                jsonpath: "",
                additionalCustomization: true
              }
            ],
            tableProps: {
              tableClassName:"results-data-table-for-checklist"
            },
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

  
