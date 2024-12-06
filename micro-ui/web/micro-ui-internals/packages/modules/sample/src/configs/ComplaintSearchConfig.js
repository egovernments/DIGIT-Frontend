const complaintSearchConfig = () => {
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
            // "id": [],
             "tenantId": "pg.citya",
            // "name": "",
            // "applicationNumber": "SR/ORG/02-05-2024/000041",
            // "orgNumber": "ORG-000872"
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
            resultsJsonPath: "organisations",
          },
          children: {},
          show: true,
        },
      },
      additionalSections: {},
    };
  };
  
  export default complaintSearchConfig;
  