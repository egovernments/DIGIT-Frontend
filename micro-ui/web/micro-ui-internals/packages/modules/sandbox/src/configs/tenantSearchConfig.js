export const tenantSearchConfig = () => 
  (
    {
  moduleName: "commonSandboxUiConfig",
  showTab: false,
  tenantSearchConfig: [
    {
      label: `Tenant Search`,
      type: "search",
      apiDetails: {
        serviceName: "/tenant-management/tenant/_search",
        requestParam: {},
        requestBody: {},
        minParametersForSearchForm: 0,
        minParametersForFilterForm: 0,
        masterName: "commonUiConfig",
        moduleName: "tenantSearchConfig",
        tableFormJsonPath: "requestBody.inbox",
        filterFormJsonPath: "requestBody.tenant",
        searchFormJsonPath: "requestBody.tenant",

      },
      sections: {
        search: {
          uiConfig: {
            headerLabel: "ES_COMMON_SEARCH",
            type: "search",
            typeMobile: "filter",
            searchWrapperStyles: {
              flexDirection: "column-reverse",
              marginTop: "1.4rem",
              alignItems: "center",
              justifyContent: "end",
              gridColumn: "3",
            },
            headerStyle: null,
            primaryLabel: "Search",
            secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
            minReqFields: 0,
            defaultValues: {
              name: "",
              code: "",
            },
          fields: [
          {
            label: "Tenant name ",
            isMandatory: true,
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
          label: "",
          labelMobile: "ES_COMMON_SEARCH",
          children: {},
          show: true,
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
        links: {
          show: false,
        },
        filter: {
          show: false,
        },
      },
      additionalSections: {},
      persistFormData: true,
      showAsRemovableTagsInMobile: false,
    },
  ],
}
);
