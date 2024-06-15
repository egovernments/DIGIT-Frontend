const EstimateSearchConfig = () => {
  return {
    label: "WORKS_SEARCH_ESTIMATES",
    type: "search",
    actionLabel: "WORKS_ADD_ESTIMATE",
    actionRole: "INDIVIDUAL_CREATOR",
    actionLink: "masters/create-estimate",
    apiDetails: {
      serviceName: "/program-service/estimate/_search",
      requestParam: {},
      requestBody: {
        apiOperation: "SEARCH",
        "Criteria": {
          // "ids": [
          //   "a183b3f4-0556-4689-80d1-f47244f67206"
          // ],
          // "programCode": "JJM",
          // "projectCode": "AP-JJM",
          "tenantId": "pg.citya"
        },
        "Pagination": {
          "limit": 10,
          "offSet": 0,
          "sortBy": "string",
          "order": "asc"
        }
      },
      minParametersForSearchForm: 1,
      tableFormJsonPath: "requestParam",
      filterFormJsonPath: "requestBody.Criteria",
      searchFormJsonPath: "requestBody.Criteria",
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
            name: "",
            programCode: "",
            projectCode: "",
            // tenantId: ""
          },
          fields: [
            {
              label: "Program_Code",
              type: "text",
              isMandatory: false,
              disable: false,
              populators: { name: "programCode", maxlength: 140 } 
            },
            {
              label: "Project_Code",
              type: "text",
              isMandatory: false,
              disable: false,
              populators: { name: "projectCode", maxlength: 140 } 
            },
            {
              label: "ESTIMATE_ID",
              type: "text",
              isMandatory: false,
              disable: false,
              populators: { name: "estimateId", maxlength: 140 } 
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
                label: "ESTIMATE_ID",
                jsonPath: "estimateId",
                additionalCustomization: true,
            },
            {
              label: "NAME",
              jsonPath: "name",
            },
            {
              label: "DESCRIPTION",
              jsonPath: "description",
            },
            {
              label: "NET_AMOUNT",
              jsonPath: "netAmount",
            },
            {
              label: "GROSS_AMOUNT",
              jsonPath: "grossAmount",
            }
          ],
          enableGlobalSearch: false,
          enableColumnSort: true,
          resultsJsonPath: "Estimates",
        },
        children: {},
        show: true,
      },
    },
    additionalSections: {},
  };
};

export default EstimateSearchConfig;
