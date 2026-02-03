export const tenantSearchConfig = () => 
  (
    {
  moduleName: "commonSandboxUiConfig",
  showTab: false,
  tenantSearchConfig: [
    {
      label: `SANDBOX_TENANT_SEARCH_HEADER`,
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
            label: "SANDBOX_TENANT_SEARCH_NAME_LABEL",
            isMandatory: true,
            key: "tenantName",
            type: "text",
            populators: { 
              name: "name", 
              error: "Required", 
              validation: { pattern: /^[A-Za-z0-9]+$/i } 
            },
          },
          {
            label: "SANDBOX_TENANT_SEARCH_CODE_LABEL",
            isMandatory: false,
            key: "tenantCode",
            type: "text",
            populators: { 
              name: "code", 
              error: "Required", 
              validation: { pattern: /^[A-Za-z0-9]+$/i } 
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
            label: "SANDBOX_TENANT_COLUMN_CODE",
            jsonPath: "code",
          },
          
          {
            label: "SANDBOX_TENANT_COLUMN_NAME",
            jsonPath: "name",
            
          },
          {
            label: "SANDBOX_TENANT_COLUMN_EMAIL",
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
