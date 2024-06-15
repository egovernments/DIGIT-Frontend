const sanctionSearchConfig = () => {
  return {
    label: "SANCTION_SEARCH",
    type: "search",
    actionLabel: "SANCTION_ADD",
    actionRole: "INDIVIDUAL_CREATOR",
    actionLink: "masters/create-sanction",
    apiDetails: {
      serviceName: "/program-service/sanction/_search",
      requestParam: {},
      requestBody: {
        apiOperation: "SEARCH",
        "Criteria": {
          "tenantId": "pg.citya",
          // "sanctionId": "pg.citya/JJM/AP-JJM/SA-2069055"
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
              label: "SANCTION_ID",
              type: "text",
              isMandatory: false,
              disable: false,
              populators: { name: "sanctionId", maxlength: 140 } 
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
              populators: { name: "projectCode", maxlength: 140 } 
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
              label: "SANCTION_ID",
              jsonPath: "sanctionId",
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
              label: "AVAILABLE_AMOUNT",
              jsonPath: "availableAmount",
            }
          ],
          enableGlobalSearch: false,
          enableColumnSort: true,
          resultsJsonPath: "Sanctions",
        },
        children: {},
        show: true,
      },
    },
    additionalSections: {},
  };
};

export default sanctionSearchConfig;
