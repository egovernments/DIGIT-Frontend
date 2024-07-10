const advanceSearchConfig = () => {
    return {
      label: "WORKS_SEARCH_WAGESEEKERS",
      type: "search",
      actionLabel: "WORKS_ADD_WAGESEEKER",
      actionRole: "INDIVIDUAL_CREATOR",
      actionLink: "masters/create-wageseeker",
      apiDetails: {
        serviceName: "/semantic-indexer/_search",
        requestParam: {},
        requestBody: {
          apiOperation: "SEARCH",
          "SearchCriteria": {
            // "query": "drain ",
            // "threshold": 1.5,
            "ES_INDEX": "semantic_indices",
            "tenantId":  Digit.ULBService.getCurrentTenantId()
        }
        },
        minParametersForSearchForm: 1,
        masterName: "commonUiConfig",
        moduleName: "advanceSearchConfig",
        tableFormJsonPath: "requestParam",
        filterFormJsonPath: "requestBody.SearchCriteria",
        searchFormJsonPath: "requestBody.SearchCriteria",
      },
      sections: {
        search: {
          uiConfig: {
            headerStyle: null,
            formClassName:"custom-both-clear-search",
            primaryLabel: "ES_COMMON_SEARCH",
            secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
            minReqFields: 1,
            defaultValues: {

            },
            fields: [
              {
                label: "Query",
                type: "text",
                isMandatory: false,
                disable: false,
                populators: { name: "query", validation: { pattern: /^[^{0-9}^\$\"<>?\\\\~!@#$%^()+={}\[\]*,/_:;“”‘’]{1,50}$/i, maxlength: 140 } },
              },
              {
                label: "Threshold",
                type: "text",
                isMandatory: false,
                disable: false,
                populators: { name: "threshold", maxlength: 140 } 
              }
            ],
          },
          label: "",
          children: {},
          show: true,
        },
        searchResult: {
          label: "",
          uiConfig: {
            columns: [
              {
                label: "SERVICE_REQUESTER_ID",
                jsonPath: "service.serviceRequestId",
                  additionalCustomization: true,
              },
              {
                label: "SERVICE_CODE",
                jsonPath: "service.serviceCode",
              },
              {
                label: "DESCRIPTION",
                jsonPath: "service.description",
              },
            ],
            enableGlobalSearch: false,
            enableColumnSort: true,
            resultsJsonPath: "ServiceWrappers",
          },
          children: {},
          show: true,
        },
      },
      additionalSections: {},
    };
  };
  
  export default advanceSearchConfig;
  