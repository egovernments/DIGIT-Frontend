
// THIS CONFIG FOR SUPERVISOR TAGGED USER 
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
          label: "ALL",
          type: "search",
          apiDetails: {
            serviceName: "/plan-service/config/_search", // Note
            requestParam: {},
            requestBody: {},
           masterName: "commonUiConfig",
            moduleName: "MyMicroplanSearchConfig",  //uses same as microplan search
            minParametersForSearchForm: 0,
            minParametersForFilterForm: 0,
            tableFormJsonPath: "requestBody.PlanConfigurationSearchCriteria.pagination",
            filterFormJsonPath: "requestBody.PlanConfigurationSearchCriteria.customs",
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
                    label: "MP_NAME_OF_MICROPLAN_MY_MICROPLANS",
                    isMandatory: false,
                    key: "microplanName",
                    type: "text",
                    populators: {
                      name: "microplanName",
                      // error: "Required",
                      // validation: { pattern: /^[A-Za-z]+$/i },
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
                    label: "NAME_OF_MICROPLAN",
                    jsonPath: "name",
                    additionalCustomization:true
                  },
    
                  {
                    label: "MICROPLAN_STATUS",
                    jsonPath: "status",
                    additionalCustomization:true
                  },
                  {
                    label: "CAMPAIGN_DISEASE",
                    jsonPath:  "campaignDetails.additionalDetails.disease",
                    additionalCustomization:true
                  },
                  {
                    label:"CAMPAIGN_TYPE",
                    jsonPath:"campaignDetails.projectType",
                    additionalCustomization:true
                  },
                  {
                    label:"DISTIRBUTION_STRATEGY",
                    jsonPath:"campaignDetails.additionalDetails.resourceDistributionStrategy",
                    additionalCustomization:true
                  },
                  {
                    label:"ACTIONS",
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
          customHookName:"microplanv1.useSavedMicroplansWithCampaign"
        },
        {label: "EXECUTION_TO_BE_DONE",},
        {label:"EXECUTION_IN_PROGRESS"},
        {label:"MICROPLAN_EXECUTED"},       
      ],
    };
    
  
  