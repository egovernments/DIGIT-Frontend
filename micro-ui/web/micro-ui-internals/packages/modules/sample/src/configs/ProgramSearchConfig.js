const programSearchConfig = () => {
  return {
    label: "WORKS_SEARCH_WAGESEEKERS",
    type: "search",
    actionLabel: "WORKS_ADD_WAGESEEKER",
    actionRole: "INDIVIDUAL_CREATOR",
    actionLink: "masters/create-wageseeker",
    apiDetails: {
      serviceName: "/program-service/program/_search",
      requestParam: {},
      requestBody: {
        apiOperation: "SEARCH",
        "Criteria": {
          // "ids": [
          //   "251c51eb-e970-4e01-a99a-70136c47a934"
          // ],
          // "programCode": program_code,
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
      // masterName: "commonUiConfig",
      // moduleName: "organizationSearchConfig",
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
            // ids: [
            //   "251c51eb-e970-4e01-a99a-70136c47a934"
            // ],
            name: "",
            programCode: "",
            // tenantId: ""
          },
          fields: [
            // {
            //   label: "NAME",
            //   type: "text",
            //   isMandatory: false,
            //   disable: false,
            //   populators: { name: "name", validation: { pattern: /^[^{0-9}^\$\"<>?\\\\~!@#$%^()+={}\[\]*,/_:;“”‘’]{1,50}$/i, maxlength: 140 } },
            // },
            {
              label: "Program Code",
              type: "text",
              isMandatory: false,
              disable: false,
              populators: { name: "programCode", maxlength: 140 } 
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
                label: "PROGRAM_ID",
                jsonPath: "programId",
                additionalCustomization: true,
            },
            {
              label: "NAME",
              jsonPath: "name",
            },
            // {
            //   label: "APPLICATION_NUMBER",
            //   jsonPath: "applicationNumber",
            // },
            // {
            //   label: "MASTERS_SOCIAL_CATEGORY",
            //   jsonPath: "additionalFields.fields[0].value",
            //   // additionalCustomization: true,
            // },
            // {
            //   label: "CORE_COMMON_PROFILE_CITY",
            //   jsonPath: "address[0].tenantId",
            //   additionalCustomization: true,
            // },
            // {
            //   label: "MASTERS_WARD",
            //   jsonPath: "address[0].ward.code",
            //   additionalCustomization: true,
            // },
            // {
            //   label: "MASTERS_LOCALITY",
            //   jsonPath: "address[0].locality.code",
            //   additionalCustomization: true,
            // },
          ],
          enableGlobalSearch: false,
          enableColumnSort: true,
          resultsJsonPath: "Programs",
        },
        children: {},
        show: true,
      },
    },
    additionalSections: {},
  };
};

export default programSearchConfig;
