

// default values of search input component
const defaultSearchValues = {
  microplanName: "",

};

  
  //config for tab search sceeen
  export const TabSearchconfig = {
    // moduleName: "commonCampaignUiConfig",
    showTab: true, // setting true will enable tab screen
    TabSearchconfig: [ // all tab config should be added in json array
      {
        label: "My microplans",
        type: "search",
        apiDetails: {
          serviceName: "/mdms-v2/v2/_search",
          requestParam: {
              "tenantId":Digit.ULBService.getCurrentTenantId()
          },
          requestBody: {
            apiOperation: "SEARCH",
            MdmsCriteria: {
              
            },
          },
         masterName: "commonUiConfig",
          moduleName: "MicroplanSearchConfig",
          minParametersForSearchForm: 0,
          tableFormJsonPath: "requestParam",
          filterFormJsonPath: "requestBody.MdmsCriteria.customs",
          searchFormJsonPath: "requestBody.MdmsCriteria.customs",
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
                  label: "Name of the microplan",
                  isMandatory: false,
                  key: "microplanName",
                  type: "text",
                  populators: {
                    name: "microplanName",
                    error: "Required",
                    validation: { pattern: /^[A-Za-z]+$/i },
                  },
                },
                // {
                //   label: "Phone number",
                //   isMandatory: false,
                //   key: "Phone number",
                //   type: "number",
                //   disable: false,
                //   populators: { name: "mobileNumber", error: "sample error message", validation: { min: 0, max: 999999999 } },
                // },
                // {
                //   label: "Individual Id ",
                //   isMandatory: false,
                //   type: "text",
                //   disable: false,
                //   populators: {
                //     name: "individualId",
                //   },
                // },
              ],
            },
  
            show: true,
          },
          searchResult: {
            tenantId: Digit.ULBService.getCurrentTenantId(),
            uiConfig: {
              columns: [
                {
                  label: "Name of the Microplan ",
                  jsonPath: "data.name",
                },
  
                {
                  label: "Microplan Status",
                  jsonPath: "data.description",
                },
                {
                  label: "Campaign Disease",
                  jsonPath: "data.executingDepartment",
                },
                {
                  label:"Camapaign Type",
                  jsonPath:"data.wfStatus"
                },
                {
                  label:"Distribution Strategy",
                  jsonPath:" proposalDate"
                },
                {
                  label:"Actions",
                  jsonPath:"data.status",
                  additionalCustomization:true
                }
              ],
  
              enableColumnSort: true,
              resultsJsonPath: "mdms",
            },
            show: true,
          },
        },
      },
      {
        label: "My microplans 1",
        type: "search",
        apiDetails: {
          serviceName: "/mdms-v2/v2/_search",
          requestParam: {
              "tenantId":Digit.ULBService.getCurrentTenantId()
          },
          requestBody: {
            apiOperation: "SEARCH",
            MdmsCriteria: {
              
            },
          },
         masterName: "commonUiConfig",
          moduleName: "MicroplanSearchConfig",
          minParametersForSearchForm: 0,
          tableFormJsonPath: "requestParam",
          filterFormJsonPath: "requestBody.MdmsCriteria.customs",
          searchFormJsonPath: "requestBody.MdmsCriteria.customs",
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
                  label: "Name of the microplan",
                  isMandatory: false,
                  key: "microplanName",
                  type: "text",
                  populators: {
                    name: "microplanName",
                    error: "Required",
                    validation: { pattern: /^[A-Za-z]+$/i },
                  },
                },
                // {
                //   label: "Phone number",
                //   isMandatory: false,
                //   key: "Phone number",
                //   type: "number",
                //   disable: false,
                //   populators: { name: "mobileNumber", error: "sample error message", validation: { min: 0, max: 999999999 } },
                // },
                // {
                //   label: "Individual Id ",
                //   isMandatory: false,
                //   type: "text",
                //   disable: false,
                //   populators: {
                //     name: "individualId",
                //   },
                // },
              ],
            },
  
            show: true,
          },
          searchResult: {
            tenantId: Digit.ULBService.getCurrentTenantId(),
            uiConfig: {
              columns: [
                {
                  label: "Name of the Microplan ",
                  jsonPath: "data.name",
                },
  
                {
                  label: "Microplan Status",
                  jsonPath: "data.description",
                },
                {
                  label: "Campaign Disease",
                  jsonPath: "data.executingDepartment",
                },
                {
                  label:"Camapaign Type",
                  jsonPath:"data.wfStatus"
                },
                {
                  label:"Distribution Strategy",
                  jsonPath:" proposalDate"
                },
                {
                  label:"Actions",
                  jsonPath:"data.status",
                  additionalCustomization:true
                }
              ],
  
              enableColumnSort: true,
              resultsJsonPath: "mdms",
            },
            show: true,
          },
        },
      },
      {
        label: "My microplans 2",
        type: "search",
        apiDetails: {
          serviceName: "/mdms-v2/v2/_search",
          requestParam: {
              "tenantId":Digit.ULBService.getCurrentTenantId()
          },
          requestBody: {
            apiOperation: "SEARCH",
            MdmsCriteria: {
              
            },
          },
         masterName: "commonUiConfig",
          moduleName: "MicroplanSearchConfig",
          minParametersForSearchForm: 0,
          tableFormJsonPath: "requestParam",
          filterFormJsonPath: "requestBody.MdmsCriteria.customs",
          searchFormJsonPath: "requestBody.MdmsCriteria.customs",
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
                  label: "Name of the microplan",
                  isMandatory: false,
                  key: "microplanName",   //!doubt
                  type: "text",
                  populators: {
                    name: "microplanName",
                    error: "Required",
                    validation: { pattern: /^[A-Za-z]+$/i },
                  },
                },
                // {
                //   label: "Phone number",
                //   isMandatory: false,
                //   key: "Phone number",
                //   type: "number",
                //   disable: false,
                //   populators: { name: "mobileNumber", error: "sample error message", validation: { min: 0, max: 999999999 } },
                // },
                // {
                //   label: "Individual Id ",
                //   isMandatory: false,
                //   type: "text",
                //   disable: false,
                //   populators: {
                //     name: "individualId",
                //   },
                // },
              ],
            },
  
            show: true,
          },
          searchResult: {
            uiConfig: {
              columns: [
                {
                  label: "Name of the Microplan ",
                  jsonPath: "data.name",
                },
  
                {
                  label: "Microplan Status",
                  jsonPath: "data.description",
                },
                {
                  label: "Campaign Disease",
                  jsonPath: "data.executingDepartment",
                },
                {
                  label:"Camapaign Type",
                  jsonPath:"data.wfStatus"
                },
                {
                  label:"Distribution Strategy",
                  jsonPath:" proposalDate"
                },
                {
                  label:"Actions",
                  jsonPath:"data.status",
                  additionalCustomization:true
                }
              ],
  
              enableColumnSort: true,
              resultsJsonPath: "mdms",
            },
            show: true,
          },
        },
      },
    ],
  };
  