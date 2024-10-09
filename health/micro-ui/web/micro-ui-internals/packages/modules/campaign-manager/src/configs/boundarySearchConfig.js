export const boundarySearchConfig = [
    {
      // label: "Search",
      type: "search",
      apiDetails: {
        serviceName: "/boundary-service/boundary-hierarchy-definition/_search",
        requestParam: {
            "offset": 0,
            "limit": 10
        },
        requestBody: {
          BoundaryTypeHierarchySearchCriteria: {
            "tenantId": "mz",
            "hierarchyType": ""
          },
          "offset": 0,
          "limit": 10

        },
          Pagination:{
            "offset": 0,
            "limit": 10
          },
        masterName: "commonUiConfig",
        moduleName: "MyBoundarySearchConfig",
        minParametersForSearchForm: 0,
        tableFormJsonPath: "requestParam",
        filterFormJsonPath: "requestBody",
        searchFormJsonPath: "requestBody",
      },
      sections: {
        search: {
          uiConfig: {
            formClassName: "custom-both-clear-search",
            primaryLabel: "ES_COMMON_SEARCH",
            secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
            minReqFields: 0,
            fields: [
              {
                  label: "Hierarchy Name",
                  isMandatory: "false",
                  key: "Name",
                  type: "text",
                  populators: {
                    name: "Name",
                    optionsKey: "code",
                    // options:[]
                  }
              },
              // {
              //   label: "Type of Campaign",
              //   isMandatory: "false",
              //   key: "Type",
              //   type: "text",
              //   populators: {
              //     name: "Type",
              //     optionsKey: "list",
              //     // options:[]
              //   }
              // },
            ],
          },
  
          show: true
        },
        searchResult: {
          // tenantId: Digit.ULBService.getCurrentTenantId(),
          uiConfig: {
            columns: [
              {
                label: "Hierarchy Name",
                jsonpath: "hierarchyType",
                additionalCustomization: true
              },
              {
                label: "Levels",
                jsonpath: "auditDetails.createdBy",
                additionalCustomization: true
              },
              {
                label: "Creation Date",
                jsonpath: "auditDetails.createdTime",
                additionalCustomization: true
              },
              {
                label: "Action",
                jsonPath:"isActive",
                additionalCustomization: true
              }
            ],
  
            enableColumnSort: true,
            resultsJsonPath: "BoundaryHierarchy"
          },
          show: true,
        },
      },
    },
  ];
  