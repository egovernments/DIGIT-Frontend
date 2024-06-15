const organizationSearchConfig = () => {
  return {
    label: "WORKS_SEARCH_WAGESEEKERS",
    type: "search",
    actionLabel: "WORKS_ADD_WAGESEEKER",
    actionRole: "INDIVIDUAL_CREATOR",
    actionLink: "masters/create-wageseeker",
    apiDetails: {
      serviceName: "/org-services/organisation/v1/_search",
      requestParam: {},
      requestBody: {
        apiOperation: "SEARCH",
        "SearchCriteria": {
           "tenantId": "pg.citya",
      },
      "Pagination": {
          "offSet": 0,
          "limit": 10
      }
      },
      minParametersForSearchForm: 1,
      masterName: "commonUiConfig",
      moduleName: "organizationSearchConfig",
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
            // ids: [
            //   "251c51eb-e970-4e01-a99a-70136c47a934"
            // ],
            name: "",
            orgNumber: "",
            // tenantId: ""
          },
          fields: [
            {
              label: "NAME",
              type: "text",
              isMandatory: false,
              disable: false,
              populators: { name: "name", validation: { pattern: /^[^{0-9}^\$\"<>?\\\\~!@#$%^()+={}\[\]*,/_:;“”‘’]{1,50}$/i, maxlength: 140 } },
            },
            {
              label: "ORG NUMBER",
              type: "text",
              isMandatory: false,
              disable: false,
              populators: { name: "orgNumber", maxlength: 140 } 
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
              label: "ORG_NUMBER",
              jsonPath: "orgNumber",
                additionalCustomization: true,
            },
            {
              label: "NAME",
              jsonPath: "name",
            },
            {
              label: "APPLICATION_NUMBER",
              jsonPath: "applicationNumber",
            },
          ],
          enableGlobalSearch: false,
          enableColumnSort: true,
          resultsJsonPath: "organisations",
        },
        children: {},
        show: true,
      },
    },
    additionalSections: {},
  };
};

export default organizationSearchConfig;
