const searchWageSeekerConfig = () => {
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
        // Criteria: {
        //   "ids": [
        //     "251c51eb-e970-4e01-a99a-70136c47a934"
        //   ],
        //   // // "name": "Mukta",
        //   // "programCode": "PG/2023-24/000091",
        //    "tenantId": "pg.citya"
        // },
        // "Pagination": {
        //   "limit": 10,
        //   "offSet": 0,
        //   "sortBy": "string",
        //   "order": "asc"
        // }
        "SearchCriteria": {
          // "id": [],
          // "tenantId": "pg.citya",
          // "name": "",
          // "applicationNumber": "SR/ORG/02-05-2024/000041",
          "orgNumber": "ORG-000872"
          // "applicationStatus": "",
          // "contactMobileNumber": "",
          // "createdFrom": 0,
          // "createdTo": 0,
          // "functions": {
          //     "type": "",
          //     "organisationType": "",
          //     "category": null,
          //     "class": null,
          //     "validFrom": 0,
          //     "validTo": 0,
          //     "wfStatus": null,
          //     "isActive": true
          // },
          // "boundaryCode": "",
          // "identifierType": "",
          // "identifierValue": null,
          // "includeDeleted": false
      },
      "Pagination": {
          "offSet": 0,
          "limit": 10
      }
      },
      minParametersForSearchForm: 1,
      masterName: "commonUiConfig",
      // moduleName: "SearchWageSeekerConfig",
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
            programCode: "",
            // tenantId: ""
          },
          fields: [
            // {
            //   "label": "COMMON_WARD",
            //   "type": "locationdropdown",
            //   "isMandatory": false,
            //   "disable": false,
            //   "populators": {
            //       "name": "wardCode",
            //       "type": "ward",
            //     "optionsKey": "i18nKey",
            //       "defaultText": "COMMON_SELECT_WARD",
            //       "selectedText": "COMMON_SELECTED",
            //       "allowMultiSelect": false
            //   }
            // },
            {
              label: "NAME",
              type: "text",
              isMandatory: false,
              disable: false,
              populators: { name: "tenantId", validation: { pattern: /^[^{0-9}^\$\"<>?\\\\~!@#$%^()+={}\[\]*,/_:;“”‘’]{1,50}$/i, maxlength: 140 } },
            },
            // {
            //   label: "PROGRAM_CODE",
            //   type: "text",
            //   isMandatory: false,
            //   disable: false,
            //   populators: {
            //     name: "programCode",
            //     error: `PROJECT_PATTERN_ERR_MSG`,
            //     validation: {  minlength: 2 },
            //   },
            // }
            // {
            //   label: "CORE_COMMON_PROFILE_MOBILE_NUMBER",
            //   type: "mobileNumber",
            //   isMandatory: false,
            //   disable: false,
            //   populators: {
            //     name: "mobileNumber",
            //     error: `PROJECT_PATTERN_ERR_MSG`,
            //     validation: { pattern: /^[a-z0-9\/-@# ]*$/i, minlength: 2 },
            //   },
            // },
            // {
            //   label: "MASTERS_SOCIAL_CATEGORY",
            //   type: "dropdown",
            //   isMandatory: false,
            //   disable: false,
            //   populators: {
            //     name: "socialCategory",
            //     optionsKey: "code",
            //     optionsCustomStyle: {
            //       top: "2.3rem",
            //     },
            //     mdmsConfig: {
            //       masterName: "SocialCategory",
            //       moduleName: "common-masters",
            //       localePrefix: "MASTERS",
            //     },
            //   },
            // },
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
              label: "MASTERS_WAGESEEKER_ID",
              jsonPath: "individualId",
              additionalCustomization: true,
            },
            {
              label: "MASTERS_WAGESEEKER_NAME",
              jsonPath: "name.givenName",
            },
            {
              label: "MASTERS_FATHER_NAME",
              jsonPath: "fatherName",
            },
            {
              label: "MASTERS_SOCIAL_CATEGORY",
              jsonPath: "additionalFields.fields[0].value",
              // additionalCustomization: true,
            },
            {
              label: "CORE_COMMON_PROFILE_CITY",
              jsonPath: "address[0].tenantId",
              additionalCustomization: true,
            },
            {
              label: "MASTERS_WARD",
              jsonPath: "address[0].ward.code",
              additionalCustomization: true,
            },
            {
              label: "MASTERS_LOCALITY",
              jsonPath: "address[0].locality.code",
              additionalCustomization: true,
            },
          ],
          enableGlobalSearch: false,
          enableColumnSort: true,
          resultsJsonPath: "Criteria",
        },
        children: {},
        show: true,
      },
    },
    additionalSections: {},
  };
};

export default searchWageSeekerConfig;
