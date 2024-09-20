const defaultSearchValues = {
    value: "",
    field: {}
  }
  export const datamgmtconfig = () => 
  {
    return {
      label: "Estimate Search",
      type: "search",
      apiDetails: {
        serviceName: "",  //making request
        requestParam: {},
        requestBody: {
          apiOperation: "SEARCH",  // InbSC
          MdmsCriteria: {
            "customs": {}
            // "schemaCode": ""
          },
        },
       masterName: "commonUiConfig",
        moduleName: "SorSearchConfig",
        minParametersForSearchForm: 0,
        tableFormJsonPath: "requestParam",
        filterFormJsonPath: "requestBody.MdmsCriteria.customs",
        searchFormJsonPath: "requestBody.MdmsCriteria.customs",
      },
      sections: {
        search: {
          uiConfig: {
            searchWrapperStyles: {
              flexDirection:"column-reverse",
              marginTop:"2rem",
              alignItems:"center",
              justifyContent:"end",
              gridColumn:"4"
            },
            headerStyle: null,
            formClassName: "custom-both-clear-search",
            primaryLabel: "ES_COMMON_SEARCH",
            secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
            minReqFields: 0,
            defaultValues: defaultSearchValues, // Set default values for search fields
            fields: [
              {
                label: "Type of Filter",
                key: "field",
                type: "dropdown",
                isMandatory: false,
                disable: false,
                populators: {
                  name: "field",
                  optionsKey: "label",
                  optionsCustomStyle: { top: "2.3rem" },
                  options: [
                    {
                      label: "Name",
                      name: "name",
                    },
                    {
                      label: "Description",
                      name: "description",
                    },
                    {
                      label: "Executing Department",
                      name: "executingDepartment",
                    },
                    {
                      label:"Workflow status",
                      jsonPath:"data.wfStatus"
                    }
  
                  ],
                },
              },
              {
                label: "Field Value",
                type: "text",
                key: "value",
                isMandatory: false,
                disable: false,
                populators: {
                  name: "value",
                  validation: { pattern: {}, maxlength: 140 },
                },
              },
              // {
              //   label: "Schema Code",
              //   isMandatory: false,
              //   key: "schemaCode",
              //   type: "text",
              //   disable: false,
              //   populators: { 
              //     name: "schemaCode",
              //   },
              // },
              // {
              //   label: "Id",
              //   isMandatory: false,
              //   key: "id",
              //   type: "text",
              //   disable: false,
              //   populators: { 
              //     name: "id",
              //   },
              // },
            ],
          },
          label: "",
          children: {},
          show: false
        },
        searchResult: {
          tenantId: Digit.ULBService.getCurrentTenantId(),
          uiConfig: {
            columns: [
              {
                label: "Name",
                jsonPath: "data.name",
              },
              {
                label: "Description",
                jsonPath: "data.description",
              },
              {
                label: "Executing Department",
                jsonPath: "data.executingDepartment",
              },
              {
                label:"Workflow status",
                jsonPath:"data.wfStatus"
              }
            ],
            enableGlobalSearch: false,
            enableColumnSort: true,
            resultsJsonPath: "mdms"
          },
          show: true,
        },
      },
    };
  };
  
  
  
  // const defaultSearchValues = {
  //     tenantId:"",
  //     schemaCode:""
  //   };
  // export const sorsearchconfig = () => 
  // {
  //   return {
  //     label: "Sor search",
  //     type: "search",
  //     apiDetails: {
  //       serviceName: "/mdms-v2/v2/_search", 
  //       requestParam: {
  //           "tenantId":Digit.ULBService.getCurrentTenantId()
  //       },
  //       requestBody: {
  //         apiOperation: "SEARCH",
  //         MdmsCriteria: {
  //           "tenantId": Digit.ULBService.getCurrentTenantId(),
  //           "customs":{}
  //         },
  //       },
  //      masterName: "commonUiConfig",
  //       moduleName: "SorSearchConfig", //change
  //       minParametersForSearchForm: 0,
  //       tableFormJsonPath: "requestParam",
  //       filterFormJsonPath: "requestBody.MdmsCriteria.customs",
  //       searchFormJsonPath: "requestBody.MdmsCriteria.customs",
  //     },
  //     sections: {
  //       search: {
  //         uiConfig: {
  //           formClassName: "custom-both-clear-search",
  //           primaryLabel: "ES_COMMON_SEARCH",
  //           secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
  //           minReqFields: 0,
  //           defaultValues: defaultSearchValues, // Set default values for search fields
  //           fields: [
  //             {
  //               label: "Tenant id ",
  //               isMandatory: false,
  //               key: "tenantId",
  //               type: "text",
  //               populators: { 
  //                 name: "tenantId", 
  //                 error: "Required", 
  //                 // validation: { pattern: /^[A-Za-z]+$/i } 
  //               },
  //             },
  //             {
  //               label: "Schema Code",
  //               isMandatory: false,
  //               key: "schemaCode",
  //               type: "text",
  //               disable: false,
  //               populators: { name: "schemaCode", error: "sample error message", validation: { min: 0, max: 999999999} },
  //             },
              
  //           ],
  //         },
  
  //         show: true
  //       },
  //       searchResult: {
  //         tenantId: Digit.ULBService.getCurrentTenantId(),
  //         uiConfig: {
  //           columns: [
  //             {
  //               label: "Tenant id",
  //               jsonPath: "tenantId",
  //             },
              
  //             {
  //               label: "Schema",
  //               jsonPath: "schema",
                
  //             },
              
  //           ],
  
  //           enableColumnSort: true,
  //           resultsJsonPath: "mdms"
  //         },
  //         show: true,
  //       },
  //     },
  //   };
  // };