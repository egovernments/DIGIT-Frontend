
import { useTranslation } from "react-i18next";

const defaultSearchValues = {
    value: "",
    field: {}
  }
  export const datasearchconfig = () => 
  {
    const { t } = useTranslation();
    return {
      label: t("Data Collector"),
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
            customs:{}
            
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
        links:{
            uiConfig:{
                label:"this is my first try"
            },
            // show:true
        },
        search: {
          uiConfig: {
            searchWrapperStyles: {
              // display:"none",
              flexDirection:"column-reverse",
              marginTop:"0.5rem",
              alignItems:"center",
              justifyContent:"end",
              gridColumn:"4",
            },
            headerStyle:{background:"red",font:"red"} ,
            label:"Yuyuy",
            formClassName: "custom-both-clear-search",
            primaryLabel: t("ES_COMMON_SEARCH"),
            secondaryLabel:t( "ES_COMMON_CLEAR_SEARCH"),
            minReqFields: 0,
            defaultValues: defaultSearchValues, // Set default values for search fields
            fields: [
              {
                label: "Search User ",
                isMandatory: false,
                key: "vehicle",
                type: "text",
                populators: { 
                  name: "individualName", 
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
                label: "Name",
                jsonPath: "data.name",
              },
              {
                label: "Email",
                jsonPath: "data.description",
              },
              {
                label: "Contact number",
                jsonPath: "data.executingDepartment",
              },
              {
                label:"Administartive hierarchy",
                jsonPath:"data.wfStatus"
              },
              {
                label: "Administator",
                jsonPath: "data.proposalDate",
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
  
  
  
  