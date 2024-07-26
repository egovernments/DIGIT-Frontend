
const defaultSearchValues = {
    Field: { label: "Name", opt: "name" }, // Default selection for the dropdown
    Value: "", // Default value for the input field
  };
export const searchconfig = () => 
{
  return {
    label: "Contract Search",
    type: "search",
    apiDetails: {
    //   serviceName: "/individual/v1/_search",
      serviceName: "/mdms-v2/v2/_search",
      requestParam: {
          "tenantId":Digit.ULBService.getCurrentTenantId(),
          "filters":{}
      },
      requestBody: {
        apiOperation: "SEARCH",
        MdmsCriteria: {
          "tenantId": Digit.ULBService.getCurrentTenantId(),
          "limit": 10,
          "offset": 0,
        //   "filters":{name},
          schemaCode:"digitAssignment.contract"
        },
      },
      masterName: "commonUiConfig",
      //masterName: "commonMuktaUiConfig",
      //moduleName: "SearchIndividualConfig",
      moduleName: "SearchContractConfig",
      minParametersForSearchForm: 0,
      tableFormJsonPath: "requestParam",
      filterFormJsonPath: "requestBody.MdmsCriteria.filters",
      searchFormJsonPath: "requestBody.MdmsCriteria.filters",
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
                label: "Field",
                isMandatory: "false",
                key: "Field",
                type: "dropdown",
                populators:{
                    name: "Field",
                    optionsKey: "opt",
                    options: [
                        {
                            label: "name",
                            opt: "name"
                        },
                        {
                            label: "estimateId",
                            opt: "estimateId"
                        },
                        {
                            label: "contract type",
                            opt: "contractType"
                        }
                    ]
                }
            },
            {
                label: "Value",
                isMandatory: false,
                key: "Value",
                type: "text",
                populators: { 
                  name: "Value", 
                  error: "Required", 
                  // validation: { pattern: /^[A-Za-z]+$/i } 
                },
              },

          ],
        },

        show: true
      },
      searchResult: {
        tenantId: Digit.ULBService.getCurrentTenantId(),
        uiConfig: {
          columns: [
            {
              label: "name",
              jsonPath: "data.name",
            },
            {
                label: "contract type",
                jsonPath: "data.contractType",
            },
            {
                label: "additional details",
                jsonPath: "data.additionalDetails.totalEstimateAmount",
            },
            {
                label: "estimateId",
                jsonpath: "data.lineItems.estimateId" 
                // {console.log("recevied data", data);}
            }

            
            // {
            //   label: "estimateId",
            //   jsonPath: "estimateId",
              
            // },
            // {
            //     label: "Id",
            //     jsonPath: "id",
                
            //   },
            // {
            //   label: "Individual Id",
            //   jsonPath: "individualId",
            // },
          ],

          enableColumnSort: true,
          resultsJsonPath: "mdms"
        },
        show: true,
      },
    },
  };
};
