/* const defaultSearchValues = {
    tenantName: "",
    tenantCode: ""  
  };
export const tenantSearchConfig = () => 
{
  return {
    label: "Tenant Search",
    type: "search",
    apiDetails: {
      serviceName: "/tenant-management/tenant/_search",
      requestBody: {
        apiOperation: "SEARCH",
        Individual: {
          "tenantId": Digit.ULBService.getCurrentTenantId(),
        },
      },
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
              label: "Tenant name ",
              isMandatory: false,
              key: "name",
              type: "tenantName",
              populators: { 
                name: "tenantName", 
                error: "Required", 
                validation: { pattern: /^[A-Za-z]+$/i } 
              },
            },
            {
              label: "Tenant code",
              isMandatory: false,
              key: "tenantCode",
              type: "text",
              disable: false,
              populators: { 
                name: "tenantCode", 
                error: "Required", 
                validation: { pattern: /^[A-Za-z]+$/i } 
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
          resultsJsonPath: "Individual"
        },
        show: true,
      },
    },
  };
};  */




const defaultSearchValues = {
  tenantName: "",
  tenantCode: ""
};
export const tenantSearchConfig = (data) => 
{
return {
  label: "Tenant Search",
  type: "search",
  apiDetails: {
    serviceName: "/tenant-management/tenant/_search",
    requestParam: {
        "name":tenantName,
        "code":tenantCode
    },
    requestBody: {

    },
    masterName: "commonUiConfig",
    moduleName: "tenantSearchConfig",
    minParametersForSearchForm: 0,
    tableFormJsonPath: "requestParam",
    filterFormJsonPath: "requestBody.tenant",
    searchFormJsonPath: "requestBody.tenant",
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
            label: "Tenant name ",
            isMandatory: false,
            key: "tenantName",
            type: "text",
            populators: { 
              name: "name", 
              error: "Required", 
              validation: { pattern: /^[A-Za-z]+$/i } 
            },
          },
          {
            label: "Tenant code ",
            isMandatory: false,
            key: "tenantCode",
            type: "text",
            populators: { 
              name: "code", 
              error: "Required", 
              validation: { pattern: /^[A-Za-z]+$/i } 
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
            label: "code",
            jsonPath: "code",
          },
          
          {
            label: "name",
            jsonPath: "name",
            
          },
          {
            label: "email",
            jsonPath: "email",
          },
        ],

        enableColumnSort: true,
        resultsJsonPath: "Tenants"
      },
      show: true,
    },
  },
};
};