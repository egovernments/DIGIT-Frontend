const allocationSearchConfig = () => {
  return {
    label: "ALLOCATION_SEARCH",
    type: "search",
    actionLabel: "ALLOCATION_ADD",
    actionRole: "INDIVIDUAL_CREATOR",
    actionLink: "masters/create-allocation",
    apiDetails: {
      serviceName: "/program-service/allocation/_search",
      requestParam: {},
      requestBody: {
        apiOperation: "SEARCH",
        "Criteria": {
          "tenantId": "pg.citya",
          // "programCode": "JJM",
          // "projectCode": "AP-JJM",
          // "sanctionId": "pg.citya/JJM/AP-JJM/SA-2069055",
          // "allocationId": "pg.citya/JJM/AP-JJM/AL-2069056"
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
          },
          fields: [
            {
              label: "ALLOCATION_ID",
              type: "text",
              isMandatory: false,
              disable: false,
              populators: { name: "allocationId", maxlength: 140 } 
            },
            {
              label: "PROGRAM_CODE",
              type: "text",
              isMandatory: false,
              disable: false,
              populators: { name: "programCode", maxlength: 140 } 
            },
            {
              label: "PROJECT_CODE",
              type: "text",
              isMandatory: false,
              disable: false,
              populators: { name: "projectCode", validation: { pattern: /^[^{0-9}^\$\"<>?\\\\~!@#$%^()+={}\[\]*,/_:;“”‘’]{1,50}$/i, maxlength: 140 } },
            },
            {
              label: "SANCTION_ID",
              type: "text",
              isMandatory: false,
              disable: false,
              populators: { name: "sanctionId", maxlength: 140 } 
            },
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
              label: "ALLOCATION_ID",
              jsonPath: "allocationId",
            },
            {
              label: "NET_AMOUNT",
              jsonPath: "netAmount",
            },
            {
              label: "GROSS_AMOUNT",
              jsonPath: "grossAmount",
            },
            {
              label: "ALLOCATION_TYPE",
              jsonPath: "allocationType",
            }
          ],
          enableGlobalSearch: false,
          enableColumnSort: true,
          resultsJsonPath: "Allocations",
        },
        children: {},
        show: true,
      },
    },
    additionalSections: {},
  };
};

export default allocationSearchConfig;
