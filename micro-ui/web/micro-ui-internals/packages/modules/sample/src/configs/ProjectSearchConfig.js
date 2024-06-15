const projectSearchConfig = () => {
  return {
    label: "WORKS_SEARCH_WAGESEEKERS",
    type: "search",
    actionLabel: "WORKS_ADD_WAGESEEKER",
    actionRole: "INDIVIDUAL_CREATOR",
    actionLink: "masters/create-wageseeker",
    apiDetails: {
      serviceName: "/program-service/project/_search",
      requestParam: {},
      requestBody: {
        apiOperation: "SEARCH",
        "Criteria": {
          // "ids": [
          //   "251c51eb-e970-4e01-a99a-70136c47a934"
          // ],
          "tenantId": "pg.citya",
          // "programCode": "JJM",
          // "agencyId": "pg.citya/JJM/Implementing/ORG-000081",
          // "projectCode": "AP-JJM",
          // "projectId": "pg.citya/JJM/AP-JJM"
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
            // name: "",
            // orgNumber: "",
            // tenantId: ""
          },
          fields: [
            {
              label: "PROJECT_CODE",
              type: "text",
              isMandatory: false,
              disable: false,
              populators: { name: "projectCode", validation: { pattern: /^[^{0-9}^\$\"<>?\\\\~!@#$%^()+={}\[\]*,/_:;“”‘’]{1,50}$/i, maxlength: 140 } },
            },
            {
              label: "PROJECT_ID",
              type: "text",
              isMandatory: false,
              disable: false,
              populators: { name: "projectId", maxlength: 140 } 
            },
            {
              label: "PROGRAM_CODE",
              type: "text",
              isMandatory: false,
              disable: false,
              populators: { name: "programCode", maxlength: 140 } 
            },
            {
              label: "AGENCY_ID",
              type: "text",
              isMandatory: false,
              disable: false,
              populators: { name: "agencyId", maxlength: 140 } 
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
              label: "PROJECT_ID",
              jsonPath: "projectId",
                additionalCustomization: true,
            },
            {
              label: "NAME",
              jsonPath: "name",
            },
            {
              label: "PROGRAM_CODE",
              jsonPath: "programCode",
            },
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
          resultsJsonPath: "Projects",
        },
        children: {},
        show: true,
      },
    },
    additionalSections: {},
  };
};

export default projectSearchConfig;
