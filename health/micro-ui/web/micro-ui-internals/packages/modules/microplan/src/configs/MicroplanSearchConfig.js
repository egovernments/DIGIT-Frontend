

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
          moduleName: "MicroplanSearchConfig1",
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
                  key: "individualName",
                  type: "text",
                  populators: {
                    name: "individualName",
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
        label: "Individual Search Tab2",
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
                  label: "Applicant name ",
                  isMandatory: false,
                  key: "individualName",
                  type: "text",
                  populators: {
                    name: "individualName",
                    error: "Required",
                    validation: { pattern: /^[A-Za-z]+$/i },
                  },
                },
                {
                  label: "Phone number",
                  isMandatory: false,
                  key: "Phone number",
                  type: "number",
                  disable: false,
                  populators: { name: "mobileNumber", error: "sample error message", validation: { min: 0, max: 999999999 } },
                },
                {
                  label: "Individual Id ",
                  isMandatory: false,
                  type: "text",
                  disable: false,
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
        label: "Individual Search Tab3",
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
                  label: "Applicant name ",
                  isMandatory: false,
                  key: "individualName",
                  type: "text",
                  populators: {
                    name: "individualName",
                    error: "Required",
                    validation: { pattern: /^[A-Za-z]+$/i },
                  },
                },
                {
                  label: "Phone number",
                  isMandatory: false,
                  key: "Phone number",
                  type: "number",
                  disable: false,
                  populators: { name: "mobileNumber", error: "sample error message", validation: { min: 0, max: 999999999 } },
                },
                {
                  label: "Individual Id ",
                  isMandatory: false,
                  type: "text",
                  disable: false,
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
  