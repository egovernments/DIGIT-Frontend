const defaultSearchValues = {
    value: "",
    field: {}
  }
  export const vehiclesearchconfig = () => 
  {
    return {
      label: "Vehicle Search",
      type: "search",
      apiDetails: {
        serviceName: "/mdms-v2/v2/_search",
        requestParam: {
            "tenantId":Digit.ULBService.getCurrentTenantId()
        },
        requestBody: {
          apiOperation: "SEARCH",
          MdmsCriteria: {
            "tenantId": Digit.ULBService.getCurrentTenantId(),
            "customs": {}
            // "schemaCode": ""
          },
        },
       masterName: "commonUiConfig",
        moduleName: "VehicleSearchConfig",
        minParametersForSearchForm: 0,
        tableFormJsonPath: "requestParam",
        filterFormJsonPath: "requestBody.MdmsCriteria.customs",
        searchFormJsonPath: "requestBody.MdmsCriteria.customs",
      },
      sections: {
        search: {
          uiConfig: {
            searchWrapperStyles: {
              // display:"none",
              flexDirection:"column-reverse",
              marginTop:"0.5rem",
              alignItems:"center",
              justifyContent:"end",
              gridColumn:"4",
              showFormInstruction:"hjbwdncckjds"
            },
            headerStyle: null,
            label:"Yuyuy",
            formClassName: "custom-both-clear-search",
            primaryLabel: "ES_COMMON_SEARCH",
            secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
            minReqFields: 0,
            defaultValues: defaultSearchValues, // Set default values for search fields
            fields: [
              // {
              //   label: "Choose Vehicle",
              //   key: "field",
              //   type: "textArea",
              //   isMandatory: false,
              //   disable: false,
              //   populators: {
              //     name: "field",
              //     optionsKey: "label",
              //     optionsCustomStyle: { top: "0rem" },  //search field
              //     options: [
              //       {
              //         label: "Select Vehicle Type",
              //         name: "name",
              //       },
                   
              //     ],
              //   },
              // },
              {
                label: "Choose  Type",
                key: "field",
                type: "dropdown",
                isMandatory: false,
                disable: false,
                populators: {
                  name: "field",
                  optionsKey: "label",
                  optionsCustomStyle: { top: "0rem" },  //search field
                  options: [
                    {
                      label: "Select Vehicle Type",
                      name: "name",
                    },
                   
                  ],
                },
              },
              // {
              //   label: "Field Value",
              //   type: "text",
              //   key: "value",
              //   isMandatory: false,
              //   disable: false,
              //   populators: {
              //     name: "value",
              //     validation: { pattern: {}, maxlength: 140 },
              //   },
              // },
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
          show: true
        },
        searchResult: {
          tenantId: Digit.ULBService.getCurrentTenantId(),
          uiConfig: {
            columns: [
              {
                label: "Vehicle Type",
                jsonPath: "data.name",
              },
              {
                label: "Manufacturer",
                jsonPath: "data.description",
              },
              {
                label: "Model",
                jsonPath: "data.executingDepartment",
              },
              {
                label:"Capacity",
                jsonPath:"data.wfStatus"
              }
            ],
            enableGlobalSearch: false,
            enableColumnSort: true,
            resultsJsonPath: "mdms",
            showCheckBox:true
          },
          show: true,
        },
      },
    };
  };
  
  
  
  