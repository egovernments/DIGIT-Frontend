const defaultSearchValues = {
  value: "",
  field: {}
}
export const searchconfig = () => 
{
  return {
    label: "Estimate Search",
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
      moduleName: "SearchEstimateConfig",
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
              label: "WBH_FIELD",
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
                ],
              },
            },
            {
              label: "WBH_FIELD_VALUE",
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
              label: "Description",
              jsonPath: "data.description",
            },
            {
              label: "Executing Department",
              jsonPath: "data.executingDepartment",
            },
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