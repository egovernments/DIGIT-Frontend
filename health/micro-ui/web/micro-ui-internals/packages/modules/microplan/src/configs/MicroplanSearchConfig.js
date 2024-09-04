

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
          serviceName: "/plan-service/config/_search", //! Note
          requestParam: {},
          requestBody: {},
         masterName: "commonUiConfig",
          moduleName: "MicroplanSearchConfig",
          minParametersForSearchForm: 0,
          tableFormJsonPath: "requestBody.PlanConfigurationSearchCriteria.pagination",
          // filterFormJsonPath: "requestBody.MdmsCriteria.customs",
          searchFormJsonPath: "requestBody.PlanConfigurationSearchCriteria",
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
                  label: "Name of the Microplan",
                  jsonPath: "name",
                  additionalCustomization:true
                },
  
                {
                  label: "Microplan Status",
                  jsonPath: "status",
                },
                {
                  label: "Campaign Disease",
                  jsonPath:  "CampaignDetails.campaignName",
                },
                {
                  label:"Camapaign Type",
                  jsonPath:"CampaignDetails.startDate"
                },
                // {
                //   label:"Distribution Strategy",
                //   jsonPath:" proposalDate"
                // },
                {
                  label:"Actions",
                  jsonPath:"",
                  additionalCustomization:true
                }
              ],
              resultsJsonPath: "PlanConfiguration",
  
              enableColumnSort: true,
              // resultsJsonPath: "mdms",
            },
            show: true,
          },
         // customHookName: "microplanv1.useSavedMicroplans",  //! Note
          
        },
        customHookName:"microplanv1.useSavedMicroplans"
      },
      {label: "My microplans1",},
      {label: "My microplans2",}
    ],
  };
  

