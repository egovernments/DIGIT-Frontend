const disburseSearchConfig = () => {
  return {
    label: "DISBURSE_SEARCH",
    type: "search",
    actionLabel: "DISBURSE_ADD",
    actionRole: "INDIVIDUAL_CREATOR",
    actionLink: "masters/create-disburse",
    apiDetails: {
      serviceName: "/program-service/disburse/_search",
      requestParam: {},
      requestBody: {
        apiOperation: "SEARCH",
        "Criteria": {
          // "ids": [
          //   "a8474c19-3351-4b55-bd3e-0a4cebcb084b"
          // ],
          "tenantId": "pg.citya",
          // "programCode": "JJM",
          // "projectCode": "AP-JJM",
          // "disburseId": "pg.citya/JJM/AP-JJM/DI-2069062",
          // "targetId": "EP/0/2023-24/08/14/000267, 251c51eb-e970-4e01-a99a-70136c47a934"
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
          formClassName: "custom-both-clear-search",
          primaryLabel: "ES_COMMON_SEARCH",
          secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
          minReqFields: 1,
          defaultValues: {},
          fields: [
            {
              label: "DISBURSE_ID",
              type: "text",
              isMandatory: false,
              disable: false,
              populators: { name: "disburseId", maxlength: 140 }
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
              label: "DISBURSE_ID",
              jsonPath: "disburseId",
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
              label: "TRANSACTION_ID",
              jsonPath: "transactionId",
            },
            {
              label: "SANCTION_ID",
              jsonPath: "sanctionId",
            }
          ],
          enableGlobalSearch: false,
          enableColumnSort: true,
          resultsJsonPath: "Disburses",
        },
        children: {},
        show: true,
      },
    },
    additionalSections: {},
  };
};

export default disburseSearchConfig;
