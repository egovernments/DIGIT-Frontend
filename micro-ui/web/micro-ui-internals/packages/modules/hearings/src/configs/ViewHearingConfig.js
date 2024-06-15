const defaultSearchValues = {
  individualName: "",
  mobileNumber: "",
  IndividualID: ""
};
export const searchconfig = () => 
{
return {
  label: "ADMISSION HEARING",
  type: "search",
  apiDetails: {
    serviceName: "/pgr-services/mock/inbox/cases",
    requestParam: {
        // "tenantId":Digit.ULBService.getCurrentTenantId()
        // "applicationNumber":applicationNumber
    },
    requestBody: {
      apiOperation: "SEARCH",
      "tenantId":Digit.ULBService.getCurrentTenantId(),
    //  "criteria": [
    //     {
    //         //  "filingNumber": "CASE-FILING-NO-2024-06-14-001625"
    //     }
    // ]
    },
   masterName: "commonUiConfig",
    moduleName: "ViewHearingsConfig",
    minParametersForSearchForm: 0,
    tableFormJsonPath: "requestParam",
    filterFormJsonPath: "requestBody.Criteria",
    searchFormJsonPath: "requestBody.Criteria",
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
            label: "Type",
            isMandatory: false,
            key: "type",
            type: "dropdown",
            populators: { 
              name: "type", 
              error: "Required", 
              validation: { pattern: /^[A-Za-z]+$/i } 
            },
          },
          {
            label: "Stage",
            isMandatory: false,
            key: "stage",
            type: "dropdown",
            populators: { 
              name: "stage", 
              error: "Required", 
              validation: { pattern: /^[A-Za-z]+$/i } 
            }
          },
          {
            label: "Search Case Id",
            isMandatory: false,
            key: "filingNumber",
            type: "text",
            populators: { 
              name: "filingNumber", 
              error: "Required", 
              validation: { pattern: /^[A-Za-z]+$/i } 
            },
          },
          // {
          //   label: "Phone number",
          //   isMandatory: false,
          //   key: "Phone number",
          //   type: "number",
          //   disable: false,
          //   populators: { name: "mobileNumber", error: "Hearings error message", validation: { min: 0, max: 999999999} },
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

      show: true
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
            label: "stage",
            jsonPath: "caseStage",
            
          },
          {
            label: "Case Type",
            jsonPath: "cntNumber",
          },
          {
            label: "Pending tasks",
            jsonPath: "numTasksDue",
            
          },
          {
            label: "Actions",
            jsonPath: "tenantId",
            additionalCustomization: true,
            
          },
        ],

        enableColumnSort: true,
        resultsJsonPath: "cases"
      },
      show: true,
    },
  },
};
};