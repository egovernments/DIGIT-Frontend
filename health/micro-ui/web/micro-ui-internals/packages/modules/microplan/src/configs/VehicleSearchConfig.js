
import { useTranslation } from "react-i18next";

const defaultSearchValues = {
    value: "",
    field: {}
  }
  export const vehiclesearchconfig = () => 
  {
    const { t } = useTranslation();
    return {
      // label:"Choose Vehicles For Campaign ",
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
        moduleName: "VehicleSearchConfig",
        minParametersForSearchForm: 0,
        tableFormJsonPath: "requestParam",
        filterFormJsonPath: "requestBody.MdmsCriteria.customs",
        searchFormJsonPath: "requestBody.MdmsCriteria.customs",
      },
      sections: {
        search: {
          uiConfig: {
            showFormInstruction:"Please choose the vehicles that will ne used in the campaign",
            searchWrapperStyles: {
              // display:"none",
              flexDirection:"column-reverse",
              marginTop:"0.5rem",
              alignItems:"center",
              justifyContent:"end",
              gridColumn:"4",
            },
            headerStyle: null,
            label:"Yuyuy",
            headerLabel:"Please choose the vehicle",
            formClassName: "custom-both-clear-search",
            primaryLabel: t("ES_COMMON_SEARCH"),
            secondaryLabel:t( "ES_COMMON_CLEAR_SEARCH"),
            minReqFields: 0,
            defaultValues: defaultSearchValues, // Set default values for search fields
            fields: [     //!label-field pair
              // {
              //   label: "Vehicle Type ",
              //   isMandatory: false,
              //   key: "vehicle",
              //   type: "text",
              //   style: { fontSize: "1rem", color: "blue" },
              //   populators: { 
              //     name: "individualName", 
              //     error: "Required", 
              //     validation: { pattern: /^[A-Za-z]+$/i } 
              //   },
              // },

              {
                label: "Choose Vehicle Type",
                key: "field",            //note
                type: "dropdown",
                isMandatory: false,
                disable: false,
                populators: {
                  name: "field",
                  optionsKey: "label",
                  optionsCustomStyle: { top: "2.3rem"},
                  options: [
                    {
                      label: "Motorcycle",
                      name: "motorcycle",
                    },
                    {
                      label: "Truck",
                      name: "truck",
                    },
                    
                    
  
                  ],
                },
              },


              // {
              //   label: "Phone number",
              //   isMandatory: false,
              //   key: "Phone number",
              //   type: "number",
              //   disable: false,
              //   populators: { name: "mobileNumber", error: "sample error message", validation: { min: 0, max: 999999999} },
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
                additionalCustomization: true
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
  
  
  
  